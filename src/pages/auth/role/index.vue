<template>
  <d2-container>
    <h1>角色管理</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="角色配置" name="authRole">
        <AuthRoleTable ref="authRoleTable"></AuthRoleTable>
      </el-tab-pane>
      <el-tab-pane label="角色资源配置" name="authRoleResource">
        <AuthRoleResourceTable ref="authRoleResourceTable"></AuthRoleResourceTable>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>
  import AuthRoleTable from '@/components/opscloud/table/AuthRoleTable.vue'
  import AuthRoleResourceTable from '@/components/opscloud/table/AuthRoleResourceTable.vue'

  export default {
    data () {
      return {
        activeName: 'authRole'
      }
    },
    mounted () {
    },
    components: {
      AuthRoleTable,
      AuthRoleResourceTable
    },
    methods: {
    }
  }
</script>
