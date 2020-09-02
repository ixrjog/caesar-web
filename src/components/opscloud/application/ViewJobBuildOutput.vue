<template>
  <el-dialog :title="title"
             :visible.sync="formStatus.visible" :before-close="closeDialog" width="80%">
    <el-form>
      <el-card shadow="never">
        <div id="outputXterm" class="xterm"></div>
      </el-card>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
      <el-button size="mini" type="primary" @click="queryJobBuildOutput" v-if="false">刷新</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { viewJobBuildOutput } from '@api/build/job.build.js'

  import 'xterm/css/xterm.css'
  import { Terminal } from 'xterm'
  import { FitAddon } from 'xterm-addon-fit'

  import { queryUserSettingByGroup } from '@api/user/user.setting.js'

  const settingGroup = 'XTERM'

  export default {
    data () {
      return {
        title: '构建日志详情',
        buildType: '',
        buildId: '',
        output: '',
        xterm: 'auditXterm',
        term: null,
        sessionInstance: '',
        labelWidth: '100px',
        xtermTheme: { // 终端主题
          foreground: '#FFFFFF', // 字体
          background: '#606266', // 背景色
          cursor: 'help'// 设置光标
        }
      }
    },
    name: 'ViewJobBuildOutput',
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
      closeDialog () {
        this.sessionInstance = ''
        this.term.dispose()
        this.term = null
        this.formStatus.visible = false
      },
      queryJobBuildOutput () {
        let requestBody = {
          buildType: this.buildType,
          buildId: this.buildId
        }
        viewJobBuildOutput(requestBody)
          .then(res => {
            if (res.success) {
              this.output = res.body
              this.handlerOutput()
            }
          })
      },
      initData (buildType, buildId) {
        this.buildType = buildType
        this.buildId = buildId
        this.queryJobBuildOutput()
      },
      handlerOutput () {
        if (this.term !== null) {
          this.term.dispose()
        }
        const term = new Terminal({
          rendererType: 'canvas', // 渲染类型 canvas dom
          allowTransparency: true,
          fontSize: 11,
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
        let fitAddon = new FitAddon()
        term.loadAddon(fitAddon)
        term.open(document.getElementById('outputXterm'))
        term.write(this.output)
        // 获取对象的高度和宽度
        fitAddon.fit()
        term.focus()
        this.term = term
      },
      handleClick () {
        this.$emit('input', !this.value)
      }
    }
  }
</script>
