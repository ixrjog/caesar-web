<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" :before-close="handlerCloseDialog">
    <el-col :span="24">
      <el-card shadow="hover" body-style="padding: 2px" style="margin-right: 10px;margin-bottom: 10px">
        <div slot="header" class="clearfix" style="height: 15px">
          <span><el-tag>{{sessionInstance.instanceId}}</el-tag></span>
        </div>
        <div id="auditXterm" class="xterm"></div>
      </el-card>
    </el-col>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handlerCloseDialog">关闭</el-button>
      <!--      <el-button size="mini" @click="ok">ok</el-button>-->
    </div>
  </el-dialog>
</template>

<script>

  import 'xterm/css/xterm.css'
  import { Terminal } from 'xterm'
  import { FitAddon } from 'xterm-addon-fit'

  import { querySessionInstanceById } from '@api/term/term.session.js'
  import { queryUserSettingByGroup } from '@api/user/user.setting.js'

  const settingGroup = 'XTERM'

  export default {
    data () {
      return {
        title: '审计日志',
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
    name: 'PreviewTermAuditLogDialog',
    props: ['formStatus'],
    mixins: [],
    mounted () {
      this.setXTermSetting()
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
      handlerCloseDialog () {
        this.sessionInstance = ''
        this.term.dispose()
        this.term = ''
        this.formStatus.visible = false
      },
      initData (id) {
        querySessionInstanceById(id)
          .then(res => {
            this.sessionInstance = res.body
            this.handlerAuditLog()
          })
      },
      handlerAuditLog () {
        const term = new Terminal({
          rendererType: 'canvas', // 渲染类型 canvas dom
          allowTransparency: true,
          fontSize: 11,
          theme: this.xtermTheme,
          termName: 'xterm',
          visualBell: false,
          popOnBell: false,
          scrollback: 1000, // 最大滚动行数
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
        term.open(document.getElementById('auditXterm'))
        term.write(this.sessionInstance.auditLog.content)
        // 获取对象的高度和宽度
        fitAddon.fit()
        term.focus()
        this.term = term
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
