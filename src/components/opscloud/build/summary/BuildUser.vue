<template>
  <div>
    <el-col :span="22">
      <el-tooltip class="item" effect="light" :content="user.email" placement="top-start">
        <b class="label">{{user.displayName}}</b>
      </el-tooltip>
      <span style="margin-left: 5px">{{ago}}</span>
    </el-col>
    <el-col :span="2">
      <el-tooltip class="item" effect="light" content="执行人" placement="top-start">
        <i class="el-icon-user" aria-hidden="true"></i>
      </el-tooltip>
    </el-col>
  </div>
</template>

<script>

  export default {
    name: 'BuildOperation',
    data () {
      return {
      }
    },
    props: ['user','ago'],
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

