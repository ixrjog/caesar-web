<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <!--      顶部工具栏-->
      <el-row>
        <terminal-tools :terminal-setting="terminalSetting" :mode="terminalTools.mode"
                        :batch-type="terminalTools.batchType"
                        @handlerLogin="handlerLogin"
                        @handlerLogout="handlerLogout"
                        @resetTerminalSetting="initTerminalSetting"
                        @handlerChangeLoginUserType="handlerChangeLoginUserType"
                        @handlerChangeBatch="handlerChangeBatch"
                        @handlerChangeLayout="handlerChangeLayout"></terminal-tools>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!--          服务器树-->
          <server-tree class="server-tree" ref="serverTree" v-show="terminalLayout.servers.length === 0"></server-tree>
        </el-col>
        <el-col>
          <!--          终端布局-->
          <terminal-layout class="terminal-layout" ref="terminalLayout" :terminal-setting="terminalSetting"
                           :servers="terminalLayout.servers"
                           :instance-ids="terminalLayout.instanceIds"
                           :uuid="terminalLayout.uuid"
                           :login-user-type="terminalLayout.loginUserType"
                           :col-span="terminalLayout.colSpan"
                           @handlerLogoutByInstance="handlerLogoutByInstance"
                           @handlerLoginByInstanceId="handlerLoginByInstanceId"></terminal-layout>
        </el-col>
      </el-row>
    </template>
  </d2-container>
</template>

<script>
  // import util from '@/libs/util'
  import { queryUserSettingByGroup } from '@api/user/user.setting.js'

  import TerminalTools from '../../../components/opscloud/web-terminal/TerminalTools'
  import ServerTree from '../../../components/opscloud/tree/ServerTree'
  import TerminalLayout from '../../../components/opscloud/web-terminal/TerminalLayout'

  const terminalSetting = {
    theme: {
      foreground: '#FFFFFF', // 字体
      background: '#606266', // 背景色
      cursor: 'help', // 设置光标
      red: '#dd7479'
    },
    rows: 30
  }

  const settingGroup = 'XTERM'

  export default {
    props: {},
    data () {
      return {
        title: 'Web Terminal',
        layout: {
          mode: 0
        },
        terminalSetting: Object.assign({}, terminalSetting), // 终端设置
        terminalTools: {
          mode: 0, // 0未登录:1登录
          batchType: ''
        },
        terminalLayout: {
          instanceIds: [],
          servers: [],
          uuid: '',
          loginUserType: 0,
          colSpan: 12
        }
      }
    },
    mounted () {
      this.initTerminalSetting()
    },
    beforeDestroy () {
      this.handlerLogout()
    },
    components: {
      ServerTree,
      TerminalTools,
      TerminalLayout
    },
    methods: {
      /**
       * 设置终端主题色彩
       */
      initTerminalSetting () {
        queryUserSettingByGroup(settingGroup)
          .then(res => {
            if (res.success) {
              try {
                this.terminalSetting.theme.foreground = res.body['XTERM_FOREGROUND']
                this.terminalSetting.theme.background = res.body['XTERM_BACKGROUND']
                this.terminalSetting.rows = res.body['XTERM_ROWS'] || 30
              } catch (e) {
              }
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      handlerChangeBatch () {
        let isBatch = true
        debugger
        if (this.terminalTools.batchType === '') {
          this.terminalTools.batchType = 'success'
        } else {
          this.terminalTools.batchType = ''
          isBatch = false
        }
        this.$refs.terminalLayout.handlerBatch(isBatch)
      },
      handlerChangeLoginUserType (loginUserType) {
        this.terminalLayout.loginUserType = loginUserType
      },
      handlerChangeLayout (mode) {
        this.layout.mode = mode
        this.terminalLayout.colSpan = mode === 0 ? 12 : 24 // 双列布局:单列布局
      },
      handlerLogin () {
        this.terminalTools.batchType = ''
        this.terminalLayout.instanceIds = this.$refs.serverTree.getCheckedKeys(true)
        if (this.terminalLayout.instanceIds.length === 0) return
        this.terminalTools.mode = 1
        this.terminalLayout.uuid = this.$refs.serverTree.getUuid()
        this.terminalLayout.servers = []
        for (let id of this.terminalLayout.instanceIds) {
          let server = {
            name: id
          }
          this.terminalLayout.servers.push(server)
        }
        this.$nextTick(() => {
          this.$refs.terminalLayout.open()
        })
      },
      handlerLoginByInstanceId (id) {
        let server = {
          name: id
        }
        this.terminalLayout.servers.push(server)
        this.$nextTick(() => {
          this.$refs.terminalLayout.openServer(server)
        })
      },
      /**
       * 所有终端退出
       */
      handlerLogout () {
        if (this.terminalLayout.instanceIds.length === 0) return
        this.terminalLayout.instanceIds.forEach(id => {
            let args = {
              id: id,
              isNotify: false
            }
            this.$refs.terminalLayout.handlerLogoutByInstance(args)
          }
        )
        // this.$refs.terminalLayout.close()
        this.$message.warning('所有终端已关闭')
        this.terminalTools.mode = 0
      },
      /**
       * 单个终端退出
       * @param id
       */
      handlerLogoutByInstance (args) {
        this.terminalLayout.instanceIds = this.terminalLayout.instanceIds.filter(function (n) {
          return n !== args.id
        })
        this.terminalLayout.servers = this.terminalLayout.servers.filter(function (n) {
          return n.name !== args.id
        })
        if (args.isNotify) this.$message.warning(args.id + '终端已关闭')
        if (this.terminalLayout.instanceIds.length === 0) {
          this.terminalTools.mode = 0
          this.$refs.terminalLayout.close()
        }
      }
    }
  }

</script>

<style scoped>
  .el-button {
    margin-left: 5px
  }

  .server-tree {
    margin-top: 5px;
  }

  .terminal-layout {
    margin-top: 5px;
  }
</style>
