<template>
  <div>
    <el-tooltip class="item" effect="light" :content="build.buildStatus !== null? build.buildStatus: 'Running'" placement="top-start">
      <el-tag disable-transitions :type="build.buildStatus | getJobBuildStatusType "><i
        class="el-icon-loading" v-show="!build.finalized"></i>{{build.buildStatus|
        getJobBuildStatusText}}
      </el-tag>
    </el-tooltip>
  </div>
</template>

<script>

  // Filters
  import { getJobBuildStatusType, getJobBuildStatusText } from '@/filters/jenkins.js'

  export default {
    name: 'BuildStatus',
    props: ['build'],
    filters: {
      getJobBuildStatusType, getJobBuildStatusText
    }
  }
</script>

<style scoped>

</style>
