<template>
  <div>
    <el-card shadow="hover">
      <div v-for="(value,key,i) in parameters" :key="key">
        <el-tag>{{key}}</el-tag>
        <el-input class="value" :value="value"></el-input>
        <el-divider v-if="i !== ( Object.keys(parameters).length -1)"></el-divider>
      </div>
    </el-card>
  </div>
</template>

<script>

  export default {
    name: 'ParamView',
    data () {
      return {}
    },
    props: ['parameters'],
    methods: {
    }
  }
</script>

<style scoped>

  .value {
    margin-top: 2px;
    margin-bottom: 5px;
    font-size: 8px
  }

</style>
