<template>
  <d2-container>
    <h1>{{title}}</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="实例" name="server">
        <CloudServerTable :formStatus="formCloudServerStatus" ref="cloudServerTable"></CloudServerTable>
      </el-tab-pane>
      <el-tab-pane label="镜像" name="image">
        <CloudImageTable :formStatus="formCloudImageStatus" ref="cloudImageTable"></CloudImageTable>
      </el-tab-pane>
      <el-tab-pane label="VPC" name="vpc">
        <CloudVPCTable :formStatus="formCloudVPCStatus" ref="cloudVPCTable"></CloudVPCTable>
      </el-tab-pane>
      <el-tab-pane label="实例模版" name="instanceTemplate">
        <CloudInstanceTemplateTable :formStatus="formCloudInstanceTemplateStatus" ref="cloudInstanceTemplateTable"></CloudInstanceTemplateTable>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

  import CloudServerTable from '@/components/opscloud/table/CloudServerTable.vue'
  import CloudImageTable from '@/components/opscloud/table/CloudImageTable.vue'
  import CloudVPCTable from '@/components/opscloud/table/CloudVPCTable.vue'
  import CloudInstanceTemplateTable from '@/components/opscloud/table/CloudInstanceTemplateTable.vue'

  export default {
    data () {
      return {
        activeName: 'server',
        formCloudServerStatus: {
          cloudServerKey: 'AliyunECSCloudServer',
          serverType: 2,
          showCpuColumn: true,
          showMemoryColumn: true
        },
        formCloudImageStatus: {
          cloudImageKey: 'AliyunCloudImage',
          cloudType: 2
        },
        formCloudVPCStatus: {
          cloudVPCKey: 'AliyunCloudVPC',
          cloudType: 2
        },
        formCloudInstanceTemplateStatus: {
          cloudInstanceKey: 'AliyunCloudInstance',
          cloudType: 2
        },
        title: 'Aliyun:ECS实例管理'
      }
    },
    components: {
      CloudServerTable,
      CloudImageTable,
      CloudVPCTable,
      CloudInstanceTemplateTable
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
