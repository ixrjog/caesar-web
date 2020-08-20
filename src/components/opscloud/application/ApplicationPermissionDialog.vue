<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" :before-close="closeDialog">
    <div style="margin-bottom: 5px">
      <el-row :gutter="24" style="margin-bottom: 5px">
        <el-select v-model="userId" filterable clearable
                   style="display: inline-block; max-width:200px; margin-left: 10px"
                   remote reserve-keyword placeholder="输入关键词搜索用户" :remote-method="getUser" :loading="searchLoading">
          <el-option
            v-for="item in userOptions"
            :key="item.id"
            :label="item.username"
            :value="item.id">
            <span style="float: left">{{ item.username }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px ;margin-left:  10px">{{ item.displayName }}</span>
          </el-option>
        </el-select>
        <el-button type="success" :disabled="userId === ''" plain size="mini" @click="grantUser()"
                   style="margin-left: 10px">授权
        </el-button>
      </el-row>
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="displayName" label="显示名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          <el-tag :type="scope.row.userPermission.roleName ==='ADMIN' ? 'danger': 'success'" size="small">
            {{scope.row.userPermission.roleName ==='ADMIN' ? '管理员': '用户'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handlerRowUpdatePermission(scope.row)">{{scope.row.userPermission.roleName ==='ADMIN' ? '降权': '提权'}}</el-button>
          <el-button type="danger" plain size="mini" @click="handlerRowRevokeUser(scope.row)">撤销</el-button>
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
  import { queryApplicationExcludeUserPage, queryApplicationIncludeUserPage } from '@api/user/user.application.js'
  import { grantUserApplication, revokeUserApplication, updateUserApplicationPermission } from '@api/application/application.js'

  export default {
    data () {
      return {
        title: '应用授权管理',
        application: {},
        tableData: [],
        loading: false,
        searchLoading: false,
        userId: '',
        userOptions: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          queryName: ''
        }
      }
    },
    name: 'ApplicationUserDialog',
    props: ['formStatus'],
    mixins: [],
    mounted () {
    },
    methods: {
      initData (application) {
        // 初始化数据
        this.application = application
        this.userId = ''
        this.pagination.currentPage = 1
        this.getUser('')
        this.fetchData()
      },
      getUser (queryName) {
        this.searchLoading = true
        let requestBody = {
          'queryName': queryName,
          'applicationId': this.application.id,
          'page': 1,
          'length': 10
        }
        queryApplicationExcludeUserPage(requestBody)
          .then(res => {
            this.userOptions = res.body.data
            this.searchLoading = false
          })
      },
      closeDialog () {
        this.formStatus.visible = false
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      grantUser () {
        setTimeout(() => {
          grantUserApplication(this.application.id, this.userId)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.userId = ''
              this.getUser('')
              this.fetchData()
            })
        }, 30)
      },
      handlerRowUpdatePermission (row) {
        setTimeout(() => {
          updateUserApplicationPermission(this.application.id, row.id)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.userId = ''
              this.getUser('')
              this.fetchData()
            })
        }, 30)
      },
      handlerRowRevokeUser (row) {
        setTimeout(() => {
          revokeUserApplication(this.application.id, row.id)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.getUser('')
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
        let requestBody = {
          'queryName': this.queryParam.queryName,
          'applicationId': this.application.id,
          'page': 1,
          'length': 10
        }
        queryApplicationIncludeUserPage(requestBody)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
          })
      }
    }
  }
</script>
