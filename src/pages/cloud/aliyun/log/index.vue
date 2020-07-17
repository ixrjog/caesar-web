<template>
  <d2-container>
    <h1>{{title}}</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label=配置 name="options">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-card shadow="never">
              <AliyunLogTable ref="aliyunLogTable" @handlerSelLog="handlerSelLog"></AliyunLogTable>
            </el-card>
          </el-col>
          <el-col :span="14">
            <el-card shadow="never">
              <AliyunLogMemberTable ref="aliyunLogMemberTable"></AliyunLogMemberTable>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

  import AliyunLogTable from '@/components/opscloud/table/AliyunLogTable.vue'
  import AliyunLogMemberTable from '@/components/opscloud/table/AliyunLogMemberTable.vue'

  export default {
    data () {
      return {
        activeName: 'options',
        title: '日志服务'
      }
    },
    components: {
      AliyunLogTable,
      AliyunLogMemberTable
    },
    mounted () {
    },
    methods: {
      handlerSelLog (logId) {
        this.$refs.aliyunLogMemberTable.initData(logId)
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
