<template>
  <d2-container>
    <template>
      <div>
        <h1>用户角色配置</h1>
      </div>
      <div style="margin-bottom: 5px">
        <el-row :gutter="24" style="margin-bottom: 5px">
          <el-input v-model="queryParam.username" placeholder="用户名" class="input-search-bar"/>
          <el-select v-model="queryParam.roleId" filterable clearable
                     remote reserve-keyword placeholder="输入关键词搜索角色" :remote-method="getRole" :loading="loading"
                     class="search-bar">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button @click="fetchData" class="search-bar">查询</el-button>
          <el-button @click="addItem" class="search-bar">新增</el-button>
          <el-button @click="handlerSyncUserRole" class="search-bar">同步</el-button>
        </el-row>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="displayName" label="显示名"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="roleComment" label="描述"></el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]"
                     @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                     :page-size="pagination.pageSize">
      </el-pagination>
      <UserRoleDialog :formStatus="formUserRoleStatus" :formData="userRole"
                      @closeUserRoleDialog="fetchData"></UserRoleDialog>
    </template>
  </d2-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import UserRoleDialog from '@/components/opscloud/dialog/UserRoleDialog'
  // API
  import { queryRolePage } from '@api/auth/auth.role.js'
  import { queryUserPage } from '@api/user/user.js'
  import { queryUserRolePage, deleteUserRoleById, syncUserRole } from '@api/auth/auth.user.role.js'

  export default {
    data () {
      return {
        userRole: {},
        formUserRoleStatus: {
          visible: false,
          title: '用户角色绑定配置',
          labelWidth: '100px'
        },
        tableData: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          roleId: '',
          username: ''
        },
        userOptions: [],
        roleOptions: []
      }
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    mounted () {
      this.initPageSize()
      this.fetchData()
    },
    components: {
      UserRoleDialog
    },
    methods: {
      ...mapActions({
        setPageSize: 'd2admin/user/set'
      }),
      handleSizeChange (size) {
        this.pagination.pageSize = size
        this.info.pageSize = size
        this.setPageSize(this.info)
        this.fetchData()
      },
      initPageSize () {
        if (typeof (this.info.pageSize) !== 'undefined') {
          this.pagination.pageSize = this.info.pageSize
        }
      },
      getRole (roleName) {
        queryRolePage(roleName, '', 1, 10)
          .then(res => {
            this.roleOptions = res.body.data
          })
      },
      getUser (username) {
        queryUserPage(username, '', 1, 20)
          .then(res => {
            this.userOptions = res.body.data
          })
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      handleDialogCancel (done) {
        this.$message({
          message: '取消保存',
          type: 'warning'
        })
        done()
      },
      delItem (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUserRoleById(row.id).then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      addItem () {
        this.formUserRoleStatus.visible = true
        this.userRole = {
          id: '',
          username: '',
          roleId: ''
        }
      },
      handlerSyncUserRole () {
        syncUserRole()
          .then(res => {
            this.$message({
              type: 'success',
              message: '后台同步中'
            })
          })
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        queryUserRolePage(this.queryParam.username, this.queryParam.roleId, this.pagination.currentPage, this.pagination.pageSize)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
          })
      }
    }
  }
</script>

<style scoped>
  .input-search-bar {
    display: inline-block;
    max-width: 200px;
    margin-left: 10px;
  }

  .search-bar {
    margin-left: 5px;
  }

</style>
