<template>
  <d2-container>
    <h1>资源管理</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="资源配置" name="authResource">
        <AuthResourceTable ref="authResourceTable"></AuthResourceTable>
      </el-tab-pane>
      <el-tab-pane label="资源组" name="authGroup">
        <AuthGroupTable ref="authGroupTable"></AuthGroupTable>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>
  import AuthResourceTable from '@/components/opscloud/table/AuthResourceTable.vue'
  import AuthGroupTable from '@/components/opscloud/table/AuthGroupTable.vue'

  export default {
    data () {
      return {
        activeName: 'authResource'
      }
    },
    mounted () {
    },
    components: {
      AuthResourceTable,
      AuthGroupTable
    },
    methods: {
    }
  }
</script>
