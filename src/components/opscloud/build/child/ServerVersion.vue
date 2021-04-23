<template>
  <div>
    <el-card shadow="never">
      <div v-for="server in servers" :key="server.id">
        <el-tag style="margin-left: 5px" type="primary">{{ server.displayName }} - {{
          server.privateIp}}
        </el-tag>
        <el-tag style="margin-left: 2px" type="success" effect="dark">{{ server.deployVersion === null ? '首次发布':
          server.deployVersion.versionName}}
        </el-tag>
      </div>
    </el-card>
  </div>

</template>

<script>
  export default {
    name: 'ServerVersion',
    props:['servers']
  }
</script>

<style scoped>

</style>
