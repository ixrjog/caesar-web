<template>
  <div>
    <el-col :span="22">
      <div><span class="label" v-show="buildTime !== null && buildTime !== ''">构建时长</span> {{buildTime}}</div>
      <div><span class="label">开始时间</span> {{startTime}}</div>
      <div><span class="label" v-show="endTime !== null && endTime !== ''">结束时间</span> {{endTime}}</div>
    </el-col>
    <el-col :span="2">
      <el-tooltip class="item" effect="light" content="构建时间" placement="top-start">
        <i class="el-icon-time" aria-hidden="true"></i>
      </el-tooltip>
    </el-col>
  </div>
</template>

<script>

  export default {
    name: 'BuildTimes',
    data () {
      return {}
    },
    props: ['buildTime', 'startTime', 'endTime'],
    filters: {},
    mounted () {
    },
    methods: {}
  }
</script>

<style>
  .label {
    color: #99a9bf;
  }
</style>

