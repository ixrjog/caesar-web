<template>
  <div>
    <el-card shadow="hover">
      <div v-for="(value, key) in parameters" :key="key">
        <div><el-tag>{{key}}</el-tag></div>
        <span style="margin-top: 2px;margin-bottom: 5px">{{ value }}</span>
        <el-divider></el-divider>
      </div>
    </el-card>
  </div>
</template>

<script>

  export default {
    name: 'ParamView',
    data () {
      return {}
    },
    props: ['parameters'],
    methods: {
    }
  }
</script>

<style scoped>

</style>
