<template>
  <d2-container>
    <h1>{{title}}</h1>
    <el-row :gutter="40">
      <el-col :span="8">
        <el-card shadow="never">
          <MyApplicationTable ref="myApplicationTable"
                                        @handlerSelApplication="handlerSelApplication"></MyApplicationTable>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="never">
          <MyCiJobTable ref="myCiJobTable"></MyCiJobTable>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

  import MyApplicationTable from '@/components/opscloud/application/MyApplicationTable.vue'
  import MyCiJobTable from '@/components/opscloud/application/MyCiJobTable.vue'

  export default {
    data () {
      return {
        title: '我的应用'
      }
    },
    components: {
      MyApplicationTable,
      MyCiJobTable
    },
    mounted () {
    },
    methods: {
      handlerSelApplication (application) {
        this.$refs.myCiJobTable.initData(application)
      }
    }
  }
</script>

<style scoped>
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
