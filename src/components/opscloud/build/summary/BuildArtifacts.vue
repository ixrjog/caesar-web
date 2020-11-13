<template>
  <div>
    <el-col :span="22">
      <div class="tag-group" v-show="artifacts !== null && artifacts.length > 0">
        <div v-for="item in artifacts" :key="item.id">
          <el-tooltip class="item" effect="light" :content="item.ossUrl" placement="top-start">
            <b class="label">{{ item.artifactFileName }}</b>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="文件大小" placement="top-start">
            <span style="margin-left: 5px">{{ item.artifactFileSize }}</span>
          </el-tooltip>
        </div>
      </div>
      <span v-show="artifacts === null || artifacts.length === 0">No Artifacts</span>
    </el-col>
    <el-col :span="2">
      <el-tooltip class="item" effect="light" content="产出物" placement="top-start">
        <i class="el-icon-folder" aria-hidden="true"></i>
      </el-tooltip>
    </el-col>
  </div>
</template>

<script>

  export default {
    name: 'BuildArtifacts',
    data () {
      return {
      }
    },
    props: ['artifacts'],
    filters: {
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style scoped>
  .label {
    color: #248bd9;
  }
</style>
