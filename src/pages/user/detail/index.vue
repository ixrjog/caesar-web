<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <div style="margin-bottom: 5px">
        <el-row :gutter="24" style="margin-bottom: 5px">
          <el-col :span="8">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>个人信息</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="editItem()">修改基本信息</el-button>
              </div>
              <el-form :model="formUserDetail">
                <el-form-item label="用户名" :label-width="labelWidth">
                  <el-input v-model="formUserDetail.username" readonly></el-input>
                </el-form-item>
                <el-form-item label="显示名" :label-width="labelWidth">
                  <el-input v-model="formUserDetail.displayName" readonly></el-input>
                </el-form-item>
                <el-form-item label="姓名" :label-width="labelWidth">
                  <el-input v-model="formUserDetail.name" readonly></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="labelWidth">
                  <el-input v-model="formUserDetail.phone" readonly></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="labelWidth">
                  <el-input v-model="formUserDetail.email" readonly></el-input>
                </el-form-item>
                <el-form-item label="微信" :label-width="labelWidth">
                  <el-input v-model="formUserDetail.wechat" readonly></el-input>
                </el-form-item>
                <el-form-item label="留言" :label-width="labelWidth">
                  <el-input v-model="formUserDetail.comment" readonly></el-input>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <!-- 用户资源详情-->
          <el-col :span="16">

            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">用户组<i class="header-icon el-icon-info"></i>(角色授权)</div>
              <div class="tag-group">
                   <span v-for="item in formUserDetail.userGroups" :key="item.id">
                    <template>
                       <el-tooltip class="item" effect="light" :content="item.comment || '没有填写'" placement="bottom">
                         <el-tag style="margin-left: 5px">{{ item.name }}</el-tag>
                       </el-tooltip>
                    </template>
                  </span>
              </div>
            </el-card>

            <el-card class="box-card" shadow="never" style="margin-top: 10px">
              <div slot="header" class="clearfix">服务器组<i class="header-icon el-icon-info"></i>(深色标签拥有管理员权限)</div>
              <div class="tag-group">
                       <span v-for="item in formUserDetail.serverGroups" :key="item.id">
                          <el-tooltip class="item" effect="light" :content="item.comment || '没有填写'" placement="bottom">
                           <el-tag style="margin-left: 5px"
                                   :type=" item.isAdmin ? 'danger': '' ">{{ item.name }}</el-tag>
                          </el-tooltip></span>
              </div>
            </el-card>

            <el-card class="box-card" shadow="never" style="margin-top: 10px" v-if="JSON.stringify(formUserDetail.ramUsers) === '{}'">
              <div slot="header" class="clearfix">阿里云RAM账户</div>
              <el-table :data="formUserDetail.ramUsers" style="width: 100%">
                <el-table-column prop="ramAccount" label="账户">
                  <template slot-scope="props">
                    <el-tooltip class="item" effect="light" content="点击打开登录连接" placement="top-start">
                      <el-button style="padding: 3px 0" type="text" @click="handlerOpenLoginUrl(props.row)">{{
                        props.row.ramAccount }}
                      </el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="accessKeys" label="ak" width="80"></el-table-column>
                <el-table-column prop="expiredTime" label="策略">
                  <template slot-scope="props">
                    <div class="tag-group">
                      <div v-for="item in props.row.policies" :key="item.id">
                        <el-tooltip class="item" effect="light" :content="item.description" placement="top-start">
                          <el-tag style="margin-left: 5px">{{ item.policyName }}</el-tag>
                        </el-tooltip>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>

            <el-card class="box-card" shadow="never" style="margin-top: 10px">
              <div slot="header" class="clearfix">
                <span>SSH密钥<i class="header-icon el-icon-info"></i>(堡垒机,Gitlab)</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="editSSHKey">编辑</el-button>
              </div>
              <div>
                <el-tag
                  v-if="formUserDetail.credentialMap != null && formUserDetail.credentialMap.sshPubKey != null"
                  style="margin-left: 5px">{{ formUserDetail.credentialMap.sshPubKey.title }} {{
                  formUserDetail.credentialMap.sshPubKey.fingerprint }}
                </el-tag>
                <el-tooltip class="item" effect="light" content="堡垒机公钥已推送" placement="top"
                            v-show="formUserDetail.attributeMap != null && formUserDetail.attributeMap.jumpserverPubkey">
                  <el-tag type="success"
                          style="margin-left: 5px">堡垒机
                  </el-tag>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="Gitlab公钥已推送" placement="top"
                            v-show="formUserDetail.attributeMap != null && formUserDetail.attributeMap.gitlabPubkey">
                  <el-tag type="success"
                          style="margin-left: 5px">Gitlab
                  </el-tag>
                </el-tooltip>
              </div>
            </el-card>

            <el-card class="box-card" shadow="never" style="margin-top: 10px">
              <div slot="header" class="clearfix">
                <span>开发者令牌<i class="header-icon el-icon-info"></i>(API-Token)</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="addApiToken">申请</el-button>
              </div>
              <el-table :data="formUserDetail.apiTokens" style="width: 100%">
                <el-table-column prop="tokenId" label="id" width="240"></el-table-column>
                <!--                  <el-table-column prop="token" label="api-token"></el-table-column>-->
                <el-table-column prop="expiredTime" label="过期时间"></el-table-column>
                <el-table-column prop="comment" label="描述"></el-table-column>
                <el-table-column fixed="right" label="操作" width="80">
                  <template slot-scope="scope">
                    <!--                      <el-button style="float: right; padding: 3px 0" type="text"  @click="delItem(scope.row)">修改基本信息</el-button>-->
                    <el-button plain size="mini" @click="delApiToken(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>

          </el-col>
        </el-row>
        <!-- 用户资源详情-->
      </div>
      <!--用户编辑-->
      <UserDialog :formStatus="formUserStatus" ref="userDialog" @closeUserDialog="fetchData"></UserDialog>
      <!-- api-token申请对话框 -->
      <UserApiTokenDialog :formStatus="formUserApiTokenStatus" ref="userApiTokenDialog"
                          @closeDialog="fetchData"></UserApiTokenDialog>
      <!-- ssh-pubkey编辑对话框 -->
      <UserSSHKeyDialog :formStatus="formUserSSHKeyStatus" ref="userSSHKeyDialog"
                        @closeUserSSHKeyDialog="fetchData"></UserSSHKeyDialog>
    </template>
  </d2-container>
