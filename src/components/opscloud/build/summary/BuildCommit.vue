<template>
  <div>
    <el-col :span="22">
      <span class="label">{{commit}}</span>
    </el-col>
    <el-col :span="2">
      <el-tooltip class="item" effect="light" content="commit" placement="top-start">
        <i class="fa fa-tag" aria-hidden="true"></i>
      </el-tooltip>
    </el-col>
  </div>
</template>

<script>

  export default {
    name: 'BuildCommit',
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

