<template>
  <div>
    <el-row style="margin-bottom: 10px">
      <el-radio v-model="radio" label="build">构建任务</el-radio>
      <el-radio v-model="radio" label="deployment">部署任务</el-radio>
    </el-row>
    <el-col :span="11">
      <task-pipeline :buildType="0" :queryParam="queryParam" @handlerOpenServer="handlerOpenXTerm" v-show="radio === 'build'"></task-pipeline>
      <task-pipeline :buildType="1" :queryParam="queryParam" @handlerOpenServer="handlerOpenXTerm" v-show="radio === 'deployment'"></task-pipeline>
    </el-col>
    <el-col :span="13">
      <pipeline-output ref="pipelineOutput"></pipeline-output>
    </el-col>
    <terminal :formStatus="formXtermStatus" ref="xtermDialog"></terminal>
  </div>
</template>

<script>

  import TaskPipeline from '@/components/opscloud/pipeline/TaskPipeline.vue'
  import PipelineOutput from '@/components/opscloud/pipeline/PipelineOutput'

  import terminal from '@/components/opscloud/xterm/Terminal'

  export default {
    data () {
      return {
        radio: 'build',
        queryParam: {
          queryType: 'MY',
          querySize: 3
        },
        formXtermStatus: {
          visible: false
        }
      }
    },
    components: {
      TaskPipeline,
      PipelineOutput,
      terminal
    },
    beforeDestroy () {
    },
    mounted () {
    },
    methods: {
      handlerOpenXTerm (server) {
        console.log(server)
        this.formXtermStatus.visible = true
        this.$refs.xtermDialog.initData(server)
      }
    }
  }
</script>

<style>
  .table-expand {
    font-size: 0;
  }

  .table-expand label {
    width: 150px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
