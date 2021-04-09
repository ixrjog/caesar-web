<template>
  <div>
    <div :id="server.name" class="xterm"></div>
  </div>
</template>

<script>

  import 'xterm/css/xterm.css'
  import { Terminal } from 'xterm'
  import { FitAddon } from 'xterm-addon-fit'

  export default {
    data () {
      return {
        term: null,
        fitAddon: new FitAddon()
      }
    },
    name: 'TerminalItem',
    props: ['server', 'terminalSetting'],
    mixins: [],
    mounted () {
    },
    methods: {
      dispose () {
        try {
          this.term.dispose()
        } catch (e) {
        }
      },
      init () {
        let term = new Terminal({
          rendererType: 'canvas', // 渲染类型
          allowTransparency: true,
          fontSize: 11,
          rows: this.terminalSetting.rows,
          theme: this.terminalSetting.theme,
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
        term.loadAddon(this.fitAddon)
        term.open(document.getElementById(this.server.name))
        this.fitAddon.fit() // 获取对象的高度和宽度
        term.focus() // 聚焦
        let _this = this
        term.onData(function (cmd) {
          let command = {
            data: cmd,
            status: 'COMMAND',
            instanceId: _this.server.name
          }
          _this.sendMessage(JSON.stringify(command))
        })
        this.term = term
      },
      sendMessage (message) {
        this.$emit('sendMessage', message)
      },
      /**
       * 后端调整体型
       */
      resize () {
        let id = this.server.name
        this.fitAddon.fit() // 获取对象的高度和宽度
        let resizeMessage = {
          status: 'RESIZE',
          instanceId: id,
          xtermWidth: this.fitAddon._terminal.cols * 7, // 边界扣除
          xtermHeight: document.getElementById(this.server.name).clientHeight
        }
        this.sendMessage(JSON.stringify(resizeMessage))
        // 滚动到底部
        this.term.scrollToBottom()
      },
      write (output) {
        this.term.write(output)
      },
      /**
       * 单个终端退出
       * @param id
       */
      logout () {
        this.term.dispose()
        delete (this.term)
      }
    }
  }
</script>

<style>
  .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
