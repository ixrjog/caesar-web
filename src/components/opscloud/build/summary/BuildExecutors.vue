<template>
  <div>
    <el-col :span="22">
      <div class="tag-group" v-show="executors.length !== null && executors.length > 0">
        <div v-for="item in executors" :key="item.id">
          <b class="label">{{ item.nodeName }}</b>
          <span style="margin-left: 5px" v-if="item.privateIp !== null && item.privateIp !== ''">{{ item.privateIp}}</span>
        </div>
      </div>
      <span v-show="executors.length === null || executors.length === 0">No Executors</span>
    </el-col>
    <el-col :span="2">
      <el-tooltip class="item" effect="light" content="工作节点" placement="top-start">
        <i class="fa fa-television" aria-hidden="true"></i>
      </el-tooltip>
    </el-col>
  </div>
</template>

<script>

  export default {
    name: 'BuildExecutors',
    data () {
      return {
      }
    },
    props: ['executors'],
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
