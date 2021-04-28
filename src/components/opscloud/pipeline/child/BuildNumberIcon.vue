<template>
      <span class="icon" @click="openUrl(pipeline.buildUrl)">
        <i class="el-icon-loading" v-show="pipeline.isRunning"></i>#{{ pipeline.jobBuildNumber }}</span>
</template>

<script>

  import util from '@/libs/util'

  export default {
    name: 'BuildNumberIcon',
    props: ['pipeline'],
    methods: {
      openUrl (url) {
        util.open(url)
      }
    }
  }
</script>

<style scoped>

</style>
