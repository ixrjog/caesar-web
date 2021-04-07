<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-col :span="12">
        <span class="title">Build Pipeline</span>
        <task-pipeline :buildType="0" :queryParam="queryParam" @handlerOpenExecutor="handlerOpenExecutor"></task-pipeline>
      </el-col>
      <el-col :span="12">
        <span class="title">Deployment Pipeline</span>
        <task-pipeline :buildType="1" :queryParam="queryParam" @handlerOpenExecutor="handlerOpenExecutor"></task-pipeline>
      </el-col>
      <terminal :formStatus="formTerminalStatus" ref="terminalDialog"></terminal>
    </template>
  </d2-container>
</template>

<script>

  // Component
  import taskPipeline from '@/components/opscloud/pipeline/TaskPipeline.vue'
  // XTerm
  import terminal from '@/components/opscloud/xterm/NodeTerminal'

  export default {
    name: 'HotTop',
    data () {
      return {
        title: '流水线任务视图',
        queryParam: {
          queryType: 'ALL',
          querySize: 4
        },
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
      terminal
    },
    methods: {
      handlerOpenExecutor (executor) {
        this.formTerminalStatus.visible = true
        this.$refs.terminalDialog.open(executor)
      }
    }
  }
</script>

<style>
  .el-row {
    margin-left: 0px;
    margin-bottom: 5px;
    &:last-child {}
  }

  .title {
    color: #20A9D9;
    font-size: 20px;
    margin-left: 5px;
    margin-bottom: 10px;
  }
</style>
