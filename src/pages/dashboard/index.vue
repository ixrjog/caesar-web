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
        <el-col>
          <taskExecutionGroupByWeek></taskExecutionGroupByWeek>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col>
          <taskExecutionGroupByHour></taskExecutionGroupByHour>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="9">
          <jobTypeStatistics></jobTypeStatistics>
        </el-col>
        <el-col :span="15">
          <engineChart></engineChart>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col>
          <dashboardLatestTasks></dashboardLatestTasks>
        </el-col>
      </el-row>
    </template>
  </d2-container>
</template>

<script>

  // Component
  import topCard from '@/components/opscloud/dashboard/TopCard'
  import engineChart from '@/components/opscloud/jenkins/EngineChart'
  import dashboardLatestTasks from '@/components/opscloud/dashboard/DashboardLatestTasks'
  import taskExecutionGroupByHour from '@/components/opscloud/dashboard/TaskExecutionGroupByHour'
  import taskExecutionGroupByWeek from '@/components/opscloud/dashboard/TaskExecutionGroupByWeek'
  import jobTypeStatistics from '@/components/opscloud/dashboard/JobTypeStatistics'

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
      dashboardLatestTasks,
      taskExecutionGroupByHour,
      taskExecutionGroupByWeek,
      jobTypeStatistics,
      engineChart
    },
    methods: {}
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
</style>
