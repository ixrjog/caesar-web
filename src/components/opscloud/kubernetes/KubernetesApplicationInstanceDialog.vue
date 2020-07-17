<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-tabs v-model="activeName">
      <el-tab-pane label="实例配置" name="instance">
        <el-form :model="kubernetesApplicationInstance">
          <el-form-item label="应用名称" :label-width="labelWidth" :required="true">
            <el-input v-model="kubernetesApplication.name" placeholder="请输入内容" readonly></el-input>
          </el-form-item>
          <el-form-item label="环境" :label-width="labelWidth" :required="true">
            <el-select v-model="kubernetesApplicationInstance.envType" clearable placeholder="环境"
                       @change="handlerSelEnvType">
              <el-option
                v-for="item in envTypeOptions"
                :key="item.id"
                :label="item.envName"
                :value="item.envType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="环境标签" :label-width="labelWidth" :required="true">
            <el-select v-model="kubernetesApplicationInstance.envLabel" clearable placeholder="环境标签"
                       :disabled="kubernetesApplicationInstance.envType == ''">
              <el-option
                v-for="item in envLabelOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model="kubernetesApplicationInstance.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="变量配置" name="variable" :disabled="kubernetesApplicationInstance.id === ''">
        <el-form :model="kubernetesApplicationInstance">
          <el-form-item label="variable" :label-width="labelWidth">
            <editor v-model="kubernetesApplicationInstance.templateVariable" @init="editorInit" lang="yaml"
                    theme="chrome"
                    width="100%" height="300"></editor>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Deployment配置" name="deployment" :disabled="kubernetesApplicationInstance.id === ''">
        <el-form :model="kubernetesApplicationInstance">
          <el-form-item label="模版" :label-width="labelWidth" :required="true">
            <el-select v-model="deploymentTemplate" filterable clearable value-key="id"
                       remote reserve-keyword placeholder="输入关键词搜组类型" :remote-method="getDeploymentTemplate">
              <el-option
                v-for="item in deploymentTemplateOptions"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="无状态模版" :label-width="labelWidth">
            <editor v-model="deploymentTemplate.templateYaml" @init="editorTplInit" lang="yaml" theme="kuroir"
                    width="100%"
                    readonly
                    height="400"></editor>
          </el-form-item>
        </el-form>
        <div style="width:100%;text-align:center">
          <el-button align="center" type="success" size="mini" @click="handlerCreateDeployment">创建</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Service配置" name="service" :disabled="kubernetesApplicationInstance.id === ''">
        <el-form :model="kubernetesApplicationInstance">
          <el-form-item label="模版" :label-width="labelWidth" :required="true">
            <el-select v-model="serviceTemplate" filterable clearable value-key="id"
                       remote reserve-keyword placeholder="输入关键词搜组类型" :remote-method="getServiceTemplate">
              <el-option
                v-for="item in serviceTemplateOptions"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务模版" :label-width="labelWidth">
            <editor v-model="serviceTemplate.templateYaml" @init="editorTplInit" lang="yaml" theme="kuroir" width="100%"
                    height="400"></editor>
          </el-form-item>
        </el-form>
        <div style="width:100%;text-align:center">
          <el-button align="center" type="success" size="mini" @click="handlerCreateService">创建</el-button>
        </div>
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
  import { queryEnvPage } from '@api/env/env.js'
  import {
    addKubernetesApplicationInstance,
    updateKubernetesApplicationInstance,
    queryKubernetesApplicationInstanceLable,
    queryKubernetesApplicationInstanceTemplatePage,
    createKubernetesDeployment,
    createKubernetesService
  } from '@api/kubernetes/kubernetes.application.instance.js'

  export default {
    data () {
      return {
        activeName: 'instance',
        kubernetesApplication: {},
        kubernetesApplicationInstance: {},
        labelWidth: '100px',
        options: {
          stripe: true
        },
        envTypeOptions: [],
        envLabelOptions: [],
        deploymentTemplateOptions: [],
        serviceTemplateOptions: [],
        deploymentTemplate: {},
        serviceTemplate: {}
      }
    },
    name: 'KubernetesApplicationInstanceDialog',
    props: ['formStatus'],
    components: {
      editor: require('vue2-ace-editor')
    },
    mounted () {
      this.getEnvType()
    },
    methods: {
      editorInit () {
        // language extension prerequsite...
        require('brace/ext/language_tools')
        // language
        require('brace/mode/yaml')
        require('brace/theme/chrome')
        // snippet
        require('brace/snippets/yaml')
      },
      editorTplInit: function (ed) {
        // language extension prerequsite...
        require('brace/ext/language_tools')
        // language
        require('brace/mode/yaml')
        require('brace/theme/chrome')
        require('brace/theme/kuroir')
        // snippet
        require('brace/snippets/yaml')
        ed.setReadOnly(true)
      },
      getDeploymentTemplate (queryName) {
        this.getTemplate(queryName, 'DEPLOYMENT')
      },
      getServiceTemplate (queryName) {
        this.getTemplate(queryName, 'SERVICE')
      },
      getTemplate (queryName, templateType) {
        if (this.kubernetesApplicationInstance.id === '') {
          this.deploymentTemplate = ''
          this.serviceTemplate = ''
          return
        }
        let requestBody = {
          queryName: queryName,
          envType: this.kubernetesApplicationInstance.envType,
          templateType: templateType,
          instanceId: this.kubernetesApplicationInstance.id,
          page: 1,
          length: 10
        }
        queryKubernetesApplicationInstanceTemplatePage(requestBody)
          .then(res => {
            if (templateType === 'DEPLOYMENT') {
              this.deploymentTemplateOptions = res.body.data
              if (this.deploymentTemplateOptions.length === 1) {
                this.deploymentTemplate = this.deploymentTemplateOptions[0]
              }
            } else {
              this.serviceTemplateOptions = res.body.data
              if (this.serviceTemplateOptions.length === 1) {
                this.serviceTemplate = this.serviceTemplateOptions[0]
              }
            }
          })
      },
      getEnvType () {
        queryEnvPage('', '', 1, 20)
          .then(res => {
            this.envTypeOptions = res.body.data
          })
      },
      handlerSelEnvType () {
        this.kubernetesApplicationInstance.envLabel = ''
        this.getEnvLabel()
      },
      getEnvLabel () {
        if (this.kubernetesApplicationInstance.envType === null) return
        if (this.kubernetesApplicationInstance.envType === '') return
        queryKubernetesApplicationInstanceLable(this.kubernetesApplicationInstance.envType)
          .then(res => {
            this.envLabelOptions = res.body
          })
      },
      handlerCloseDialog () {
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      initData (kubernetesApplication, kubernetesApplicationInstance) {
        this.activeName = 'instance'
        this.deploymentTemplateOptions = []
        this.serviceTemplateOptions = []
        this.deploymentTemplate = {}
        this.serviceTemplate = {}
        this.kubernetesApplication = kubernetesApplication
        this.kubernetesApplicationInstance = kubernetesApplicationInstance
        this.getDeploymentTemplate('')
        this.getServiceTemplate('')
      },
      handlerCreateDeployment () {
        if (this.deploymentTemplate === null || this.deploymentTemplate.id === '') return
        let requestBody = {
          instanceId: this.kubernetesApplicationInstance.id,
          templateId: this.deploymentTemplate.id
        }
        createKubernetesDeployment(requestBody)
          .then(res => {
            if (res.success) {
              this.$message({
                message: '成功',
                type: 'success'
              })
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      handlerCreateService () {
        if (this.serviceTemplate === null || this.serviceTemplate.id === '') return
        let requestBody = {
          instanceId: this.kubernetesApplicationInstance.id,
          templateId: this.serviceTemplate.id
        }
        createKubernetesService(requestBody)
          .then(res => {
            if (res.success) {
              this.$message({
                message: '成功',
                type: 'success'
              })
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      handlerSave () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.kubernetesApplicationInstance)
          if (this.formStatus.operationType) {
            addKubernetesApplicationInstance(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.handlerCloseDialog()
              })
          } else {
            updateKubernetesApplicationInstance(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.handlerCloseDialog()
              })
          }
        }, 600)
      }
    }
  }
</script>
