<template>
  <div>
    <el-col :span="22">
      <div class="tag-group" v-show="changes.length !== null && changes.length > 0">
        <div v-for="item in changes" :key="item.id">
          <el-tooltip class="item" effect="light" :content="item.commitId" placement="top-start">
            <span class="label">{{ item.shortCommitId }}</span>
<!--            <el-tag type="primary">{{ item.shortCommitId }}</el-tag>-->
          </el-tooltip>
          <span style="margin-left: 5px">{{ item.commitMsg }}</span>
        </div>
      </div>
      <span v-show="changes === null || changes.length === 0">No Changes</span>
    </el-col>
    <el-col :span="2">
      <el-tooltip class="item" effect="light" content="变更详情" placement="top-start">
        <i class="fa fa-comment-o" aria-hidden="true"></i>
      </el-tooltip>
    </el-col>
  </div>
</template>

<script>

  export default {
    name: 'BuildChanges',
    data () {
      return {
      }
    },
    props: ['changes'],
    filters: {
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style>
  .label {
    color: #99a9bf;
  }
</style>
