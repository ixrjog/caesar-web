<template>
  <div>
    <el-row>
      <el-select v-model="queryParam.instanceId" filterable clearable class="select"
                 @change="handlerSelInstance"
                 remote reserve-keyword placeholder="搜索实例" :remote-method="getGitlabInstance">
        <el-option
          v-for="item in gitlab.instanceOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="gitlab.groupId" filterable clearable class="select"
                 :disabled="queryParam.instanceId === ''"
                 remote reserve-keyword placeholder="搜索群组" :remote-method="getGroup">
        <el-option
          v-for="item in gitlab.groupOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          <span style="float: left;margin-right: 15px">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.webUrl }}</span>
        </el-option>
      </el-select>
      <el-button size="mini" type="primary" :disabled="gitlab.groupId === ''" @click="handlerScmGroupAdd">添加</el-button>
    </el-row>
    <el-row>
    </el-row>
  </div>
</template>

<script>

  import { queryGitlabInstancePage } from '@api/gitlab/gitlab.instance.js'
  import { queryGitlabGroupPage } from '@api/gitlab/gitlab.group.js'

  export default {
    name: 'ApplicationSCMGroupTab',
    props: ['applicationId'],
    data () {
      return {
        queryParam: {
          instanceId: '',
          queryName: '',
          extend: 1,
          page: 1,
          length: 10
        },
        gitlab: {
          groupId: '',
          instanceOptions: [],
          groupOptions: []
        }
      }
    },
    mounted () {
      this.getGitlabInstance('')
    },
    methods: {
      getGitlabInstance (queryName) {
        let requestBody = {
          'queryName': queryName,
          'extend': 0,
          'page': 1,
          'length': 10
        }
        queryGitlabInstancePage(requestBody)
          .then(res => {
            this.gitlab.instanceOptions = res.body.data
          })
      },
      handlerSelInstance () {
        this.getGroup('')
      },
      getGroup (queryName) {
        let requestBody = Object.assign({}, this.queryParam)
        requestBody.queryName = queryName

        queryGitlabGroupPage(requestBody)
          .then(res => {
            this.gitlab.groupOptions = res.body.data
          })
      },
      handlerScmGroupAdd () {
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 5px;
    margin-left: 0px;
  }

  .select {
    margin-left: 5px;
  }

</style>
