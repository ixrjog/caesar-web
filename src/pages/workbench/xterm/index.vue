<template>
  <d2-container>
    <template>
<!--      <div>-->
<!--        <h1>{{title}}</h1>-->
<!--      </div>-->
      <el-row :gutter="10">
        <el-col :span="8" v-show="pageStatus == 0">
          <ServerTree ref="serverTree"></ServerTree>
        </el-col>
        <el-col :span="xtermSpan">
          <el-row style="margin-bottom: 5px;margin-left: 2px">
            <el-select v-model="layoutMode" filterable reserve-keyword @change="handlerChangeLayout">
              <el-option
                v-for="item in layoutModeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="loginUserType" filterable reserve-keyword style="margin-left: 5px">
              <el-option
                v-for="item in loginUserTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-tooltip class="item" effect="light" content="任意窗口输入指令同步到所有终端" placement="bottom">
              <el-button @click="handlerBatchCmd" v-if="pageStatus === 1" :type="handlerBatchType"
                         plain>命令同步
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="您的个人文档，用于记录常用指令" placement="bottom">
              <el-button @click="handlerPreviewUserDoc">用户文档</el-button>
            </el-tooltip>
            <el-button @click="handlerSetting" v-if="pageStatus === 0">终端设置</el-button>
            <el-tooltip class="item" effect="light" content="修复终端字符错位" placement="bottom">
              <el-button @click="handlerResize" v-if="pageStatus === 1">调整大小</el-button>
            </el-tooltip>
            <el-button @click="handlerLogin" v-if="pageStatus === 0">批量登录</el-button>
            <el-button @click="handlerClose" v-if="pageStatus === 1">全部关闭</el-button>
          </el-row>
          <el-row>
            <div v-for="xterm in xterms" :key="xterm">
              <template>
                <el-col :span="layoutSpan">
                  <el-card shadow="hover" body-style="padding: 2px" style="margin-right: 10px;margin-bottom: 10px">
                    <div slot="header" class="clearfix" style="height: 15px">
                      <span><el-tag>{{ xterm }}</el-tag></span>
                      <el-tooltip class="item" effect="light" content="退出" placement="top-start">
                        <el-button style="float: right; padding: 3px 0" type="text" @click="handlerLogout(xterm)">
                          Logout
                        </el-button>
                      </el-tooltip>
                      <el-tooltip class="item" effect="light" content="复制会话" placement="top-start">
                        <el-button style="float: right; padding: 3px 0;margin-right: 20px" type="text"
                                   @click="handlerDuplicateSession(xterm)">Duplicate
                        </el-button>
                      </el-tooltip>
                    </div>
                    <!--                    style="border-right:2px solid #e0e0e0; border-left:2px solid #e0e0e0; border-bottom:2px solid #e0e0e0; border-top:1px solid #e0e0e0;margin-top:10px;margin-left: 10px"-->
                    <div :id="xterm" class="xterm" width="100%">
                    </div>
                  </el-card>
                </el-col>
              </template>
            </div>
          </el-row>
        </el-col>
      </el-row>
      <DocDialog ref="docDialog" :formStatus="formDocStatus"></DocDialog>
      <UserXTermSetting ref="userXTermSetting" @closeUserXTermSetting="setXTermSetting"
                        :formStatus="formSettingStatus"></UserXTermSetting>
    </template>
  </d2-container>
</template>

