<template>
  <div>
    <el-select v-model="queryParam.roleId" filterable clearable
               remote reserve-keyword placeholder="输入关键词搜索角色" :remote-method="getRole"
               style="display: inline-block; max-width:200px">
      <el-option
        v-for="item in roleOptions"
        :key="item.id"
        :label="item.roleName"
        :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="queryParam.groupId" filterable clearable
               remote reserve-keyword placeholder="输入关键词搜索资源组" :remote-method="getGroup"
               style="margin-left: 5px">
      <el-option
        v-for="item in groupOptions"
        :key="item.id"
        :label="item.groupCode"
        :value="item.id">
      </el-option>
    </el-select>
    <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>

    <el-row :gutter="20">
      <el-col :span="12" v-if="tableUnbindData.length != 0">
        <div>
          <h3>未绑定资源</h3>
        </div>
        <el-table :data="tableUnbindData" style="width: 100%" :loading="unbindLoading">
          <el-table-column prop="resourceName" label="资源路径"></el-table-column>
          <el-table-column prop="comment" label="描述"></el-table-column>
          <el-table-column fixed="right" label="操作" width="280">
            <template slot-scope="scope">
              <el-button type="success" plain size="mini" @click="roleBindResource(scope.row)">绑定</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background @current-change="unbindPaginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                       layout="sizes, prev, pager, next"  :total="unbindPagination.total"
                       :current-page="unbindPagination.currentPage"
                       :page-size="unbindPagination.pageSize">
        </el-pagination>
      </el-col>
      <el-col :span="12" v-if="tableBindData.length != 0">
        <div>
          <h3>已绑定资源</h3>
        </div>
        <el-table :data="tableBindData" style="width: 100%" :loading="bindLoading">
          <el-table-column prop="resourceName" label="资源路径"></el-table-column>
          <el-table-column prop="comment" label="描述"></el-table-column>
          <el-table-column fixed="right" label="操作" width="280">
            <template slot-scope="scope">
              <el-button type="danger" plain size="mini" @click="roleUnbindResource(scope.row)">解除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background @current-change="bindPaginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                       layout="sizes, prev, pager, next"  :total="bindPagination.total"
                       :current-page="bindPagination.currentPage"
                       :page-size="bindPagination.pageSize">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  // API
  import { queryRolePage } from '@api/auth/auth.role.js'
  import { queryGroupPage } from '@api/auth/auth.group.js'
  import {
    queryRoleBindResourcePage,
    queryRoleUnbindResourcePage,
    bindRoleResource,
    unbindRoleResource
  } from '@api/auth/auth.role.resource.js'

  export default {
    name: 'AuthRoleResourceTable',
    data () {
      return {
        tableUnbindData: [],
        tableBindData: [],
        bindLoading: false,
        unbindLoading: false,
        bindPagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        unbindPagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          roleId: '',
          groupId: ''
        },
        roleOptions: [],
        groupOptions: []
      }
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    mounted () {
      this.initPageSize()
      this.getRole('')
      this.getGroup('')
    },
    methods: {
      ...mapActions({
        setPageSize: 'd2admin/user/set'
      }),
      handleSizeChange (size) {
        this.bindPagination.pageSize = size
        this.unbindPagination.pageSize = size
        this.info.pageSize = size
        this.setPageSize(this.info)
        this.fetchData()
      },
      initPageSize () {
        if (typeof (this.info.pageSize) !== 'undefined') {
          this.bindPagination.pageSize = this.info.pageSize
          this.unbindPagination.pageSize = this.info.pageSize
        }
      },
      getRole (roleName) {
        queryRolePage(roleName, '', 1, 20)
          .then(res => {
            this.roleOptions = res.body.data
          })
      },
      getGroup (groupCode) {
        queryGroupPage(groupCode, 1, 20)
          .then(res => {
            this.groupOptions = res.body.data
          })
      },
      roleBindResource (row) {
        setTimeout(() => {
          var requestBody = {
            'resourceId': row.id,
            'roleId': this.queryParam.roleId
          }
          bindRoleResource(requestBody)
            .then(res => {
              // 返回数据
              this.$message({
                message: '绑定成功',
                type: 'success'
              })
              this.fetchData()
            })
        }, 600)
      },
      roleUnbindResource (row) {
        setTimeout(() => {
          unbindRoleResource(row.id)
            .then(res => {
              // 返回数据
              this.$message({
                message: '解除绑定成功',
                type: 'success'
              })
              this.fetchData()
            })
        }, 600)
      },
      bindPaginationCurrentChange (currentPage) {
        this.bindPagination.currentPage = currentPage
        this.fetchBindData()
      },
      unbindPaginationCurrentChange (currentPage) {
        this.unbindPagination.currentPage = currentPage
        this.fetchUnbindData()
      },
      fetchData () {
        this.fetchBindData()
        this.fetchUnbindData()
      },
      fetchBindData () {
        this.bindLoading = true
        // 绑定的资源
        queryRoleBindResourcePage(this.queryParam.roleId, this.queryParam.groupId, this.bindPagination.currentPage, this.bindPagination.pageSize)
          .then(res => {
            this.tableBindData = res.body.data
            this.bindPagination.total = res.body.totalNum
            this.bindLoading = false
          })
      },
      fetchUnbindData () {
        this.unbindLoading = true
        queryRoleUnbindResourcePage(this.queryParam.roleId, this.queryParam.groupId, this.unbindPagination.currentPage, this.unbindPagination.pageSize)
          .then(res => {
            this.tableUnbindData = res.body.data
            this.unbindPagination.total = res.body.totalNum
            this.unbindLoading = false
          })
      }
    }
  }
</script>

<style scoped>

</style>
