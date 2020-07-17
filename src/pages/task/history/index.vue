<template>
  <d2-container>
    <template>
      <div>
        <h1>任务查询</h1>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <ServerTaskTable @previewTask="handlerPreviewTask"></ServerTaskTable>
        </el-col>
        <el-col :span="12">
          <AnsibleResult ref="ansibleResult"></AnsibleResult>
        </el-col>
      </el-row>
    </template>
  </d2-container>
</template>

<script>
  import ServerTaskTable from '@/components/opscloud/ansible/ServerTaskTable'
  import AnsibleResult from '@/components/opscloud/ansible/AnsibleResult'

  // API
  import {} from '@api/server/server.task.js'

  export default {
    data () {
      return {
        serverTask: '',
        taskId: ''
      }
    },
    mounted () {
    },
    components: {
      ServerTaskTable,
      AnsibleResult
    },
    methods: {
      handlerPreviewTask (id) {
        this.$refs.ansibleResult.initData(id)
      }
    }
  }
</script>
