<template>
  <el-row style="margin-bottom: 5px;margin-left: 2px">
    <el-input v-model="queryParam.name" placeholder="名称" :style="searchBarHeadStyle"/>
    <el-select v-model="queryParam.grpType" filterable clearable :style="searchBarStyle"
               remote reserve-keyword placeholder="输入关键词搜组类型" :remote-method="getGrpType" :loading="loading">
      <el-option
        v-for="item in grpTypeOptions"
        :key="item.grpType"
        :label="item.name"
        :value="item.grpType">
      </el-option>
    </el-select>
    <el-button @click="fetchData" :style="searchBarStyle" :loading="searching">查询</el-button>
    <el-tooltip content="创建ansible主机配置文件" placement="bottom" effect="light" v-if="false">
      <el-button @click="createAnsibleHostsCfg" :style="searchBarStyle" :loading="creating">创建</el-button>
    </el-tooltip>
    <el-card style="margin-top: 5px" class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span><i class="fa fa-list" aria-hidden="true"></i></span>
        <el-tag style="float: right" disable-transitions>Size: {{ serverSize }}</el-tag>
      </div>
      <el-tree :data="serverTree.tree" show-checkbox ref="myServerTree" node-key="id"></el-tree>
    </el-card>
  </el-row>
</template>

<script>
  // API
  import { queryServerGroupTypePage } from '@api/server/server.group.type.js'
  import { queryUserServerTree } from '@api/user/user.js'
  import { createAnsibleHosts } from '@api/server/server.task.js'

  export default {
    data () {
      return {
        serverSize: 0,
        loading: false,
        grpTypeOptions: [],
        searching: false,
        creating: false,
        searchBarHeadStyle: {
          display: 'inline-block',
          maxWidth: '200px'
        },
        searchBarStyle: {
          marginLeft: '5px'
        },
        queryParam: {
          name: '',
          grpType: ''
        },
        serverTree: {}
      }
    },
    name: 'ServerTree',
    props: [],
    mixins: [],
    mounted () {
      this.getGrpType('')
    },
    methods: {
      getGrpType (name) {
        queryServerGroupTypePage(name, '', 1, 10)
          .then(res => {
            this.grpTypeOptions = res.body.data
          })
      },
      createAnsibleHostsCfg () {
        this.creating = true
        createAnsibleHosts().then(res => {
          if (res.success) {
            this.$message({
              message: 'ansible主机配置文件创建成功!',
              type: 'success'
            })
          } else {
            this.$message.error(res.msg)
          }
          this.creating = false
        })
      },
      getCheckedKeys (leafOnly) {
        return this.$refs.myServerTree.getCheckedKeys(leafOnly)
      },
      getUuid () {
        return this.serverTree.uuid
      },
      fetchData () {
        this.searching = true
        this.uuid = ''
        let requestBody = {
          queryName: this.queryParam.name,
          grpType: this.queryParam.grpType
        }
        queryUserServerTree(requestBody)
          .then(res => {
            this.serverTree = res.body
            this.serverSize = res.body.size || 0
            this.uuid = res.body.uuid
            this.searching = false
          })
      }
    }
  }
</script>
