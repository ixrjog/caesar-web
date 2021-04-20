<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="80%" @close='handlerExit'>
    <div v-for="(xterm,i) in xterms" :key="xterm">
      <template>
        <el-col :span="24">
          <el-alert title="常用命令" type="success" show-icon style="margin-bottom: 5px">
            <el-button type="text" @click="handlerSendCmd(0)">
              <span>[点击进入工作目录] cd {{executor.workspace}}</span>
            </el-button>
          </el-alert>
          <el-card shadow="hover" body-style="padding: 2px" style="margin-right: 10px;margin-bottom: 10px">
            <div slot="header" class="clearfix" style="height: 15px">
              <span> <el-tag> {{ xterm }}</el-tag></span>
              <el-tooltip class="item" effect="light" content="退出" placement="top-start">
                <el-button style="float: right; padding: 3px 0" type="text" @click="handlerLogout(xterm)">
                  Logout
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="复制会话" placement="top-start">
                <el-button style="float: right; padding: 3px 0;margin-right: 20px" type="text"
                           @click="handlerDuplicateSession()">Duplicate
                </el-button>
              </el-tooltip>
            </div>
            <div :id="xterm" class="xterm" :ref="`terminal${i}`">
            </div>
          </el-card>
        </el-col>
      </template>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handlerExit">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import util from '@/libs/util'
  // X-Terminal
  import 'xterm/css/xterm.css'
  import { Terminal } from 'xterm'
  import { FitAddon } from 'xterm-addon-fit'

  import { queryUserSettingByGroup } from '@api/user/user.setting.js'

  const wsUrl = 'ws/xterm'
  const settingGroup = 'XTERM'

  export default {
    data () {
      return {
        title: '工作节点',
        socketURI: util.wsUrl(wsUrl),
        executor: {},
        server: {},
        // 插件容器
        addonMap: [],
        // XTerm
        xterms: [],
        terminalMap: {},
        timer: null, // 心跳定时器
        xtermSize: {
          rows: 30
        },
        xtermTheme: { // 终端主题
          foreground: '#FFFFFF', // 字体
          background: '#606266', // 背景色
          cursor: 'help'// 设置光标
        }
      }
    },
    name: 'NodeTerminal',
    props: ['formStatus'],
    mixins: [],
    mounted () {
      this.setXTermSetting()
    },
    beforeDestroy () {
      try {
        this.socket.close()
        for (let instanceId in this.terminalMap) {
          this.terminalMap[instanceId].dispose()
        }
      } catch (e) {
      }
      clearInterval(this.timer) // 销毁定时器
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
      handlerExit () {
        this.handlerClose()
        try {
          this.socket.close()
          for (let instanceId in this.terminalMap) {
            this.terminalMap[instanceId].dispose()
          }
        } catch (e) {
        }
        this.formStatus.visible = false
      },
      // 对外
      open (executor) {
        this.executor = executor
        this.server = executor.server
        this.handlerLogin()
      },
      setTimer () {
        this.timer = setInterval(() => {
          this.handlerSSHHeartbeat()
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
      initTermInstance (server) {
        let id = server.name
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
        this.addonMap[id] = new FitAddon()
        term.loadAddon(this.addonMap[id])
        term.open(document.getElementById(id))
        // 获取对象的高度和宽度
        this.addonMap[id].fit()
        term.focus()
        let _this = this
        term.onData(function (cmd) {
          let command = {
            data: cmd,
            status: 'COMMAND',
            instanceId: id
          }
          _this.socketOnSend(JSON.stringify(command))
        })
        this.terminalMap[id] = term
      },
      /**
       * 后端调整体型
       */
      handlerResize () {
        for (let instanceId in this.terminalMap) {
          // 获取对象的高度和宽度
          this.addonMap[instanceId].fit()
          let xtermResize = {
            status: 'RESIZE',
            instanceId: instanceId,
            xtermWidth: this.addonMap[instanceId]._terminal.cols * 7, // 边界扣除
            xtermHeight: document.getElementById(instanceId).clientHeight
          }
          this.socketOnSend(JSON.stringify(xtermResize))
          // 滚动到底部
          this.terminalMap[instanceId].scrollToBottom()
        }
      },
      /**
       * 复制会话，重开一个终端（支持变更用户类型）
       * @param id
       */
      handlerDuplicateSession () {
        // 计算 instanceId  源id  server-prod-1#1
        const instanceId = this.server.name + '#' + util.uuid()

        let duplicateSession = {
          status: 'DUPLICATE_SESSION_IP',
          duplicateInstanceId: this.server.name,
          token: util.cookies.get('token'),
          instanceId: instanceId,
          xtermWidth: this.addonMap[instanceId.split('#')[0]]._terminal.cols * 7,
          xtermHeight: document.getElementById(instanceId.split('#')[0]).clientHeight
        }
        this.xterms.push(instanceId)
        let server = {
          name: instanceId,
          ip: this.server.privateIp
        }
        this.$nextTick(() => {
          this.initTermInstance(server)
          this.socketOnSend(JSON.stringify(duplicateSession))
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
        let term = this.terminalMap[id]
        term.dispose()
        delete (this.terminalMap[id])
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
        this.terminalMap = {}
        clearInterval(this.timer)
      },
      /**
       * 批量登录
       */
      handlerLogin () {
        this.terminalMap = {}
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
            this.xterms = []
            this.xterms.push(this.server.name)
            this.$nextTick(() => { // 需要延迟执行
              this.initTermInstance(this.server)
              let initXterm = {
                token: util.cookies.get('token'),
                instanceId: this.server.name,
                ip: this.server.privateIp,
                status: 'INITIAL_IP',
                xtermWidth: 0,
                xtermHeight: 308
              }
              this.socketOnSend(JSON.stringify(initXterm))
              this.$nextTick(() => {
                this.handlerResize()
              })
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
          // console.log('socket 链接失败')
        }
      },
      socketOnSend (data) {
        this.socket.send(data)
      },
      socketOnMessage () {
        this.socket.onmessage = (message) => {
          let messageJson = JSON.parse(message.data)
          let _this = this
          messageJson.map(function (n) {
            _this.terminalMap[n.instanceId].write(n.output)
          })
        }
      },
      handlerSendCmd () {
        for (let id in this.terminalMap) {
          let command = {
            data: 'cd ' + this.executor.workspace + '\n',
            status: 'COMMAND',
            instanceId: id
          }
          this.socketOnSend(JSON.stringify(command))
        }
        this.terminalMap[this.server.name].focus() // 强制焦点
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

  .el-button--text {
    margin-left: 10px;
    padding: 3px 0;
  }
</style>
