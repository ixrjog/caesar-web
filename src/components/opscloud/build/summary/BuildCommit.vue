<template>
  <div>
    <el-row>
      <el-col :span="22">
        <el-button type="text" style="margin-left: 10px; padding: 3px 0" @click="handlerOpenUrl()">{{commit.commit !== ''?commit.commit: '缺省'}}
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-tooltip class="item" effect="light" content="commit" placement="top-start">
          <i class="fa fa-tag" aria-hidden="true"></i>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row>
      <el-divider></el-divider>
    </el-row>
  </div>
</template>

<script>

  import util from '@/libs/util.js'

  export default {
    name: 'BuildCommit',
    data () {
      return {}
    },
    props: ['commit'],
    filters: {},
    mounted () {
    },
    methods: {
      handlerOpenUrl(){
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

