<template>
  <div>
    <el-row>
      <el-col :span="22">
        <div v-show="servers.length > 0">
          <div v-for="item in servers" :key="item.id">
            <b class="label">{{ item.serverName }}-{{ item.serialNumber }}</b>
            <span style="margin-left: 5px">{{ item.privateIp }}</span>
          </div>
        </div>
        <span v-show="servers.length === 0">No Servers</span>
      </el-col>
      <el-col :span="2">
        <el-tooltip class="item" effect="light" content="部署服务器" placement="top-start">
          <i class="fa fa-server" aria-hidden="true"></i>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row>
      <el-divider></el-divider>
    </el-row>
  </div>
</template>

<script>

  export default {
    name: 'BuildServers',
    data () {
      return {
      }
    },
    props: ['servers'],
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

