<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-row>
        <hotTopStatistics></hotTopStatistics>
      </el-row>
    </template>
  </d2-container>
</template>

<script>

  // Component
  import hotTopStatistics from '@/components/opscloud/dashboard/HotTopStatistics'

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
      hotTopStatistics
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
