<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-row>
        <topCard></topCard>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="9">
          <jenkinsEngineStatus></jenkinsEngineStatus>
        </el-col>
        <el-col :span="15">
          <dashboardLatestTasks></dashboardLatestTasks>
        </el-col>
      </el-row>
    </template>
  </d2-container>
</template>

<script>

  // Component
  import topCard from '@/components/opscloud/dashboard/TopCard'
  import jenkinsEngineStatus from '@/components/opscloud/jenkins/JenkinsEngineStatus.vue'
  import dashboardLatestTasks from '@/components/opscloud/dashboard/DashboardLatestTasks'

  export default {
    name: 'Dashboard',
    data () {
      return {
        title: 'Dashboard'
      }
    },
    computed: {},
    mounted () {
    },
    components: {
      topCard,
      jenkinsEngineStatus,
      dashboardLatestTasks
    },
    methods: {}
  }
</script>

<style>
  .el-row {
    margin-left: 0px;
    margin-bottom: 5px;&:last-child {}
  }
</style>
