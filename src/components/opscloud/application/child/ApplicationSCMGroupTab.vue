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
      <el-table :data="scm.groups" style="width: 100%" v-loading="scm.loading">
        <el-table-column prop="webUrl" label="webUrl" width="300"></el-table-column>
        <el-table-column prop="tags" label="标签">
          <template slot-scope="props">
            <env-tag :env="props.row.env"></env-tag>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="描述"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">`
          <template slot-scope="scope">
            <el-button type="danger" plain size="mini" @click="handlerScmGroupRowRemove(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>

  import { queryGitlabInstancePage } from '@api/gitlab/gitlab.instance.js'
  import { queryGitlabGroupPage } from '@api/gitlab/gitlab.group.js'
  import {
    queryApplicationSCMGroup,
    addApplicationSCMGroup,
    removeApplicationSCMGroup
  } from '@api/application/application.js'
  import EnvTag from '../../common/EnvTag'

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
        },
        scm: {
          loading: false,
          groups: []
        }
      }
    },
    components: {
      EnvTag
    },
    mounted () {
    },
    methods: {
      init () {
        this.gitlab.groupId = ''
        this.scm.groups = []
        this.getScmGroup()
        this.getGitlabInstance('')
      },
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
      getScmGroup () {
        if (this.applicationId === null || this.applicationId === '') return
        this.scm.loading = true
        queryApplicationSCMGroup(this.applicationId)
          .then(res => {
            if (res.success) {
              this.scm.groups = res.body
            } else {
              this.$message.error(res.msg)
            }
            this.scm.loading = false
          })
      },
      handlerScmGroupRowRemove (row) {
        removeApplicationSCMGroup(row.id)
          .then(res => {
            // 返回数据
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getScmGroup()
          })
      },
      handlerScmGroupAdd () {
        addApplicationSCMGroup(this.applicationId, this.gitlab.groupId)
          .then(res => {
            if (res.success) {
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.gitlab.groupId = ''
              this.getScmGroup()
            } else {
              this.$message.error(res.msg)
            }
          })
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
