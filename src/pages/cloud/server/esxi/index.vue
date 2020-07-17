<template>
  <d2-container>
    <h1>{{title}}</h1>
    <CloudServerTable :formStatus="formStatus" ref="cloudServerTable"></CloudServerTable>
  </d2-container>
</template>

<script>

  import CloudServerTable from '@/components/opscloud/table/CloudServerTable.vue'

  export default {
    data () {
      return {
        formStatus: {
          cloudServerKey: 'VcsaESXiCloudServer',
          serverType: 5,
          showCpuColumn: true,
          showMemoryColumn: true
        },
        title: 'VCSA:ESXi实例管理'
      }
    },
    components: {
      CloudServerTable
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
