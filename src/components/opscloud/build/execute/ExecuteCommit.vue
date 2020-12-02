<template>
  <div>
    <el-alert title="Commit" type="success" show-icon style="margin-bottom: 5px">
      <span>{{commit.commitMessage}}</span>
      <el-button type="text" style="margin-left: 10px; padding: 3px 0" @click="handlerOpenUrl(1)">[点击查看详情]
        {{commit.commit}}
      </el-button>
    </el-alert>
    <el-card shadow="naver" v-if="false">
      <div><span style="color: #99a9bf">id </span>{{commit.commit}}</div>
      <div><span style="color: #99a9bf">message </span>{{commit.commitMessage}}</div>
    </el-card>
  </div>
</template>

<script>

  import util from '@/libs/util.js'

  export default {
    name: 'ExecuteCommit',
    data () {
      return {}
    },
    props: ['commit'],
    filters: {},
    mounted () {
    },
    methods: {
      handlerOpenUrl () {
        util.open(this.commit.commitUrl)
      }
    }
  }
</script>

<style scoped>
  .label {
    color: #248bd9;
  }
</style>

