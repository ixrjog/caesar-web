<template>
  <d2-container>
    <template>
      <div>
        <h1>Script执行</h1>
      </div>
      <el-row :gutter="10">
        <el-col :span="8">
          <ServerTree ref="serverTree"></ServerTree>
        </el-col>
        <el-col :span="16">
          <el-select v-model.trim="script" filterable :style="searchBarStyle"
                     @change="selectScript" value-key="id" reserve-keyword
                     remote placeholder="搜索script" :remote-method="getScript"
                     :loading="scriptSearching">
            <el-option v-for="item in scriptOptions" :key="item.id" :label="item.name" :value="item">
            </el-option>
          </el-select>
          <el-tooltip content="预览script脚本" placement="bottom" effect="light">
            <el-button @click="previewContent" :style="searchBarStyle">预览</el-button>
          </el-tooltip>
          <el-tooltip content="批量命令执行" placement="bottom" effect="light">
            <el-button @click="executorScript" :style="searchBarStyle">执行</el-button>
          </el-tooltip>
          <el-form :model="executorScriptParam">
            <el-form-item label="并发线程数" :label-width="labelWidth" :required="true"
                          style="max-width: 400px;margin-top: 5px">
              <el-slider v-model="executorScriptParam.concurrent"
                         :min="2" :max="10" :step="2" show-stops>
              </el-slider>
            </el-form-item>
            <el-form-item label="script参数" :label-width="labelWidth"  style="max-width: 400px;margin-top: 5px">
              <editor v-model="executorScriptParam.scriptParam" @init="editorInit" lang="sh" theme="chrome"
                      width="800"
                      height="80" :options="options"></editor>
            </el-form-item>
          </el-form>
          <AnsibleResult ref="ansibleResult"></AnsibleResult>
        </el-col>
      </el-row>
      <PreviewContentDialog :formStatus="formPreviewStatus" ref="previewDialog"></PreviewContentDialog>
    </template>
  </d2-container>
</template>

<script>
  import ServerTree from '@/components/opscloud/tree/ServerTree'
  import PreviewContentDialog from '@/components/opscloud/dialog/PreviewContentDialog'
  import AnsibleResult from '@/components/opscloud/ansible/AnsibleResult'

  // API
  import {
    executorScript, queryScriptPage } from '@api/server/server.task.js'

  export default {
    data () {
      return {
        serverTask: '',
        taskId: '',
        searchBarHeadStyle: {
          display: 'inline-block',
          maxWidth: '200px'
        },
        searchBarStyle: {
          marginLeft: '5px'
        },
        uuid: '',
        options: {
          stripe: true
        },
        executorScriptParam: {
          scriptId: '',
          scriptParam: '',
          concurrent: 4,
          becomeUser: '',
          hostPatterns: [],
          uuid: '',
          taskType: 1
        },
        scriptSearching: false,
        script: {},
        scriptOptions: [],
        labelWidth: '100px',
        formPreviewStatus: {
          visible: false,
          labelWidth: '100px'
        }
      }
    },
    mounted () {
      this.getScript('')
    },
    components: {
      ServerTree,
      PreviewContentDialog,
      AnsibleResult,
      editor: require('vue2-ace-editor')
    },
    methods: {
      selectScript (script) {
        this.script = script || {}
      },
      getScript (queryName) {
        this.scriptSearching = true
        let requestBody = {
          queryName: queryName,
          page: 1,
          length: 20
        }
        queryScriptPage(requestBody)
          .then(res => {
            this.scriptOptions = res.body.data
            this.scriptSearching = false
          })
      },
      previewContent () {
        const previewData = {
          name: this.script.name,
          content: this.script.scriptContent,
          path: this.script.path,
          lang: this.script.scriptLang,
          comment: this.script.comment
        }
        this.formPreviewStatus.visible = true
        this.$refs.previewDialog.initData(previewData)
      },
      editorInit: function () {
        require('brace/ext/language_tools')
        require('brace/mode/yaml')
        require('brace/mode/sh')
        require('brace/theme/chrome')
        require('brace/snippets/yaml')
      },
      executorScript () {
        var requestBody = Object.assign({}, this.executorScriptParam)
        try {
          requestBody.hostPatterns = this.$refs.serverTree.getCheckedKeys(true)
          requestBody.uuid = this.$refs.serverTree.getUuid()
          if (JSON.stringify(requestBody.hostPatterns) === '[]') {
            this.$message.error('未选择服务器节点')
            return
          }
        } catch (e) {
          this.$message.error('服务器节点查询失败')
          return
        }
        if (JSON.stringify(this.script) === '{}') {
          this.$message.error('未选择script')
          return
        }
        requestBody.scriptId = this.script.id
        // 重置定时器
        executorScript(requestBody).then(res => {
          if (res.success) {
            this.$message({
              message: '任务执行中!',
              type: 'success'
            })
            // taskId
            this.$refs.ansibleResult.initData(res.body.id)
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
</script>
