<template>
  <d2-container>
    <h1>{{title}}</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="工单组管理" name="workorderGroup">
        <WorkorderGroupTable ref="workorderGroupTable"></WorkorderGroupTable>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

  import WorkorderGroupTable from '@/components/opscloud/table/WorkorderGroupTable.vue'

  export default {
    data () {
      return {
        activeName: 'workorderGroup',
        title: '工单配置',
        creating: false,
        previewHosts: {}
      }
    },
    components: {
      WorkorderGroupTable
    },
    mounted () {
      this.$refs.workorderGroupTable.fetchData()
    },
    methods: {
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
