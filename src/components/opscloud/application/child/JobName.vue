<template>
  <div>
    <el-tooltip class="item" effect="light" :content="jobKey" placement="top-start">
      <span v-if="href === null || href === ''">{{ name }}</span>
      <el-button type="text" v-if="href !== null && href !== ''" @click="openUrl(href)">{{ name }}</el-button>
    </el-tooltip>
    <span class="tag-group">
              <span v-for="item in tags" :key="item.id">
                <el-tooltip class="item" effect="light" :content="item.comment" placement="top-start">
                  <el-tag style="margin-left: 5px" :style="{ color: item.color }">{{ item.tagKey }}</el-tag>
                </el-tooltip>
              </span>
    </span>
  </div>
</template>

<script>

  import util from '@/libs/util'

  export default {
    name: 'JobName',
    props: ['name', 'jobKey', 'href', 'tags'],
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
