<template>
  <div v-if="steps !== null && steps.length !== 0">
    <el-divider></el-divider>
    <b class="stepsTitle">Steps Log</b>
    <el-button class="stepsButton" type="text" @click="closeSteps"><i class="el-icon-close"
                                                                      aria-hidden="true"></i>
    </el-button>
    <div v-for="(step,i) in steps" :key="step.id" style="font-size: 12px;margin-top: 5px">
      <div class="displayName">
        <el-tag effect="dark" :type="step.result|  getStepResultType">Step {{i +1}}</el-tag>
        {{ step.displayName }}
      </div>
      <terminal-log :terminalSetting="terminalSetting" :log="step.log"></terminal-log>
    </div>
  </div>
</template>

<script>

  import util from '@/libs/util'
  import terminalLog from '@/components/opscloud/xterm/TerminalLog.vue'

  import { getStepResultType } from '@/filters/pipeline/pipeline.step.js'

  import { queryUserSettingByGroup } from '@api/user/user.setting.js'

  const settingGroup = 'XTERM'

  const theme = {
    foreground: '#FFFFFF', // 字体
    background: '#606266', // 背景色
    cursor: 'help', // 设置光标
    red: '#dd7479'
  }

  export default {
    name: 'PipelineStep',
    props: [],
    components: {
      terminalLog
    },
    filters: {
      getStepResultType
    },
    mounted () {
      this.initTerminalSetting()
    },
    beforeDestroy () {
    },
    data () {
      return {
        item: {
          name: util.uuid()
        },
        terminalSetting: {
          theme: theme
        },
        steps: []
      }
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
      closeSteps () {
        this.steps = []
      },
      init (steps) {
        this.steps = steps
      },
      // handlerShowLog (i, step) {
      //   this.$nextTick(() => {
      //     let terminal = this.$refs[`terminalStep${i}`][0]
      //     terminal.init()
      //     terminal.write(step.log)
      //     debugger
      //   })
      // },
      sendMessage (message) {
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

  .stepsTitle {
    color: #5b5d66;
    margin-left: 10px;
  }

  .stepsButton {
    float: right;
    padding: 3px 0;
    margin-right: 10px;
  }

  .displayName {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }

</style>
