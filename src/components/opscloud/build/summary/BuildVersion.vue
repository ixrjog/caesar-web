<template>
  <div>
    <el-row>
      <el-col :span="22">
        <el-tag effect="dark" type="danger" style="margin-right: 10px" v-show="isRollback !== null && isRollback">回滚版本
        </el-tag>
        <el-tooltip class="item" effect="light" :content="versionDesc === ''? '没有版本说明':versionDesc"
                    placement="top-start">
          <el-tag effect="dark" :type="buildStatus| getBuildStatusType">{{versionName}}</el-tag>
        </el-tooltip>
      </el-col>
      <el-col :span="2">
        <el-tooltip class="item" effect="light" content="版本" placement="top-start">
          <i class="fa fa-info-circle" aria-hidden="true"></i>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row>
      <el-divider></el-divider>
    </el-row>
  </div>
</template>

<script>

  import { getBuildStatusType } from '@/filters/build.js'

  export default {
    name: 'BuildVersion',
    data () {
      return {}
    },
    props: ['versionName', 'versionDesc', 'buildStatus', 'isRollback'],
    filters: {
      getBuildStatusType
    },
    mounted () {
    },
    methods: {}
  }
</script>

<style scoped>
  .label {
    color: #248bd9;
  }
</style>

