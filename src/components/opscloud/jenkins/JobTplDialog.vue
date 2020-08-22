<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" width="80%">
    <el-form :model="jobTpl">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="模版配置" name="template">
          <el-form-item label="jenkins实例" :label-width="labelWidth" required>
            <el-select v-model.trim="jobTpl.jenkinsInstanceId" filterable clearable @change="handlerSelInstance"
                       :disabled="jobTpl.id !== ''"
                       remote reserve-keyword placeholder="输入关键词搜索" :remote-method="getJenkinsInstance"
                       :loading="instanceLoading">
              <el-option v-for="item in instanceOptions"
                         :key="item.id" :label="item.name" :value="item.id">
                <span style="float: left; margin-right: 15px">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.privateIp }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择模版" :label-width="labelWidth" required v-if="jobTpl.id === ''">
            <el-table :data="tplOptions" style="width: 100%" v-loading="tplLoading">
              <el-table-column prop="name" label="模版名称"></el-table-column>
              <el-table-column prop="url" label="url"></el-table-column>
              <el-table-column fixed="right" label="操作" width="80">
                <template slot-scope="scope">
                  <el-button type="primary" plain size="mini" @click="handlerRowSelTpl(scope.row)">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="名称" :label-width="labelWidth" required>
            <el-input v-model="jobTpl.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="模版名称" :label-width="labelWidth" required>
            <el-input v-model="jobTpl.tplName" disabled></el-input>
          </el-form-item>
          <el-form-item label="模版类型" :label-width="labelWidth" required>
            <el-select v-model.trim="jobTpl.tplType" clearable>
              <el-option
                v-for="item in tplTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模版版本" :label-width="labelWidth">
            <el-input v-model="jobTpl.tplVersion" disabled></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model="jobTpl.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="模版内容" name="content" :disabled="formStatus.operationType">
          <div style="width:100%;text-align:center;margin-bottom: 5px">
            <el-button align="center" type="primary" plain size="mini" @click="handlerReadTplContent()">读取模版</el-button>
            <el-button align="center" type="primary" plain size="mini" @click="handlerSaveTplContent()">写入模版</el-button>
          </div>
          <el-form-item label="模版详情" :label-width="labelWidth" required>
            <editor v-model="jobTpl.tplContent" @init="editorInit" lang="xml" theme="chrome"
                    width="100%" height="500"></editor>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="参数配置" name="parameter" :disabled="formStatus.operationType">
          <el-form-item label="模版参数" :label-width="labelWidth" :required="true">
            <editor v-model="jobTpl.parameterYaml" @init="editorInit" lang="yaml" theme="chrome"
                    width="100%" height="400"></editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
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
    addJobTpl,
    updateJobTpl,
    writeJobTpl,
    queryJobTplByInstanceId,
    readJobTplById
  } from '@api/jenkins/jenkins.tpl.js'

  const tplTypeOptions = [
    {
      value: 'iOS',
      label: 'iOS'
    }, {
      value: 'Android',
      label: 'Android'
    },
    {
      value: 'H5',
      label: 'H5'
    },
    {
      value: 'JAVA',
      label: 'JAVA'
    },
    {
      value: 'PYTHON',
      label: 'PYTHON'
    }
  ]

  export default {
    data () {
      return {
        activeName: 'template',
        jobTpl: {},
        labelWidth: '150px',
        options: {
          stripe: true
        },
        tplTypeOptions: tplTypeOptions,
        instanceLoading: false,
        instanceOptions: [],
        tplOptions: [],
        tplLoading: false
      }
    },
    name: 'JobTplDialog',
    props: ['formStatus'],
    components: {
      editor: require('vue2-ace-editor')
    },
    mounted () {
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
        this.instanceOptions = []
        this.tplOptions = []
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      initData (jobTpl) {
        this.jobTpl = jobTpl
        this.activeName = 'template'
        if (this.jobTpl.id === '') {
          this.getJenkinsInstance('')
        } else {
          this.instanceOptions = []
          this.instanceOptions.push(jobTpl.jenkinsInstance)
        }
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      getJenkinsInstance (queryName) {
        this.instanceLoading = true
        let requestBody = {
          'queryName': queryName,
          'extend': 1,
          'page': 1,
          'length': 10
        }
        queryJenkinsInstancePage(requestBody)
          .then(res => {
            this.instanceOptions = res.body.data
            this.instanceLoading = false
          })
      },
      handlerSelInstance () {
        this.getTpl()
      },
      getTpl () {
        this.tplLoading = true
        queryJobTplByInstanceId(this.jobTpl.jenkinsInstanceId)
          .then(res => {
            this.tplOptions = res.body
            this.tplLoading = false
          })
      },
      handlerReadTplContent () {
        readJobTplById(this.jobTpl.id)
          .then(res => {
            if (res.success) {
              this.$message({
                message: '读取成功！',
                type: 'success'
              })
              this.jobTpl.tplContent = res.body
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      handlerRowSelTpl (row) {
        this.jobTpl.tplName = row.name
      },
      handlerSaveTplContent () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.jobTpl)
          writeJobTpl(requestBody)
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
        }, 600)
      },
      handlerSave () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.jobTpl)
          if (this.formStatus.operationType) {
            addJobTpl(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.closeDialog()
              })
          } else {
            updateJobTpl(requestBody)
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
