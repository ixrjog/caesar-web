<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <div style="margin-bottom: 5px">
        <el-row :gutter="24" style="margin-bottom: 5px">
          <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询" style="display: inline-block; max-width:200px;margin-left: 10px"/>
          <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
          <el-button @click="syncLdapUser" style="margin-left: 5px">同步</el-button>
          <el-button @click="addItem" style="margin-left: 5px">新建</el-button>
        </el-row>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="姓名" v-if="props.row.name != null && props.row.name != ''">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="电话" v-if="props.row.phone != null && props.row.phone != ''">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="微信" v-if="props.row.wechat != null && props.row.wechat != ''">
                <span>{{ props.row.wechat }}</span>
              </el-form-item>
              <el-form-item label="数据源" v-if="props.row.source != null && props.row.source != ''">
                <span>{{ props.row.source }}</span>
              </el-form-item>
              <el-form-item label="用户组">
                <div class="tag-group">
                  <el-tag style="margin-right: 5px"
                          v-for="item in props.row.userGroups"
                          :key="item.id">{{ item.name }}
                  </el-tag>
                </div>
              </el-form-item>
              <el-form-item label="服务器组">
                <div class="tag-group">
                  <el-tag style="margin-right: 5px"
                          v-for="item in props.row.serverGroups"
                          :key="item.id">{{ item.name }}
                  </el-tag>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="displayName" label="显示名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="userGroups.length" label="用户组"></el-table-column>
        <el-table-column prop="serverGroups.length" label="服务器组"></el-table-column>
        <el-table-column prop="ramUsers.length" label="阿里云RAM账户"></el-table-column>
        <el-table-column fixed="right" label="操作" width="380">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="editItem(scope.row)">编辑</el-button>
            <el-tooltip class="item" effect="light" content="用户组授权" placement="top-start">
              <el-button type="primary" plain size="mini" icon="el-icon-user-solid" @click="editUserGroup(scope.row)">授权</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="服务器组授权" placement="top-start">
              <el-button type="primary" plain size="mini" icon="fa fa-server" @click="editServerGroup(scope.row)">授权</el-button>
            </el-tooltip>
            <el-button v-if="false" type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                     :page-size="pagination.pageSize">
      </el-pagination>
      <!-- user编辑对话框 -->
      <UserDialog :formStatus="formUserStatus" :formData="user" @closeUserDialog="fetchData"></UserDialog>
      <!-- 用户组授权编辑对话框-->
      <UserUserGroupDialog ref="userUserGroupDialog" :formStatus="formUserUserGroupStatus" @closeUserUserGroupDialog="fetchData"></UserUserGroupDialog>
      <!-- 服务器组授权编辑对话框-->
      <UserServerGroupDialog ref="userServerGroupDialog" :formStatus="formUserServerGroupStatus" @closeUserServerGroupDialog="fetchData"></UserServerGroupDialog>
    </template>
  </d2-container>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  // Component
  import UserDialog from '@/components/opscloud/dialog/UserDialog'
  import UserUserGroupDialog from '@/components/opscloud/dialog/UserUserGroupDialog'
  import UserServerGroupDialog from '@/components/opscloud/dialog/UserServerGroupDialog'
  // API
  import { fuzzyQueryUserPage, deleteUserById, syncUser } from '@api/user/user.js'

  export default {
    data () {
      return {
        user: {},
        formUserStatus: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          addTitle: '新增用户信息',
          updateTitle: '更新用户信息'
        },
        formUserUserGroupStatus: {
          visible: false,
          labelWidth: '150px',
          title: '用户组授权'
        },
        formUserServerGroupStatus: {
          visible: false,
          labelWidth: '150px',
          title: '服务器组授权'
        },
        tableData: [],
        options: {
          stripe: true
        },
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          queryName: ''
        },
        title: '用户离职管理'
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
      UserDialog,
      UserUserGroupDialog,
      UserServerGroupDialog
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
      delItem (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUserById(row.id).then(res => {
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
      editItem (row) {
        // form
        this.formUserStatus.visible = true
        this.formUserStatus.operationType = false
        // user
        this.user = Object.assign({}, row)
      },
      editUserGroup (row) {
        // form
        this.formUserUserGroupStatus.visible = true
        // user
        this.user = Object.assign({}, row)
        // 调用子组件的方法
        this.$refs.userUserGroupDialog.initData(this.user)
      },
      editServerGroup (row) {
        // form
        this.formUserServerGroupStatus.visible = true
        // user
        this.user = Object.assign({}, row)
        // 调用子组件的方法
        this.$refs.userServerGroupDialog.initData(this.user)
      },
      addItem () {
        // form
        this.formUserStatus.visible = true
        this.formUserStatus.operationType = true
        // user
        this.user = {
          id: '',
          username: '',
          name: '',
          displayName: '',
          wechat: '',
          email: '',
          phone: '',
          comment: ''
        }
      },
      handleDialogCancel (done) {
        this.$message({
          message: '取消保存',
          type: 'warning'
        })
        done()
      },
      syncLdapUser () {
        setTimeout(() => {
          this.loading = true
          syncUser()
            .then(res => {
              this.$message({
                message: '同步成功',
                type: 'success'
              })
              this.fetchData()
            })
        }, 300)
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        var requestBody = {
          'queryName': this.queryParam.queryName,
          'extend': 1,
          'isActive': false,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        fuzzyQueryUserPage(requestBody)
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
  .table-expand {
    font-size: 0;
  }

  .table-expand label {
    width: 150px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>
