<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" :before-close="closeDialog">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="任务配置" name="job">
        <el-form :model="application">
          <el-form-item label="应用名称" :label-width="labelWidth">
            <el-input v-model="application.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="应用key" :label-width="labelWidth">
            <el-input v-model="application.applicationKey" disabled></el-input>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <el-form :model="cdJob">
          <el-form-item label="任务名称" :label-width="labelWidth" required>
            <el-input v-model="cdJob.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="任务key" :label-width="labelWidth" required>
            <el-input v-model="cdJob.jobKey" placeholder="请输入内容(只允许使用a-zA-Z、0-9、-)"
                      :disabled="!formStatus.operationType"></el-input>
          </el-form-item>
          <el-form-item label="任务类型" :label-width="labelWidth" required>
            <el-select v-model.trim="cdJob.jobType" filterable clearable
                       remote reserve-keyword>
              <el-option
                v-for="item in jobTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="环境" :label-width="labelWidth" required v-if="false">
            <el-select v-model.trim="cdJob.envType" filterable clearable
                       remote reserve-keyword>
              <el-option
                v-for="item in envTypeOptions"
                :key="item.envType"
                :label="item.envName"
                :value="item.envType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model.trim="cdJob.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="模版配置" name="template">
        <el-form :model="cdJob">
          <el-form-item label="任务模版" :label-width="labelWidth" required>
            <el-select v-model="cdJob.jobTpl" filterable clearable placeholder="请选择" remote value-key="id"
                       @change="handlerSelTpl"
                       :remote-method="getJobTpl" style="width: 500px">
              <el-option v-for="item in jobTplOptions" :key="item.id" :label="item.name" :value="item">
              </el-option>
            </el-select>
            <el-tooltip class="item" effect="light" content="编辑模版参数" placement="top">
              <el-button size="mini" type="primary" style="margin-left: 5px" @click="handlerEditParameters">
                <i class="fa fa-edit" aria-hidden="true"></i></el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="参数详情" :label-width="labelWidth" v-if="!editing">
            <parameters-view :parameters="cdJob.parameters"></parameters-view>
          </el-form-item>

          <el-form-item label="模版参数" :label-width="labelWidth" required v-if="editing">
            <editor v-model="cdJob.parameterYaml" @init="editorInit" lang="yaml" theme="chrome"
                    v-if="JSON.stringify(cdJob) != '{}'"
                    width="100%" height="400"></editor>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-divider></el-divider>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="closeDialog">取消</el-button>
      <el-button size="mini" type="primary" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

  // Component
  import ParametersView from '@/components/opscloud/application/param/ParametersView'

  import { queryEnvPage } from '@api/env/env.js'
  import { queryJobTplPage } from '@api/jenkins/jenkins.tpl.js'
  import { addCdJob, updateCdJob } from '@api/application/cd.job.js'

  const jobTypeOptions = [{
    value: 'ANDROID_REINFORCE',
    label: 'AndroidReinforce'
  }, {
    value: 'JAVA_DEPLOYMENT',
    label: 'JavaDeployment'
  }]

  export default {
    data () {
      return {
        activeName: 'job',
        application: {},
        cdJob: {},
        jobTpl: {},
        labelWidth: '150px',
        options: {
          stripe: true
        },
        queryParam: {
          instanceId: '',
          queryName: ''
        },
        jobTypeOptions: jobTypeOptions,
        envTypeOptions: [],
        jobTplLoading: false,
        jobTplOptions: [],
        editing: false
      }
    },
    name: 'CdJobDialog',
    props: ['formStatus'],
    components: {
      editor: require('vue2-ace-editor'),
      ParametersView
    },
    mounted () {
      this.getEnvType()
    },
    beforeDestroy () {
    },
    methods: {
      editorInit: function () {
        // language extension prerequsite...
        require('brace/ext/language_tools')
        // language
        require('brace/mode/yaml')
        require('brace/mode/xml')
        require('brace/theme/chrome')
        // snippet
        require('brace/snippets/yaml')
        require('brace/snippets/xml')
      },
      closeDialog () {
        this.cdJob = {}
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      initData (application, cdJob) {
        this.cdJob = {}
        this.jobTplOptions = []
        this.activeName = 'job'
        this.application = application
        this.cdJob = cdJob
        if (this.cdJob.jobTpl === null) {
          this.getJobTpl('')
        } else {
          this.jobTplOptions.push(this.cdJob.jobTpl)
        }
        if (!this.formStatus.operationType) {
          this.editing = false
        } else {
          this.editing = true
        }
      },
      getJobTpl (queryName) {
        this.jobTplLoading = true
        let requestBody = {
          'queryName': queryName,
          'extend': 1,
          'page': 1,
          'length': 10
        }
        queryJobTplPage(requestBody)
          .then(res => {
            this.jobTplOptions = res.body.data
            this.jobTplLoading = false
          })
      },
      handlerEditParameters () {
        this.editing = !this.editing
      },
      handlerSelTpl () {
        if (this.cdJob.parameterYaml === '') {
          this.cdJob.parameterYaml = this.cdJob.jobTpl.parameterYaml
        }
      },
      getEnvType () {
        queryEnvPage('', '', 1, 20)
          .then(res => {
            this.envTypeOptions = res.body.data
          })
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      handlerSave () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.cdJob)
          if (this.formStatus.operationType) {
            addCdJob(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.closeDialog()
              })
          } else {
            updateCdJob(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.closeDialog()
              })
          }
        }, 600)
      }
    }
  }
</script>
