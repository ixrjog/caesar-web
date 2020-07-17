<template>
  <d2-container>
    <h1>{{title}}</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="用户" name="ramUser">
        <AliyunRAMUserTable ref="aliyunRAMUserTable"></AliyunRAMUserTable>
      </el-tab-pane>
      <el-tab-pane label="策略" name="ramPolicy">
        <AliyunRAMPolicyTable ref="aliyunRAMPolicyTable"></AliyunRAMPolicyTable>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

  import AliyunRAMUserTable from '@/components/opscloud/table/AliyunRAMUserTable.vue'
  import AliyunRAMPolicyTable from '@/components/opscloud/table/AliyunRAMPolicyTable.vue'

  export default {
    data () {
      return {
        activeName: 'ramUser',
        title: 'RAM访问控制'
      }
    },
    components: {
      AliyunRAMUserTable,
      AliyunRAMPolicyTable
    },
    mounted () {
      //   this.$refs.cloudServerTable.fetchData()
    },
    methods: {}
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
