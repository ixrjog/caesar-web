<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-col :span="12">
        <span class="title">Build Pipeline</span>
        <task-pipeline :buildType="0" :queryParam="queryParam" @handlerOutput="handlerPipelineOutput"></task-pipeline>
      </el-col>
      <el-col :span="12">
        <span class="title">Deployment Pipeline</span>
        <task-pipeline :buildType="1" :queryParam="queryParam" @handlerOutput="handlerPipelineOutput"></task-pipeline>
      </el-col>
    </template>
  </d2-container>
</template>

<script>

  // Component
  import taskPipeline from '@/components/opscloud/pipeline/TaskPipeline.vue'

  export default {
    name: 'HotTop',
    data () {
      return {
        title: '流水线任务视图',
        queryParam: {
          queryType: 'ALL',
          querySize: 4
        }
      }
    },
    computed: {},
    mounted () {
    },
    components: {
      taskPipeline
    },
    methods: {
      handlerPipelineOutput (param) {
        // this.$refs.pipelineOutput.initData(param)
      }
    }
  }
</script>

<style>
  .el-row {
    margin-left: 0px;
    margin-bottom: 5px;

  &
  :last-child {
  }

  }

  .title {
    color: #20A9D9;
    font-size: 20px;
    margin-left: 5px;
    margin-bottom: 10px;
  }
</style>