<script>
  import util from '@/libs/util'
  // Component
  import DocDialog from '@/components/opscloud/doc/DocDialog.vue'
  import ServerTree from '@/components/opscloud/tree/ServerTree'
  import UserXTermSetting from '@/components/opscloud/setting/UserXTermSetting'

  // X-Terminal
  import 'xterm/css/xterm.css'
  import { Terminal } from 'xterm'
  import { FitAddon } from 'xterm-addon-fit'

  // API
  import { queryUserDocByType } from '@api/doc/doc.js'
  import { queryUserSettingByGroup } from '@api/user/user.setting.js'

  const xtermUrl = 'ws/xterm'
  const settingGroup = 'XTERM'

  const layoutModeOptions = [
    {
      value: 0,
      label: '双列布局'
    }, {
      value: 1,
      label: '单列布局'
    }
  ]

  const loginUserTypeOptions = [
    {
      value: 0,
      label: '普通用户'
    }, {
      value: 1,
      label: '系统管理员'
    }
  ]

  export default {
    props: {},
    data () {
      return {
        socketURI: '',
        formSettingStatus: {
          visible: false
        },
        formDocStatus: {
          readMode: false, // 阅读模式
          visible: false
        },
        pageStatus: 0, // 页面状态: 0 选择 1 登录状态
        xtermSpan: 16,
        title: 'Web-XTerminal',
        uuid: '', // 服务器树资源权限校验
        options: {
          stripe: true
        },
        layoutMode: 0, // 当前布局模式
        layoutSpan: 12, // 布局宽度
        layoutModeOptions: layoutModeOptions,
        loginUserType: 0, // 登录用户类型
        loginUserTypeOptions: loginUserTypeOptions,
        addonMap: [], // 插件容器
        // XTerm
        xterms: [],
        xtermMap: {},
        xtermSize: {
          rows: 30
        },
        xtermTheme: { // 终端主题
          foreground: '#FFFFFF', // 字体
          background: '#606266', // 背景色
          cursor: 'help'// 设置光标
        },
        xtermWidth: 784,
        xtermHeight: 336,
        isBatch: false,
        handlerBatchType: '',
        timer: null // 心跳定时器
      }
    },
    mounted () {
      this.setXTermSetting()
      this.initWebSocketURL()
      this.$store.dispatch('d2admin/menu/asideCollapseSet', true)
    },
    beforeDestroy () {
      try {
        this.socket.close()
        for (let instanceId in this.xtermMap) {
          this.xtermMap[instanceId].dispose()
        }
      } catch (e) {
      }
      clearInterval(this.timer) // 销毁定时器
    },
    components: {
      ServerTree,
      DocDialog,
      UserXTermSetting
    },
    methods: {
      /**
       * 设置终端主题色彩
       */
      setXTermSetting () {
        queryUserSettingByGroup(settingGroup)
          .then(res => {
            if (res.success) {
              try {
                this.xtermTheme.foreground = res.body['XTERM_FOREGROUND']
                this.xtermTheme.background = res.body['XTERM_BACKGROUND']
                this.xtermSize.rows = res.body['XTERM_ROWS'] || 30
              } catch (e) {
              }
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      handlerSetting () {
        let xtermSettingMap = {}
        xtermSettingMap['XTERM_FOREGROUND'] = this.xtermTheme.foreground
        xtermSettingMap['XTERM_BACKGROUND'] = this.xtermTheme.background
        xtermSettingMap['XTERM_ROWS'] = this.xtermSize.rows
        this.formSettingStatus.visible = true
        this.$refs.userXTermSetting.initData(xtermSettingMap)
      },
      initWebSocketURL () {
        if (process.env.NODE_ENV === 'development') {
          this.socketURI = process.env.VUE_APP_WS_API + xtermUrl
        } else {
          let host = window.location.host
          let httpProtocol = window.location.href.split('://')[0]
          const socketURI = (httpProtocol === 'http' ? 'ws' : 'wss') + '://' + host + '/oc3/' + xtermUrl
          this.socketURI = socketURI
        }
      },
      setTimer () {
        this.timer = setInterval(() => {
          this.handlerSSHHeartbeat()
          // console.log('开始定时...每10秒执行一次')
        }, 10000)
      },
      /**
       * 发送空心跳 避免阿里云SLB会话断开
       */
      handlerSSHHeartbeat () {
        let heartbeat = {
          status: 'HEARTBEAT'
        }
        try {
          this.socketOnSend(JSON.stringify(heartbeat))
        } catch (e) {
        }
      },
      handlerPreviewUserDoc () {
        queryUserDocByType(1)
          .then(res => {
            // 返回数据
            this.formDocStatus.visible = true
            this.$refs.docDialog.initData(res.body)
          })
      },
      initTermInstance (hostname) {
        let that = this
        let id = hostname
        const term = new Terminal({
          rendererType: 'canvas', // 渲染类型
          allowTransparency: true,
          fontSize: 11,
          rows: this.xtermSize.rows,
          theme: this.xtermTheme,
          termName: 'xterm',
          visualBell: false,
          popOnBell: false,
          scrollback: 1000, // 最大滚动行数
          screenKeys: false,
          debug: false,
          cancelEvents: false,
          cursorStyle: 'underline', // 光标样式
          cursorBlink: true, // 光标闪烁
          convertEol: true // 启用时，光标将设置为下一行的开头
        })
        that.addonMap[id] = new FitAddon()
        term.loadAddon(that.addonMap[id])
        term.open(document.getElementById(id))
        // 获取对象的高度和宽度
        term.focus()
        term.onData(function (cmd) {
          let commond = {
            data: cmd,
            status: 'COMMAND',
            instanceId: id
          }
          that.socketOnSend(JSON.stringify(commond))
        })
        this.xtermMap[id] = term
      },
      handlerChangeLayout () {
        this.layoutSpan = this.layoutMode === 0 ? 12 : 24
        this.$nextTick(() => {
          this.handlerResize()
        })
      },
      /**
       * 后端调整体型
       */
      handlerResize () {
        for (let instanceId in this.xtermMap) {
          this.handlerResizeByInstanceId(instanceId)
        }
      },
      handlerResizeByInstanceId (instanceId) {
        this.addonMap[instanceId].fit() // 获取对象的高度和宽度
        let xtermResize = {
          status: 'RESIZE',
          instanceId: instanceId,
          xtermWidth: this.addonMap[instanceId]._terminal.cols * 7, // 自动计算宽度
          xtermHeight: document.getElementById(instanceId).clientHeight
        }
        this.socketOnSend(JSON.stringify(xtermResize))
        this.xtermMap[instanceId].focus()
        // 滚动到底部
        this.xtermMap[instanceId].scrollToBottom()
      },
      /**
       * 后端设置批量输入（服务端广播输入）
       */
      handlerBatchCmd () {
        this.isBatch = !this.isBatch
        if (this.isBatch) {
          this.handlerBatchType = 'success'
        } else {
          this.handlerBatchType = ''
        }
        let batchCommand = {
          status: 'BATCH_COMMAND',
          isBatch: this.isBatch
        }
        this.socketOnSend(JSON.stringify(batchCommand))
        /**
         * 按键事件监听的实现方式，需要按键转码
         * let _this = this
         document.onkeydown = function (e) {
             // 事件对象兼容
             let e1 = e || event || window.event
             for (var i = 0; i < _this.xterms.length; i++) {
                let id = _this.xterms[i]
                var command = {
                    data: e1.key,
                    keyCode: e1.keyCode,
                    status: 'BATCH_COMMAND',
                    // status: 'COMMAND',
                    instanceId: id
                   }
                _this.socketOnSend(JSON.stringify(command))
              }
            }
         */
      },
      /**
       * 复制会话，重开一个终端（支持变更用户类型）
       * @param id
       */
      handlerDuplicateSession (id) {
        // 计算 instanceId  源id  server-prod-1#1
        const instanceId = id.split('#')[0] + '#' + util.uuid()
        let duplicateSession = {
          status: 'DUPLICATE_SESSION',
          duplicateInstanceId: id,
          token: util.cookies.get('token'),
          loginUserType: this.loginUserType,
          instanceId: instanceId,
          xtermWidth: this.addonMap[id.split('#')[0]]._terminal.cols * 7,
          xtermHeight: document.getElementById(id.split('#')[0]).clientHeight
        }
        this.xterms.push(instanceId)

        this.$nextTick(() => {
          this.initTermInstance(instanceId)
          this.socketOnSend(JSON.stringify(duplicateSession))
          this.handlerResizeByInstanceId(instanceId)
        })
      },
      /**
       * 单个终端退出
       * @param id
       */
      handlerLogout (id) {
        let logout = {
          status: 'LOGOUT',
          instanceId: id
        }
        this.socketOnSend(JSON.stringify(logout))
        let term = this.xtermMap[id]
        term.dispose()
        delete (this.xtermMap[id])
        this.xterms = this.xterms.filter(function (n) {
          return n !== id
        })
        this.$message.warning(id + '终端已关闭')
      },
      handlerClose () {
        let close = {
          status: 'CLOSE'
        }
        this.socketOnSend(JSON.stringify(close))
        this.xterms = []
        this.xtermMap = {}
        this.pageStatus = 0
        this.xtermSpan = 16
        clearInterval(this.timer)
      },
      /**
       * 批量登录
       */
      handlerLogin () {
        this.pageStatus = 1
        this.xtermSpan = 24
        this.layoutSpan = this.layoutMode === 0 ? 12 : 24
        this.xtermMap = {}
        this.isBatch = false
        this.handlerBatchType = ''
        this.initSocket()
        this.setTimer()
      },
      /**
       * WS初始化
       */
      initSocket () {
        this.socket = new WebSocket(this.socketURI)
        this.socketOnClose()
        this.socketOnOpen()
        this.socketOnError()
        this.socketOnMessage()
      },
      socketOnOpen () {
        this.socket.onopen = () => { // 链接成功后
          try {
            let instanceIds = this.$refs.serverTree.getCheckedKeys(true)
            let uuid = this.$refs.serverTree.getUuid()
            this.xterms = instanceIds
            this.$nextTick(() => { // 需要延迟执行
              instanceIds.forEach(hostname => {
                this.initTermInstance(hostname)
              })
              let initXterm = {
                uuid: uuid,
                token: util.cookies.get('token'),
                loginUserType: this.loginUserType,
                instanceIds: instanceIds,
                status: 'INITIAL',
                xtermWidth: 0,
                xtermHeight: 308
              }
              this.socketOnSend(JSON.stringify(initXterm))
            })
            this.$nextTick(() => {
              this.handlerResize()
            })
          } catch (e) {
            this.$message.error('登录失败，未选择服务器或其它原因')
          }
        }
      },
      socketOnClose () {
        this.socket.onclose = () => {
        }
      },
      socketOnError () {
        this.socket.onerror = () => {
        }
      },
      socketOnSend (data) {
        this.socket.send(data)
      },
      socketOnMessage () {
        this.socket.onmessage = (message) => {
          let messageJson = JSON.parse(message.data)
          let that = this
          messageJson.map(function (n) {
            that.xtermMap[n.instanceId].write(n.output)
          })
        }
      }
    }
  }
</script>

<style scoped>
  .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .el-button {
    margin-left: 5px
  }
</style>
