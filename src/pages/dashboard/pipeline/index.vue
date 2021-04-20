<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-row>
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><span class="title">Build Pipeline</span></span>
            <task-pipeline :buildType="0" :queryParam="queryParam"
                           @handlerOpenExecutor="handlerOpenExecutor"></task-pipeline>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">  <span class="title">Deployment Pipeline</span></span>
            <task-pipeline :buildType="1" :queryParam="queryParam"
                           @handlerOpenExecutor="handlerOpenExecutor"></task-pipeline>
          </el-tab-pane>
        </el-tabs>
      </el-row>
      <terminalMaster :formStatus="formTerminalStatus" ref="terminalMaster">
        <template :slot-scope="executor">
          <div class="tips" v-if="executor != null">
            <el-button type="text" style="margin-left: 10px; padding: 3px 0"
                       @click="handlerSendCmd()">[点击进入工作目录] `cd
              {{executor.workspace}}`
            </el-button>
          </div>
        </template>
      </terminalMaster>
    </template>
  </d2-container>
</template>

<script>

  // Component
  import taskPipeline from '@/components/opscloud/pipeline/TaskPipeline.vue'
  import terminalMaster from '@/components/opscloud/xterm/TerminalMaster'

  export default {
    name: 'HotTop',
    data () {
      return {
        title: '流水线任务视图',
        queryParam: {
          queryType: 'ALL',
          querySize: 4
        },
        executor: null,
        formTerminalStatus: {
          visible: false
        }
      }
    },
    computed: {},
    mounted () {
    },
    components: {
      taskPipeline,
      terminalMaster
    },
    methods: {
      handlerOpenExecutor (executor) {
        this.executor = executor
        this.formTerminalStatus.visible = true
        this.$refs.terminalMaster.open(executor.server)
      },
      handlerSendCmd () {
        let commandMessage = {
          data: 'cd ' + this.executor.workspace + '\n',
          status: 'COMMAND',
          instanceId: this.executor.server.name
        }
        this.$refs.terminalMaster.sendCmd(this.executor.server, commandMessage)
      }
    }
  }
</script>

<style lang="less" scoped>
  .tips {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 10px 10px;
    margin-bottom: 5px;
    margin-right: 10px;
  }

  .el-row {
    margin-left: 0px;
    margin-bottom: 5px;
    & :last-child {}
  }

  .title {
    color: #20A9D9;
    font-size: 20px;
    margin-left: 5px;
    margin-bottom: 10px;
  }
</style>
