<template>
  <d2-container>
    <h1>{{title}}</h1>
    <el-row :gutter="10">
      <el-col :span="10">
        <el-card shadow="never">
          <jobTplTable ref="jobTplTable" @handlerSelTemplate="handlerSelTemplate"></jobTplTable>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card shadow="never">
          <jobTable ref="jobTable"></jobTable>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

  import JobTplTable from '@/components/opscloud/jenkins/JobTplTable.vue'
  import JobTable from '@/components/opscloud/jenkins/JobTable.vue'

  export default {
    data () {
      return {
        title: '模版版本管理'
      }
    },
    components: {
      JobTplTable,
      JobTable
    },
    mounted () {
    },
    methods: {
      handlerSelTemplate (jobTpl) {
        this.$refs.jobTable.initData(jobTpl)
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
