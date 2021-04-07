<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-col>
        <el-tabs tab-position="top" style="height: 200px;">
          <el-tab-pane label="设置面板">
            <!--              页面布局-->
            <el-row :gutter="20">
              <el-col :span="10">
                <el-card class="box-card" shadow="never">
                  <div slot="header" class="clearfix">
                    <span>全局设置</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="saveSettings">保存</el-button>
                  </div>
                  <el-form :model="settings">
                    <el-tooltip content="推送权限的账户" placement="top-start" effect="light">
                      <el-form-item label="管理账户" :label-width="labelWidth" :required="true">
                        <template>
                          <el-select v-model.trim="settings.assetsAdminuserId" placeholder="请选择" clearable>
                            <el-option
                              v-for="item in settings.assetsAdminusers"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-tooltip>
                    <el-tooltip content="普通用户登录系统的账户(不支持sudo)" placement="top-start" effect="light">
                      <el-form-item label="低权限系统账户" :label-width="labelWidth" :required="true">
                        <template>
                          <el-select v-model.trim="settings.assetsSystemuserId" placeholder="请选择" clearable>
                            <el-option
                              v-for="item in settings.assetsSystemusers"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-tooltip>
                    <el-tooltip content="管理员登录系统的账户(支持sudo)" placement="bottom" effect="light">
                      <el-form-item label="高权限系统账户" :label-width="labelWidth" :required="true">
                        <template>
                          <el-select v-model.trim="settings.assetsAdminSystemuserId" placeholder="请选择" clearable>
                            <el-option
                              v-for="item in settings.assetsSystemusers"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-tooltip>
                  </el-form>
                </el-card>
                <div style="margin: 15px 0;"></div>
                <el-card class="box-card" shadow="never">
                  <div slot="header" class="clearfix">
                    <span>管理员</span>
                  </div>
                  <!--用户搜索-->
                  <div style="margin-bottom: 5px">
                    <!--            :gutter="24"-->
                    <el-row style="margin-bottom: 5px">
                      <el-select filterable clearable :style="searchBarHeadStyle" v-model="userId"
                                 remote reserve-keyword placeholder="搜索用户" :remote-method="getUser"
                                 :loading="searchUserLoading">
                        <el-option
                          v-for="item in userOptions"
                          :key="item.id"
                          :label="item.username"
                          :value="item.id">
                        </el-option>
                      </el-select>
                      <el-button type="success" plain size="mini" @click="setUserAdmin()" :style="searchBarStyle"
                                 :disabled="userId == ''">授权
                      </el-button>
                    </el-row>
                  </div>
                  <el-row style="margin-bottom: 5px">
                    <el-table :data="adminUserTableData" style="width: 100%" v-loading="adminUserLoading">
                      <el-table-column prop="username" label="用户名"></el-table-column>
                      <el-table-column prop="name" label="显示名"></el-table-column>
                      <el-table-column fixed="right" label="操作" width="80">
                        <template slot-scope="scope">
                          <el-button type="danger" plain size="mini" @click="revokeItem(scope.row)"
                                     v-if="scope.row.username != 'admin'">撤销
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <!--用户翻页-->
                    <el-pagination background @current-change="adminUserPaginationCurrentChange"
                                   layout="prev, pager, next" :total="adminUserPagination.total"
                                   :current-page="adminUserPagination.currentPage"
                                   :page-size="adminUserPagination.pageSize">
                    </el-pagination>
                  </el-row>
                </el-card>
              </el-col>
              <el-col :span="14">
                <el-card class="box-card" shadow="never">
                  <div slot="header" class="clearfix">
                    <span>终端(koko)</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="getTerminal">刷新</el-button>
                  </div>
                  <el-table :data="terminals" style="width: 100%" v-loading="terminalLoding">
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="remoteAddr" label="ip"></el-table-column>
                    <el-table-column prop="sshPort" label="ssh"></el-table-column>
                    <el-table-column prop="httpPort" label="http"></el-table-column>
                    <el-table-column prop="sessions" label="会话"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="80">
                      <template slot-scope="scope">
                        <el-button type="primary" plain size="mini" @click="handlerXTerm(scope.row)">登录</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="当前会话">
            <!--会话搜索-->
            <div style="margin-bottom: 5px">
              <!--            :gutter="24"-->
              <el-row style="margin-bottom: 5px">
                <el-button @click="fetchTerminalSessionData" :style="searchBarStyle">查询</el-button>
              </el-row>
            </div>
            <!--会话table-->
            <el-row style="margin-bottom: 5px">
              <el-table :data="terminalSessionTableData" style="width: 100%" v-loading="terminalSessionLoading">
                <el-table-column prop="user" label="用户"></el-table-column>
                <el-table-column prop="remoteAddr" label="用户ip"></el-table-column>
                <el-table-column prop="asset" label="资产"></el-table-column>
                <el-table-column prop="protocol" label="协议"></el-table-column>
                <el-table-column prop="systemUser" label="系统账户"></el-table-column>
                <el-table-column prop="terminalName" label="终端名称"></el-table-column>
                <el-table-column prop="dateStart" label="会话开始时间"></el-table-column>
              </el-table>
              <!--会话翻页-->
              <el-pagination background @current-change="terminalSessionPaginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                             layout="sizes, prev, pager, next" :total="terminalSessionPagination.total"
                             :current-page="terminalSessionPagination.currentPage"
                             :page-size="terminalSessionPagination.pageSize">
              </el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="帮助">
            <d2-markdown :source="doc"/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <terminal :formStatus="formXtermStatus" ref="xtermDialog"></terminal>
    </template>
  </d2-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  // Component
  // XTerm
  import terminal from '@/components/opscloud/xterm/Terminal'

  import doc from '@/static/md/jump.jumpserver.settings.md'
  // Filters
  import { getUserRoleType, getUserRoleText } from '@/filters/jumpserver.js'
  import { getActiveType, getActiveText } from '@/filters/public.js'
  // API
  import { fuzzyQueryAdminUserPage, authAdmin, revokeAdmin } from '@api/jump/jump.jumpserver.user.js'
  import { querySettings, queryTerminal, saveSettings, queryTerminalSessionPage } from '@api/jump/jump.jumpserver.js'

  export default {
    data () {
      return {
        formXtermStatus: {
          visible: false
        },
        searchBarHeadStyle: {
          display: 'inline-block',
          maxWidth: '200px'
        },
        searchBarStyle: {
          marginLeft: '5px'
        },
        adminUserTableData: [],
        adminUserLoading: false,
        adminUserPagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryAdminUserParam: {
          queryName: '',
          isAdmin: 1
        },
        terminalSessionTableData: [],
        terminalSessionPagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        terminalSessionLoading: false,
        userOptions: [],
        userId: '',
        searchUserLoading: false,
        labelWidth: '150px',
        settings: {},
        terminals: [],
        terminalLoding: false,
        title: 'Jumpserver控制面板',
        doc
      }
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    mounted () {
      this.initPageSize()
      this.getSettings()
      this.getTerminal()
      this.fetchAdminUserData()
      this.fetchTerminalSessionData()
    },
    components: {
      terminal
    },
    filters: {
      getUserRoleType,
      getUserRoleText,
      getActiveType,
      getActiveText
    },
    // components: {
    //   ServerAttributeCard
    // },
    methods: {
      ...mapActions({
        setPageSize: 'd2admin/user/set'
      }),
      handleSizeChange (size) {
        this.terminalSessionPagination.pageSize = size
        this.info.pageSize = size
        this.setPageSize(this.info)
        this.fetchTerminalSessionData()
      },
      initPageSize () {
        if (typeof (this.info.pageSize) !== 'undefined') {
          this.terminalSessionPagination.pageSize = this.info.pageSize
        }
      },
      getUser (queryName) {
        this.searchUserLoading = true
        var requestBody = {
          queryName: queryName,
          isAdmin: 0,
          page: 1,
          length: 20
        }
        fuzzyQueryAdminUserPage(requestBody)
          .then(res => {
            this.userOptions = res.body.data
            this.searchUserLoading = false
          })
      },
      getSettings () {
        querySettings()
          .then(res => {
            this.settings = res.body
          })
      },
      handlerXTerm (row) {
        this.formXtermStatus.visible = true
        let server = {
          name: row.name,
          privateIp: row.remoteAddr
        }
        this.$refs.xtermDialog.initData(server)
      },
      saveSettings () {
        saveSettings(this.settings)
          .then(res => {
            if (res.success) {
              this.getSettings()
              this.$message({
                type: 'success',
                message: '设置成功!'
              })
            } else {
              this.$message({
                type: 'warning',
                message: '设置失败!'
              })
            }
          })
      },
      setUserAdmin () {
        authAdmin(this.userId)
          .then(res => {
            if (res.success) {
              this.fetchAdminUserData()
              this.$message({
                type: 'success',
                message: '设置成功!'
              })
            } else {
              this.$message.error(res.msg)
            }
            this.userId = ''
          })
      },
      revokeItem (row) {
        revokeAdmin(row.id)
          .then(res => {
            if (res.success) {
              this.fetchAdminUserData()
              this.$message({
                type: 'success',
                message: '设置成功!'
              })
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      getTerminal () {
        this.terminalLoding = true
        queryTerminal()
          .then(res => {
            this.terminals = res.body
            this.terminalLoding = false
          })
      },
      adminUserPaginationCurrentChange (currentPage) {
        this.adminUserPagination.currentPage = currentPage
        this.fetchAdminUserData()
      },
      fetchAdminUserData () {
        this.adminUserLoading = true
        var requestBody = Object.assign({}, this.queryAdminUserParam)
        requestBody.page = this.adminUserPagination.currentPage
        requestBody.length = this.adminUserPagination.pageSize
        fuzzyQueryAdminUserPage(requestBody)
          .then(res => {
            this.adminUserTableData = res.body.data
            this.adminUserPagination.total = res.body.totalNum
            this.adminUserLoading = false
          })
      },
      terminalSessionPaginationCurrentChange (currentPage) {
        this.terminalSessionPagination.currentPage = currentPage
        this.fetchTerminalSessionData()
      },
      fetchTerminalSessionData () {
        this.terminalSessionLoading = true
        var requestBody = {
          page: this.terminalSessionPagination.currentPage,
          length: this.terminalSessionPagination.pageSize
        }
        queryTerminalSessionPage(requestBody)
          .then(res => {
            this.terminalSessionTableData = res.body.data
            this.terminalSessionPagination.total = res.body.totalNum
            this.terminalSessionLoading = false
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

  /*.el-row {*/
  /*  margin-bottom: 20px;*/
  /*&*/
  /*:last-child {*/
  /*  margin-bottom: 0;*/
  /*}*/

  /*}*/

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
