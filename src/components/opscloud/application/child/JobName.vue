<template>
  <div>
    <el-tooltip class="item" effect="light" :content="jobKey" placement="top-start">
      <span v-if="href === null || href === ''">{{ name }}</span>
      <el-button type="text" v-if="href !== null && href !== ''" @click="openUrl(href)">{{ name }}</el-button>
    </el-tooltip>
    <business-tags :tags="tags"></business-tags>
  </div>
</template>

<script>

  import util from '@/libs/util'
  import BusinessTags from '../../common/BusinessTags'

  export default {
    name: 'JobName',
    props: ['name', 'jobKey', 'href', 'tags'],
    components: {
      BusinessTags
    },
    methods: {
      openUrl (url) {
        util.open(url)
      }
    }
  }
</script>

<style scoped>

  .el-button {
    color: #20A9D9;
  }

</style>
