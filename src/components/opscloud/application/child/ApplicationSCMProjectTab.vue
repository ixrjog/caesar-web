<template>
  <div>
    <el-row>
      <el-select v-model="queryParam.instanceId" filterable clearable class="select"
                 @change="handlerSelGitlabInstance"
                 remote reserve-keyword placeholder="搜索实例" :remote-method="getGitlabInstance">
        <el-option
          v-for="item in gitlab.instanceOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="gitlab.projectId" filterable clearable class="select"
                 :disabled="queryParam.instanceId === ''"
                 remote reserve-keyword placeholder="搜索项目" :remote-method="getProject">
        <el-option
          v-for="item in gitlab.projectOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          <span style="float: left;margin-right: 15px">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.sshUrl }}</span>
        </el-option>
      </el-select>
      <el-button size="mini" type="primary" :disabled="gitlab.projectId === ''" @click="handlerScmMemberAdd">添加
      </el-button>
    </el-row>
    <el-row>
      <el-table :data="scm.members" style="width: 100%" v-loading="scm.loading">
        <el-table-column prop="scmType" label="SCM类型" width="100"></el-table-column>
        <el-table-column prop="scmSshUrl" label="sshUrl" width="300"></el-table-column>
        <el-table-column prop="tags" label="标签">
          <template slot-scope="props">
            <env-tag :env="props.row.env"></env-tag>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="描述"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">`
          <template slot-scope="scope">
            <el-button type="danger" plain size="mini" @click="handlerScmMemberRowRemove(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>

  import EnvTag from '../../common/EnvTag'

  import { queryGitlabInstancePage } from '@api/gitlab/gitlab.instance.js'
  import { queryGitlabProjectPage } from '@api/gitlab/gitlab.project.js'
  import {
    queryApplicationSCMMember,
    addApplicationSCMMember, removeApplicationSCMMember
  } from '@api/application/application.js'

  export default {
    name: 'ApplicationSCMProjectTab',
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
          projectId: '',
          instanceOptions: [],
          projectOptions: []
        },
        scm: {
          loading: false,
          members: []
        }
      }
    },
    components: {
      EnvTag
    },
    mounted () {
      this.getScmMember()
      this.getGitlabInstance('')
    },
    methods: {
      init () {
        this.gitlab.projectId = ''
        this.scm.members = []
        this.getScmMember()
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
      handlerSelGitlabInstance () {
        this.getProject('')
      },
      getProject (queryName) {
        let requestBody = {
          'instanceId': this.queryParam.instanceId,
          'queryName': queryName,
          'extend': 1,
          'page': 1,
          'length': 10
        }
        queryGitlabProjectPage(requestBody)
          .then(res => {
            this.gitlab.projectOptions = res.body.data
          })
      },
      handlerScmMemberRowRemove (row) {
        removeApplicationSCMMember(row.id)
          .then(res => {
            // 返回数据
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getScmMember()
          })
      },
      getScmMember () {
        if (this.applicationId === null || this.applicationId === '') return
        this.scm.loading = true
        queryApplicationSCMMember(this.applicationId)
          .then(res => {
            if (res.success) {
              this.scm.members = res.body
            } else {
              this.$message.error(res.msg)
            }
            this.scm.loading = false
          })
      },
      handlerScmMemberAdd () {
        addApplicationSCMMember(this.applicationId, this.gitlab.projectId)
          .then(res => {
            if (res.success) {
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.gitlab.projectId = ''
              this.getScmMember()
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
