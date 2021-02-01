<template>
  <div>
    <div v-show="isShow">
      <div v-for="item in status.blockPlatforms" :key="item.id" style="margin-bottom: 10px">
        <el-alert :title="item.comment" type="warning" show-icon>封网时间 {{ item.startTime}} - {{ item.endTime}}</el-alert>
      </div>
    </div>
  </div>
</template>

<script>

  import { queryBlockPlatformStatus } from '@api/platform/platform.block.js'

  export default {
    name: 'BlockPlatformStatus',
    data () {
      return {
        status: {
          blockPlatforms: []
        },
        isShow: true
      }
    },
    mounted () {
      this.fetchData()
    },
    components: {},
    methods: {
      fetchData () {
        queryBlockPlatformStatus()
          .then(res => {
            this.status = res.body
            this.isShow = this.status.show
          })
      }
    }
  }
</script>

<style scoped>

</style>
