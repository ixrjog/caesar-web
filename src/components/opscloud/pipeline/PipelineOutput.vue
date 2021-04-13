<template>
  <div>
    <div v-if="showOutput">
      <el-divider></el-divider>
      <el-row>
        <b class="outputTitle">Console Output</b>
        <i style="margin-left: 5px" class="el-icon-loading" v-if="loading"></i>
        <el-button class="outputButton" type="text" @click="closeOutput"><i class="el-icon-close"
                                                                            aria-hidden="true"></i>
        </el-button>
        <el-tooltip class="item" effect="light" content="适应窗体" placement="top-start" v-if="false">
          <el-button class="outputButton" type="text" @click="fit">
            <i class="fa fa-object-ungroup" aria-hidden="true"></i>
          </el-button>
        </el-tooltip>
      </el-row>
      <terminal-item :terminalSetting="terminalSetting" :server="item" @sendMessage="sendMessage"
                     :ref="`terminal_${uuid}`" :id="`terminal_${uuid}`"></terminal-item>
    </div>
  </div>
</template>

<script>

  import util from '@/libs/util'

  import terminalItem from '@/components/opscloud/xterm/TerminalItem.vue'

  import { queryUserSettingByGroup } from '@api/user/user.setting.js'

  const wsUrl = 'ws/job/output'
  const settingGroup = 'XTERM'

  const theme = {
    foreground: '#FFFFFF', // 字体
    background: '#606266', // 背景色
    cursor: 'help' // 设置光标
  }

  export default {
    name: 'PipelineOutput',
    data () {
      return {
        title: '构建日志详情',
        showOutput: false,
        socketURI: util.wsUrl(wsUrl),
        timer: null,
        interval: 15000, // INTERVAL
        uuid: util.uuid(),
        item: {
          name: util.uuid()
        },
        loading: true,
        terminalSetting: {
          theme: theme
        }
      }
    },
    props: ['buildType', 'buildId'],
    components: {
      terminalItem
    },
    mounted () {
      this.initTerminalSetting()
    },
    beforeDestroy () {
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
      setTimer () {
        this.timer = setInterval(() => {
          this.handlerHeartbeat()
        }, this.interval)
      },
      output () {
        if (this.showOutput) return
        this.loading = true
        this.showOutput = true
        this.initTerminal()
        this.doOutput()
      },
      outputLog (log) {
        if (this.showOutput) {
          this.$refs[`terminal_${this.uuid}`].clear()
        } else {
          this.showOutput = true
          this.initTerminal()
        }
        this.$nextTick(() => {
          this.$refs[`terminal_${this.uuid}`].write(log)
          this.$refs[`terminal_${this.uuid}`].scrollToBottom()
          this.loading = false
        })
      },
      initTerminal () {
        this.$nextTick(() => {
          this.$refs[`terminal_${this.uuid}`].init()
        })
      },
      initSocket () {
        this.socket = new WebSocket(this.socketURI)
        this.socketOnClose()
        this.socketOnOpen()
        this.socketOnError()
        this.socketOnMessage()
        this.setTimer() // 心跳
      },
      fit () {
        // this.fitAddon.fit()
      },
      closeOutput () {
        if (this.socket !== undefined && !this.socket) {
          debugger
          this.socket.close()
        }
        clearInterval(this.timer)
        this.showOutput = false
      },
      doOutput () {
        setTimeout(() => {
          this.initSocket()
        }, 500)
      },
      socketOnOpen () {
        this.socket.onopen = () => { // 链接成功后
          try {
            this.$nextTick(() => { // 需要延迟执行
              let msg = {
                status: 'INITIAL',
                buildType: this.buildType,
                buildId: this.buildId
              }
              this.sendMessage(JSON.stringify(msg))
            })
          } catch (e) {
          }
        }
      },
      sendMessage (message) {
        this.socketOnSend(message)
      },
      socketOnClose () {
        this.socket.onclose = () => {
          this.loading = false
          if (this.socket !== null) {
            this.socket.close()
          }
          clearInterval(this.timer)
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
          this.$refs[`terminal_${this.uuid}`].write(message.data)
        }
      },
      handlerHeartbeat () {
        let heartbeat = {
          status: 'HEARTBEAT'
        }
        try {
          this.sendMessage(JSON.stringify(heartbeat))
        } catch (e) {
        }
      },
      handleClick () {
        this.$emit('input', !this.value)
      }
    }
  }
</script>

<style scoped>

  .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 5px 0;
  }

  .outputTitle {
    color: #5b5d66;
    margin-left: 10px;
  }

  .outputButton {
    float: right;
    padding: 3px 0;
    margin-right: 10px;
  }

  .xterm {
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: 5px;
  }

</style>
