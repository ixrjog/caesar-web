<template>
  <el-dialog :title="title"
             :visible.sync="formStatus.visible" :before-close="closeDialog" width="80%">
    <el-form>
      <el-card shadow="never">
        <div id="console" class="xterm"></div>
      </el-card>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import util from '@/libs/util'

  import 'xterm/css/xterm.css'
  import { Terminal } from 'xterm'
  import { FitAddon } from 'xterm-addon-fit'

  import { queryUserSettingByGroup } from '@api/user/user.setting.js'

  const wsUrl = 'ws/job/output'
  const settingGroup = 'XTERM'

  export default {
    name: 'ViewJobBuildOutput',
    data () {
      return {
        title: '构建日志详情',
        socketURI: util.wsUrl(wsUrl),
        timer: null,
        initParam: {
          buildType: '',
          buildId: ''
        },
        term: null,
        xtermSize: {
          rows: 30
        },
        labelWidth: '100px',
        xtermTheme: { // 终端主题
          foreground: '#FFFFFF', // 字体
          background: '#606266', // 背景色
          cursor: 'help'// 设置光标
        },
        fitAddon: null
      }
    },
    props: ['formStatus'],
    components: {},
    mounted () {
      this.setXTermSetting()
    },
    beforeDestroy () {
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
          // console.log('开始定时...每10秒执行一次')
        }, 10000)
      },
      initSocket () {
        this.socket = new WebSocket(this.socketURI)
        this.socketOnClose()
        this.socketOnOpen()
        this.socketOnError()
        this.socketOnMessage()
        this.setTimer() // 心跳
      },
      closeDialog () {
        if (this.socket !== null) {
          this.socket.close()
        }
        clearInterval(this.timer)
        if (this.term !== null) {
          this.term.clear()
          this.term.dispose()
          this.term = null
        }
        this.formStatus.visible = false
      },
      initLogOutput () {
        if (this.term !== null) {
          this.term.dispose()
        }
        const term = new Terminal({
          rendererType: 'canvas', // 渲染类型 canvas dom
          allowTransparency: true,
          fontSize: 11,
          rows: this.xtermSize.rows,
          theme: this.xtermTheme,
          termName: 'xterm',
          visualBell: false,
          popOnBell: false,
          scrollback: 5000, // 最大滚动行数
          screenKeys: false,
          debug: false,
          cancelEvents: false,
          cursorStyle: 'bar', // 光标样式
          cursorBlink: false, // 光标闪烁
          convertEol: true, // 启用时，光标将设置为下一行的开头
          disableStdin: true // 是否应禁用输入
        })
        this.fitAddon = new FitAddon()
        term.loadAddon(this.fitAddon)
        term.open(document.getElementById('console'))
        // term.write(this.output)
        // 获取对象的高度和宽度
        this.fitAddon.fit()
        term.focus()
        this.term = term
      },
      // 对外函数
      open (buildType, buildId) {
        this.initParam = {
          buildType: buildType,
          buildId: buildId
        }
        setTimeout(() => {
          this.initSocket()
        }, 500)
      },
      socketOnOpen () {
        this.socket.onopen = () => { // 链接成功后
          try {
            this.$nextTick(() => { // 需要延迟执行
              this.initLogOutput()
              let msg = {
                status: 'INITIAL',
                buildType: this.initParam.buildType,
                buildId: this.initParam.buildId
              }
              this.socketOnSend(JSON.stringify(msg))
            })
          } catch (e) {
          }
        }
      },
      socketOnClose () {
        this.socket.onclose = () => {
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
          this.term.write(message.data)
        }
      },
      handlerHeartbeat () {
        let heartbeat = {
          status: 'HEARTBEAT'
        }
        try {
          this.socketOnSend(JSON.stringify(heartbeat))
        } catch (e) {
        }
      },
      handleClick () {
        this.$emit('input', !this.value)
      }
    }
  }
</script>
