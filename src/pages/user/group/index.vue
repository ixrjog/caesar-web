<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <div style="margin-bottom: 5px">
        <el-row :gutter="24" style="margin-bottom: 5px">
          <el-input v-model.trim="queryParam.name" placeholder="输入关键字查询用户组"
                    style="display: inline-block; max-width:200px; margin-left: 10px"/>
          <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
          <el-button @click="syncLdapUserGroup" style="margin-left: 5px">同步</el-button>
        </el-row>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="用户成员">
                <div class="tag-group">
                  <el-tag style="margin-left: 5px"
                          v-for="item in props.row.users"
                          :key="item.id">{{ item.username }}&lt;{{ item.displayName }}&gt;
                  </el-tag>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户组名称"></el-table-column>
        <el-table-column prop="users.length" label="成员数" width="100"></el-table-column>
        <el-table-column prop="workflow" label="工单申请" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.inWorkorder === 0 ? 'danger' : 'success'" disable-transitions>
              {{scope.row.inWorkorder ===
              0 ? '禁止' : '允许'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="描述"></el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="editItem(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @current-change="paginationCurrentChange"
                     :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                     :page-size="pagination.pageSize">
      </el-pagination>
      <!-- userGroup编辑对话框-->
      <UserGroupDialog  ref="userGroupDialog" :formStatus="formGroupStatus" @closeDialog="fetchData"></UserGroupDialog>
      <!-- userGroup编辑对话框-->
    </template>
  </d2-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  // Component
  import UserGroupDialog from '@/components/opscloud/dialog/UserGroupDialog'

  // API
  import { queryUserGroupPage, deleteUserGroupById, syncUserGroup } from '@api/user/user.group.js'

  export default {
    data () {
      return {
        formGroupStatus: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          addTitle: '新增用户信息',
          updateTitle: '更新用户信息'
        },
        tableData: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          name: '',
          workflow: ''
        },
        title: '用户组管理'
      }
    },
    mounted () {
      this.initPageSize()
      this.fetchData()
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    components: {
      UserGroupDialog
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
          deleteUserGroupById(row.id).then(res => {
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
        this.$refs.userGroupDialog.initData(Object.assign({}, row))
        this.formGroupStatus.visible = true
        this.formGroupStatus.operationType = false
      },
      addItem () {
        // user
        let userGroup = {
          id: '',
          name: '',
          grpType: 0,
          workflow: 0,
          comment: ''
        }
        this.$refs.userGroupDialog.initData(userGroup)
        this.formGroupStatus.visible = true
        this.formGroupStatus.operationType = true
      },
      handleDialogCancel (done) {
        this.$message({
          message: '取消保存',
          type: 'warning'
        })
        done()
      },
      syncLdapUserGroup () {
        setTimeout(() => {
          this.loading = true
          syncUserGroup()
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
        queryUserGroupPage(this.queryParam.name, '', this.queryParam.workflow, 1, this.pagination.currentPage, this.pagination.pageSize)
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
    width: 50%;
  }
</style>
