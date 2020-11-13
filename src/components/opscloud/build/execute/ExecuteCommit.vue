<template>
  <div>
    <el-card shadow="naver">
      <div><span style="color: #99a9bf">id </span>{{commit.id}}</div>
      <div><span style="color: #99a9bf">message </span>{{commit.message}}</div>
    </el-card>
  </div>
</template>

<script>

  export default {
    name: 'ExecuteCommit',
    data () {
      return {}
    },
    props: ['commit'],
    filters: {},
    mounted () {
    },
    methods: {}
  }
</script>

<style scoped>
  .label {
    color: #248bd9;
  }
</style>

