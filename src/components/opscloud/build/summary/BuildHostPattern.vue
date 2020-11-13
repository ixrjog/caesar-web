<template>
  <div>
    <el-col :span="22">
      <div v-show="hostPattern !== null">
        <b class="label">{{ hostPattern }}</b>
      </div>
      <span v-show="hostPattern === null">No HostPattern</span>
    </el-col>
    <el-col :span="2">
      <el-tooltip class="item" effect="light" content="主机分组" placement="top-start">
        <i class="fa fa-tag" aria-hidden="true"></i>
      </el-tooltip>
    </el-col>
  </div>
</template>

<script>

  export default {
    name: 'BuildHostPattern',
    data () {
      return {
      }
    },
    props: ['hostPattern'],
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

