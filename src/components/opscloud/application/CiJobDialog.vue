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
        <el-form :model="ciJob">
          <el-form-item label="任务名称" :label-width="labelWidth" required>
            <el-input v-model="ciJob.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="任务key" :label-width="labelWidth" required>
            <el-input v-model="ciJob.jobKey" placeholder="请输入内容(只允许使用a-zA-Z、0-9、-)"
                      :disabled="!formStatus.operationType"></el-input>
          </el-form-item>
          <el-form-item label="任务类型" :label-width="labelWidth" required>
            <el-select v-model.trim="ciJob.jobType" filterable clearable
                       remote reserve-keyword>
              <el-option v-for="item in jobTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="代码仓库" :label-width="labelWidth" required>
            <!--            :disabled="!formStatus.operationType"-->
            <el-select v-model.trim="ciJob.scmMemberId" placeholder="请选择" style="width: 500px"
                       @change="handlerSelScm">
              <el-option v-for="item in application.scmMembers" :key="item.id" :label="item.scmSshUrl" :value="item.id">
              </el-option>
            </el-select>
            <el-checkbox v-model="ciJob.enableTag" style="margin-left: 20px" @change="handlerSelScm">
              <span>允许标签(tag)构建</span>
            </el-checkbox>
          </el-form-item>
          <el-form-item label="首选分支" :label-width="labelWidth" required>
            <el-select v-model.trim="ciJob.branch" placeholder="请选择" style="width: 500px"
                       :disabled="branchOptions === '' || branchOptions.length === 0">
              <el-option-group v-for="group in branchOptions" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-option-group>
            </el-select>
            <el-tooltip class="item" effect="light" content="刷新分支" placement="top">
              <el-button size="mini" type="primary" style="margin-left: 5px" @click="handlerSelScm"
                         :disabled="ciJob.scmMemberId === ''"
                         :loading="branchesLoading"><i class="fa fa-refresh" aria-hidden="true"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="创建默认发布分支" placement="top">
              <el-button size="mini" type="primary" style="margin-left: 5px" @click="handlerCreateBranch"
                         :disabled="ciJob.scmMemberId === ''"
                         :loading="branchesLoading"><i class="fa fa-git" aria-hidden="true"></i></el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="任务环境" :label-width="labelWidth" required>
            <el-select v-model.trim="ciJob.envType" filterable clearable
                       remote reserve-keyword>
              <el-option v-for="item in envTypeOptions" :key="item.envType" :label="item.envName" :value="item.envType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="质量管理" :label-width="labelWidth" required>
            <el-checkbox v-model="ciJob.enableSonar">启用SonarQube</el-checkbox>
          </el-form-item>
          <el-form-item label="任务链接" :label-width="labelWidth">
            <el-input v-model="ciJob.href" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="隐藏任务" :label-width="labelWidth" required>
            <el-select v-model.trim="ciJob.hide" placeholder="选择类型">
              <el-option v-for="item in hideOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model.trim="ciJob.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="存储配置" name="storage">
        <el-form :model="ciJob">
          <el-form-item label="对象存储(oss)" :label-width="labelWidth">
            <el-select v-model.trim="ciJob.ossBucketId" filterable clearable placeholder="请选择" remote
                       :remote-method="getOSSBucket" style="width: 500px" :loading="bucketLoading">
              <el-option v-for="item in bucketOptions" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="通知配置" name="dingtalk">
        <el-form :model="ciJob">
          <el-form-item label="钉钉" :label-width="labelWidth">
            <el-select v-model.trim="ciJob.dingtalkId" filterable clearable placeholder="请选择" remote
                       :remote-method="getDingtalk" style="width: 500px">
              <el-option
                v-for="item in dingtalkOptions" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通知类型" :label-width="labelWidth">
            <el-select v-model.trim="ciJob.atAll" placeholder="选择类型">
              <el-option
                v-for="item in atAllOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="模版配置" name="template">
        <el-form :model="ciJob">
          <el-form-item label="克隆模版" :label-width="labelWidth">
            <el-select v-model.trim="cloneCiJob" filterable clearable placeholder="请选择当前应用下的任务" remote value-key="id"
                       :remote-method="getCiJob" style="width: 500px">
              <el-option v-for="item in ciJobOptions" :key="item.id" :label="item.name" :value="item">
              </el-option>
            </el-select>
            <el-tooltip class="item" effect="light" content="克隆选中任务模版" placement="top">
              <el-button size="mini" type="primary" style="margin-left: 5px" @click="handlerCloneJobTpl"
                         :disabled="cloneCiJob === ''">
                <i class="fa fa-clone" aria-hidden="true"></i></el-button>
            </el-tooltip>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="任务模版" :label-width="labelWidth" required>
            <el-select v-model="ciJob.jobTpl" filterable clearable placeholder="请选择模版" remote value-key="id"
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
            <parameters-view :parameters="ciJob.parameters"></parameters-view>
          </el-form-item>

          <el-form-item label="模版参数" :label-width="labelWidth" required v-if="editing">
            <editor v-model="ciJob.parameterYaml" @init="editorInit" lang="yaml" theme="chrome"
                    v-if="JSON.stringify(ciJob) != '{}'"
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
  import { queryApplicationSCMMemberBranch, createApplicationSCMMemberBranch } from '@api/application/application.js'
  import { queryDingtalkPage } from '@api/dingtalk/dingtalk.js'
  import { queryJobTplPage } from '@api/jenkins/jenkins.tpl.js'
  import { queryBucketPage } from '@api/aliyun/aliyun.oss.bucket.js'

  import { addCiJob, updateCiJob, queryCiJobPage } from '@api/application/ci.job.js'

  const enableTagOptions = [{
    value: false,
    label: '否'
  }, {
    value: true,
    label: '是'
  }]

  const atAllOptions = [{
    value: false,
    label: '自己'
  }, {
    value: true,
    label: '所有人'
  }]

  const hideOptions = [{
    value: false,
    label: '否'
  }, {
    value: true,
    label: '是'
  }]

  const jobTypeOptions = [{
    value: 'HTML5',
    label: 'HTML5'
  }, {
    value: 'IOS',
    label: 'iOS'
  }, {
    value: 'ANDROID',
    label: 'Android'
  }, {
    value: 'JAVA',
    label: 'Java'
  }, {
    value: 'PYTHON',
    label: 'Python'
  }]

  export default {
    data () {
      return {
        activeName: 'job',
        application: {},
        ciJob: {},
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
        enableTagOptions: enableTagOptions,
        atAllOptions: atAllOptions,
        hideOptions: hideOptions,
        branchesLoading: false,
        branchOptions: [],
        dingtalkOptions: [],
        jobTplLoading: false,
        jobTplOptions: [],
        bucketOptions: [],
        bucketLoading: false,
        ciJobOptions: [],
        cloneCiJob: '',
        editing: false
      }
    },
    name: 'CiJobDialog',
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
        this.ciJob = {}
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      initData (application, ciJob) {
        this.branchOptions = []
        this.dingtalkOptions = []
        this.jobTplOptions = []
        this.bucketOptions = []
        this.activeName = 'job'
        this.application = application
        this.ciJob = ciJob
        if (!this.formStatus.operationType) {
          this.getBranches()
          this.editing = false
        } else {
          this.editing = true
        }
        if (this.ciJob.dingtalk === null) {
          this.getDingtalk('')
        } else {
          this.dingtalkOptions.push(this.ciJob.dingtalk)
        }
        if (this.ciJob.jobTpl === null) {
          this.getJobTpl('')
          this.getCiJob('') // clone
        } else {
          this.jobTplOptions.push(this.ciJob.jobTpl)
        }
        if (this.ciJob.bucket === null) {
          this.getOSSBucket('')
        } else {
          this.bucketOptions.push(this.ciJob.bucket)
        }
      },
      getCiJob (queryName) {
        let requestBody = {
          'queryName': queryName,
          'applicationId': this.application.id,
          'extend': 1,
          'page': 1,
          'length': 10
        }
        queryCiJobPage(requestBody)
          .then(res => {
            this.ciJobOptions = res.body.data
          })
      },
      handlerEditParameters () {
        this.editing = !this.editing
      },
      handlerCloneJobTpl () {
        this.jobTplOptions = []
        this.jobTplOptions.push(this.cloneCiJob.jobTpl)
        this.ciJob.jobTpl = this.cloneCiJob.jobTpl
        this.ciJob.parameterYaml = this.cloneCiJob.parameterYaml
      },
      handlerSelTpl () {
        if (this.ciJob.parameterYaml === '') {
          this.ciJob.parameterYaml = this.ciJob.jobTpl.parameterYaml
        }
      },
      getOSSBucket (queryName) {
        this.bucketLoading = true
        let requestBody = {
          'queryName': queryName,
          'isActive': true,
          'extend': 1,
          'page': 1,
          'length': 10
        }
        queryBucketPage(requestBody)
          .then(res => {
            this.bucketOptions = res.body.data
            this.bucketLoading = false
          })
      },
      getDingtalk (queryName) {
        let requestBody = {
          'queryName': queryName,
          'extend': 1,
          'page': 1,
          'length': 10
        }
        queryDingtalkPage(requestBody)
          .then(res => {
            this.dingtalkOptions = res.body.data
          })
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
      handlerSelScm () {
        if (this.ciJob.scmMemberId !== '') {
          this.getBranches()
        }
      },
      handlerCreateBranch () {
        if (this.ciJob.scmMemberId !== '') {
          this.createBranches()
        }
      },
      createBranches () {
        this.branchesLoading = true
        let requestBody = {
          'scmMemberId': this.ciJob.scmMemberId
        }
        createApplicationSCMMemberBranch(requestBody)
          .then(res => {
            this.getBranches()
          })
      },
      getBranches () {
        this.branchesLoading = true
        let requestBody = {
          'ciJobId': this.ciJob.id,
          'scmMemberId': this.ciJob.scmMemberId,
          'enableTag': this.ciJob.enableTag
        }
        queryApplicationSCMMemberBranch(requestBody)
          .then(res => {
            this.branchOptions = res.body.options
            this.branchesLoading = false
          })
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
          let requestBody = Object.assign({}, this.ciJob)
          if (this.formStatus.operationType) {
            addCiJob(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.closeDialog()
              })
          } else {
            updateCiJob(requestBody)
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
