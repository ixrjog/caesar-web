<template>
  <d2-container>
    <h1>{{title}}</h1>
    <el-row :gutter="10">
      <el-col :span="10">
          <job-tpl-table ref="jobTplTable" @handlerSelTemplate="handlerSelTemplate"></job-tpl-table>
      </el-col>
      <el-col :span="14">
          <job-card ref="jobCard"></job-card>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

  import JobTplTable from '@/components/opscloud/jenkins/JobTplTable.vue'
  import jobCard from '@/components/opscloud/jenkins/JobCard.vue'

  export default {
    data () {
      return {
        title: '模版版本管理'
      }
    },
    components: {
      JobTplTable,
      jobCard
    },
    mounted () {
    },
    methods: {
      handlerSelTemplate (jobTpl) {
        this.$refs.jobCard.initData(jobTpl)
      }
    }
  }
</script>

<style scoped>

</style>
