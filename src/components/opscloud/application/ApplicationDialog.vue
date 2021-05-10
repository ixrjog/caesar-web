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
                      :disabled="!formStatus.operationType">
              <template slot="append">
                <el-button size="mini" type="primary" @click="handlerBuildKey">
                  <i class="fa fa-arrow-up" aria-hidden="true"></i>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="GitFlow" :label-width="labelWidth">
            <el-checkbox v-model="application.enableGitflow">启用</el-checkbox>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model="application.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="SCM项目配置" name="scm" v-if="application.id !== ''">
        <application-scm-project-tab ref="scmMemberTab" :application-id="application.id"></application-scm-project-tab>
      </el-tab-pane>
      <el-tab-pane label="SCM群组配置" name="scmGroup" v-if="application.id !== ''">
        <application-scm-group-tab ref="scmGroupTab" :application-id="application.id"></application-scm-group-tab>
      </el-tab-pane>
      <el-tab-pane label="服务器组(可选)" name="serverGroup" v-if="application.id !== ''">
        <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
          <el-select v-model="sourceType" filterable clearable class="select"
                     reserve-keyword>
            <el-option
              v-for="item in sourceTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="serverGroup" filterable clearable class="select"
                     value-key="id"
                     remote reserve-keyword placeholder="搜索服务器组" :remote-method="getServerGroup">
            <el-option
              v-for="item in serverGroupOptions"
              :key="item.id"
              :label="item.name"
              :value="item">
              <span style="float: left;margin-right: 15px">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.comment }}</span>
            </el-option>
          </el-select>
          <el-button size="mini" type="primary" :disabled="serverGroup === ''" @click="handlerServerGroupAdd">添加
          </el-button>
        </el-row>
        <el-row :gutter="24" style="margin-bottom: 5px;margin-left: 5px">
          <el-table :data="serverGroups" style="width: 100%" v-loading="applicationServerGroupLoading">
            <el-table-column prop="source" label="数据源" width="100"></el-table-column>
            <el-table-column prop="serverGroupName" label="服务器组名称" width="300"></el-table-column>
            <el-table-column prop="comment" label="描述"></el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="danger" plain size="mini" @click="handlerServerGroupRowRemove(scope.row)">移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="工作引擎" name="engine" v-if="application.id !== ''">
        <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
          <el-select v-model="application.engineType" clearable placeholder="引擎类型" class="select"
                     @change="handlerSelEngineType">
            <el-option
              v-for="item in engineTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="jenkinsInstanceId" filterable clearable class="select"
                     v-show="application.engineType === 1"
                     remote reserve-keyword placeholder="搜索实例" :remote-method="getJenkinsInstance">
            <el-option
              v-for="item in jenkinsInstanceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button size="mini" type="primary" :disabled="jenkinsInstanceId === ''" @click="handlerEngineAdd">添加
          </el-button>
        </el-row>
        <el-row :gutter="24" style="margin-bottom: 5px;margin-left: 5px" v-show="application.engineType === 1">
          <el-table :data="engines" v-loading="engineLoading">
            <el-table-column prop="instance" label="实例名称">
              <template slot-scope="scope">
                <span>{{scope.row.instance.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="instance" label="描述">
              <template slot-scope="scope">
                <span>{{scope.row.instance.comment}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="danger" plain size="mini" @click="handlerEngineRowRemove(scope.row)">移除</el-button>
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
  import { queryJenkinsInstancePage } from '@api/jenkins/jenkins.instance.js'

  import {
    addApplication, updateApplication,
    queryApplicationEngine, addApplicationEngine, removeApplicationEngine,
    queryServerGroupPage, queryApplicationServerGroup, addApplicationServerGroup, removeApplicationServerGroup
  } from '@api/application/application.js'

  import ApplicationScmProjectTab from './child/ApplicationSCMProjectTab'
  import ApplicationScmGroupTab from './child/ApplicationSCMGroupTab'

  const engineTypeOptions = [{
    value: 0,
    label: '所有引擎'
  }, {
    value: 1,
    label: '指定引擎'
  }]

  const sourceTypeOptions = [{
    value: 'LOCAL',
    label: '本地数据源'
  }, {
    value: 'OPSCLOUD',
    label: 'OPSCLOUD'
  }]

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
        queryJenkinsParam: {
          queryName: ''
        },
        // serverGroup
        sourceType: 'OPSCLOUD',
        sourceTypeOptions: sourceTypeOptions,
        serverGroup: '',
        serverGroupOptions: [],
        applicationServerGroupLoading: false,
        serverGroups: [],
        // engine
        jenkinsInstanceId: '',
        engineLoading: false,
        engines: [],
        engineTypeOptions: engineTypeOptions,
        jenkinsInstanceOptions: []
      }
    },
    name: 'ApplicationDialog',
    props: ['formStatus'],
    components: {
      ApplicationScmProjectTab,
      ApplicationScmGroupTab
    },
    mounted () {
    },
    methods: {
      initData (application) {
        this.application = application
        if (this.application.id !== '') {
          if (this.application.engineType === 1) {
            this.getEngine()
          }
          if (application.serverGroups !== null && application.serverGroups.length > 0) {
            this.serverGroups = application.serverGroups
          }
        }
        this.$nextTick(() => {
          this.$refs.scmGroupTab.init()
          this.$refs.scmMemberTab.init()
        })
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      getServerGroup (queryName) {
        let requestBody = {
          'source': this.sourceType,
          'name': queryName,
          'grpType': '',
          'page': 1,
          'length': 10
        }
        queryServerGroupPage(requestBody)
          .then(res => {
            this.serverGroupOptions = res.body.data
          })
      },
      getEngine () {
        if (this.application.engineType === 0) {
          this.engines = []
        } else {
          this.engineLoading = true
          queryApplicationEngine(this.application.id)
            .then(res => {
              if (res.success) {
                this.engines = res.body
              } else {
                this.$message.error(res.msg)
              }
              this.engineLoading = false
            })
        }
      },
      getApplicationServerGroup () {
        this.applicationServerGroupLoading = true
        queryApplicationServerGroup(this.application.id)
          .then(res => {
            if (res.success) {
              this.serverGroups = res.body
            } else {
              this.$message.error(res.msg)
            }
            this.applicationServerGroupLoading = false
          })
      },
      getJenkinsInstance (queryName) {
        this.loading = true
        let requestBody = {
          'queryName': queryName,
          'extend': 1,
          'page': 1,
          'length': 10
        }
        queryJenkinsInstancePage(requestBody)
          .then(res => {
            this.jenkinsInstanceOptions = res.body.data
          })
      },
      handlerBuildKey () {
        this.application.applicationKey = this.application.name.toUpperCase()
      },
      handlerSelEngineType () {
        if (this.application.engineType === 1) {
          this.getJenkinsInstance('')
        }
      },
      handlerEngineAdd () {
        addApplicationEngine(this.application.id, this.jenkinsInstanceId)
          .then(res => {
            if (res.success) {
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.jenkinsInstanceId = ''
              this.getEngine()
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      handlerServerGroupAdd () {
        let requestBody = {
          'id': '',
          'applicationId': this.application.id,
          'serverGroupName': this.serverGroup.name,
          'serverGroupId': this.serverGroup.id,
          'comment': this.serverGroup.comment,
          'source': this.sourceType
        }
        addApplicationServerGroup(requestBody)
          .then(res => {
            if (res.success) {
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.serverGroup = ''
              this.getApplicationServerGroup()
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      handlerEngineRowRemove (row) {
        removeApplicationEngine(row.id)
          .then(res => {
            // 返回数据
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getEngine()
          })
      },
      handlerServerGroupRowRemove (row) {
        removeApplicationServerGroup(row.id)
          .then(res => {
            // 返回数据
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getApplicationServerGroup()
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

<style>

  .input {
    display: inline-block;
    max-width: 200px;
    margin-left: 10px;
  }

  .select {
    margin-left: 5px;
  }

  .button {
    margin-left: 5px;
  }
</style>
