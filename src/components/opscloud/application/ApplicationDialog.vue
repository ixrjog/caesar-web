<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="应用配置" name="application">
        <el-form :model="application">
          <el-form-item label="应用名称" :label-width="labelWidth" :required="true">
            <el-input v-model="application.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="应用key" :label-width="labelWidth" :required="true">
            <el-input v-model="application.applicationKey" placeholder="请输入内容"
                      :disabled="!formStatus.operationType"></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model="application.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="SCM配置" name="scm" v-if="application.id !== ''">
        <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
          <el-select v-model="queryParam.instanceId" filterable clearable class="select" @change="handlerSelInstance"
                     remote reserve-keyword placeholder="搜索实例" :remote-method="getInstance">
            <el-option
              v-for="item in instanceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="projectId" filterable clearable class="select" :disabled="queryParam.instanceId === ''"
                     remote reserve-keyword placeholder="搜索项目" :remote-method="getProject">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left;margin-right: 15px">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.sshUrl }}</span>
            </el-option>
          </el-select>
          <el-button size="mini" type="primary" :disabled="projectId === ''" @click="handlerScmMemberAdd">添加</el-button>
        </el-row>
        <el-row :gutter="24" style="margin-bottom: 5px;margin-left: 5px">
          <el-table :data="scmMembers" style="width: 100%" v-loading="scmMemberLoading">
            <el-table-column prop="scmType" label="SCM类型" width="100"></el-table-column>
            <el-table-column prop="scmSshUrl" label="sshUrl" width="300"></el-table-column>
            <el-table-column prop="tags" label="标签">
              <template slot-scope="props">
                <div class="tag-group">
              <span v-for="item in props.row.tags" :key="item.id">
                <el-tooltip class="item" effect="light" :content="item.comment" placement="top-start">
                  <el-tag style="margin-left: 5px" :style="{ color: item.color }">{{ item.tagKey }}</el-tag>
                </el-tooltip>
              </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="comment" label="描述"></el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
              <template slot-scope="scope">
                <el-button type="danger" plain size="mini" @click="handlerScmMemberRowRemove(scope.row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { queryGitlabInstancePage } from '@api/gitlab/gitlab.instance.js'
  import { queryGitlabProjectPage } from '@api/gitlab/gitlab.project.js'

  import {
    addApplication, updateApplication, queryApplicationSCMMember,
    addApplicationSCMMember, removeApplicationSCMMember
  } from '@api/application/application.js'

  export default {
    data () {
      return {
        activeName: 'application',
        application: {},
        labelWidth: '150px',
        options: {
          stripe: true
        },
        serverLoading: false,
        serverOptions: [],
        scmMembers: [],
        scmMemberLoading: false,
        instanceOptions: [],
        queryParam: {
          instanceId: '',
          queryName: ''
        },
        projectId: '',
        projectOptions: []
      }
    },
    name: 'ApplicationDialog',
    props: ['formStatus'],
    components: {},
    mounted () {
    },
    methods: {
      initData (application) {
        this.application = application
        if (application.id !== '') {
          this.getScmMember()
          this.getInstance('')
        }
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      getScmMember () {
        this.scmMemberLoading = true
        queryApplicationSCMMember(this.application.id)
          .then(res => {
            if (res.success) {
              this.scmMembers = res.body
            } else {
              this.$message.error(res.msg)
            }
            this.scmMemberLoading = false
          })
      },
      getInstance (queryName) {
        let requestBody = {
          'queryName': queryName,
          'extend': 0,
          'page': 1,
          'length': 10
        }
        queryGitlabInstancePage(requestBody)
          .then(res => {
            this.instanceOptions = res.body.data
          })
      },
      handlerSelInstance () {
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
            this.projectOptions = res.body.data
          })
      },
      handlerScmMemberAdd () {
        addApplicationSCMMember(this.application.id, this.projectId)
          .then(res => {
            if (res.success) {
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.projectId = ''
              this.getScmMember()
            } else {
              this.$message.error(res.msg)
            }
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
      handlerSave () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.application)
          if (this.formStatus.operationType) {
            addApplication(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeDialog')
              })
          } else {
            updateApplication(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeDialog')
              })
          }
        }, 600)
      }
    }
  }
</script>