</template>

<script>
  // Component
  import UserDialog from '@/components/opscloud/dialog/UserDialog'
  import UserApiTokenDialog from '@/components/opscloud/dialog/UserApiTokenDialog'
  import UserSSHKeyDialog from '@/components/opscloud/dialog/UserSSHKeyDialog'

  // API
  import { queryUserDetail, delApiTokenById } from '@api/user/user.js'

  export default {
    data () {
      return {
        formUserDetail: {},
        user: {},
        formUserStatus: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          addTitle: '新增用户信息',
          updateTitle: '更新用户信息'
        },
        formUserApiTokenStatus: {
          visible: false,
          labelWidth: '100px',
          title: '申请ApiToken'
        },
        formUserSSHKeyStatus: {
          visible: false,
          labelWidth: '100px',
          title: '编辑SSH公钥'
        },
        labelWidth: '100px',
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          queryName: ''
        },
        title: '我的详情'
      }
    },
    mounted () {
      this.fetchData()
    },
    components: {
      UserDialog,
      UserApiTokenDialog,
      UserSSHKeyDialog
    },
    methods: {
      handlerOpenLoginUrl (row) {
        window.open(row.ramAccountLoginUrl)
      },
      editItem () {
        // form
        this.formUserStatus.visible = true
        this.formUserStatus.operationType = false
        // user
        this.$refs.userDialog.initData(Object.assign({}, this.formUserDetail))
      },
      delApiToken (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delApiTokenById(row.id).then(res => {
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
      addApiToken () {
        // form
        this.formUserApiTokenStatus.visible = true
        let userApiToken = {
          id: '',
          tokenId: '',
          token: '',
          expiredTime: '',
          comment: ''
        }
        this.$refs.userApiTokenDialog.initData(userApiToken)
      },
      editSSHKey () {
        // form
        let userSSHKey = {}
        if (this.formUserDetail.credentialMap.sshPubKey != null) {
          userSSHKey = Object.assign({}, this.formUserDetail.credentialMap.sshPubKey)
        } else {
          userSSHKey = {
            id: '',
            userId: this.formUserDetail.id,
            username: this.formUserDetail.username,
            title: '',
            credential: '',
            credentialType: 2 // ssh pub-key
          }
        }
        this.$refs.userSSHKeyDialog.initData(userSSHKey)
        this.formUserSSHKeyStatus.visible = true
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        queryUserDetail()
          .then(res => {
            this.formUserDetail = res.body
            this.loading = false
          })
      }
    }
  }
</script>

<style>
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

  .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
