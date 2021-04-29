<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-row>
        <hot-top-statistics></hot-top-statistics>
      </el-row>
    </template>
  </d2-container>
</template>

<script>

  // Component
  import HotTopStatistics from '@/components/opscloud/dashboard/HotTopStatistics'

  export default {
    name: 'HotTop',
    data () {
      return {
        title: '热门排行'
      }
    },
    computed: {},
    mounted () {
    },
    components: {
      HotTopStatistics
    },
    methods: {}
  }
</script>

<style>
  .el-row {
    margin-left: 0px;
    margin-bottom: 5px;

  &
  :last-child {
  }

  }
</style>
