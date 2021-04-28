<template>
  <el-tag @click="openUrl(jobUrl)">{{ jobName }}</el-tag>
</template>

<script>

  import util from '@/libs/util'

  export default {
    name: 'JobTag',
    props: ['jobName', 'jobUrl'],
    methods: {
      openUrl (url) {
        util.open(url)
      }
    }
  }
</script>

<style scoped>

</style>
