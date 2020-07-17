<template>
  <el-dialog :title="formStatus.title" :visible.sync="formStatus.visible" :before-close="closeDialog">
    <div style="margin-bottom: 5px">
      <el-row :gutter="24" style="margin-bottom: 5px">
        <el-select v-model="userGroupId" filterable clearable
                   style="display: inline-block; max-width:200px; margin-left: 10px"
                   remote reserve-keyword placeholder="输入关键词搜索用户组" :remote-method="getUserGroup" :loading="loading">
          <el-option
            v-for="item in userGroupOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button type="success" :disabled="userGroupId == ''" plain size="mini" @click="grantUserGroup()"
                   style="margin-left: 10px">授权
        </el-button>
      </el-row>
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="已授权用户组名称"></el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="danger" plain size="mini" @click="revokeUserGroup(scope.row)">解除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange"
                   layout="prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { grantUserUserGroup, revokeUserUserGroup, queryUserIncludeUserGroupPage, queryUserExcludeUserGroupPage } from '@api/user/user.group.js'

  export default {
    data () {
      return {
        userGroupId: '',
        user: {},
        tableData: [],
        userGroupOptions: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    name: 'user-usergroup-dialog',
    props: ['formStatus'],
    mixins: [],
    mounted () {
    },
    methods: {
      initData (user) {
        // 初始化数据
        this.user = user
        this.userGroupId = ''
        this.pagination.currentPage = 1
        this.getUserGroup('')
        this.fetchData()
      },
      getUserGroup (queryName) {
        queryUserExcludeUserGroupPage(this.user.id, queryName, 1, 20)
          .then(res => {
            this.userGroupOptions = res.body.data
          })
      },
      closeDialog () {
        this.formStatus.visible = false
        this.$emit('closeUserUserGroupDialog')
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      grantUserGroup () {
        setTimeout(() => {
          grantUserUserGroup(this.user.id, this.userGroupId)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.userGroupId = ''
              this.getUserGroup('')
              this.fetchData()
            })
        }, 30)
      },
      revokeUserGroup (row) {
        setTimeout(() => {
          revokeUserUserGroup(this.user.id, row.id)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.getUserGroup('')
              this.fetchData()
            })
        }, 30)
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        queryUserIncludeUserGroupPage(this.user.id, this.pagination.currentPage, this.pagination.pageSize)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
          })
      }
    }
  }
</script>
