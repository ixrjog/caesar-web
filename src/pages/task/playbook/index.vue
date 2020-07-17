<template>
  <d2-container>
    <template>
      <div>
        <h1>Playbook</h1>
      </div>
      <el-row :gutter="10">
        <el-col :span="8">
          <ServerTree ref="serverTree"></ServerTree>
        </el-col>
        <el-col :span="16">
          <el-select v-model.trim="playbook" filterable :style="searchBarStyle"
                     @change="selectPlaybook" value-key="id" reserve-keyword
                     remote placeholder="搜索playbook" :remote-method="getPlaybook"
                     :loading="playbookSearching">
            <el-option v-for="item in playbookOptions" :key="item.id" :label="item.name" :value="item">
            </el-option>
          </el-select>
          <el-tooltip content="预览playbook脚本" placement="bottom" effect="light">
            <el-button @click="previewPlaybook" :style="searchBarStyle">预览</el-button>
          </el-tooltip>
          <el-tooltip content="批量命令执行" placement="bottom" effect="light">
            <el-button @click="executorPlaybook" :style="searchBarStyle">执行</el-button>
          </el-tooltip>
          <el-form :model="executorPlaybookParam">
            <el-form-item label="并发线程数" :label-width="labelWidth" :required="true"
                          style="max-width: 400px;margin-top: 5px">
              <el-slider v-model="executorPlaybookParam.concurrent"
                         :min="2" :max="40" :step="2" show-stops>
              </el-slider>
            </el-form-item>
            <el-form-item label="tags" :label-width="labelWidth" style="max-width: 800px;margin-top: 5px"
                          v-if="playbook != null && playbook.selectedTags != null">
              <el-select v-model="playbook.selectedTags" multiple placeholder="请选择">
                <el-option
                  v-for="item in playbook.tasks"
                  :key="item.tags"
                  :label="item.tags"
                  :value="item.tags">
                  <span style="float: left">{{ item.tags }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="vars" :label-width="labelWidth" style="max-width: 400px;margin-top: 5px"
                          v-if="playbook != null && playbook.extraVars != null">
              <el-tooltip content="自定义外部变量" placement="bottom" effect="light">
                <editor v-model="playbook.extraVars" @init="editorInit" lang="yaml" theme="chrome"
                        width="400"
                        height="100" :options="options"></editor>
              </el-tooltip>
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
    executorPlaybook, queryPlaybookPage
  } from '@api/server/server.task.js'

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
        // serverGroup: {},
        uuid: '',
        options: {
          stripe: true
        },
        executorPlaybookParam: {
          playbookId: '',
          vars: '',
          tags: [],
          concurrent: 10,
          becomeUser: '',
          hostPatterns: [],
          uuid: '',
          taskType: 2
        },
        playbookSearching: false,
        playbook: {},
        playbookOptions: [],
        labelWidth: '100px',
        formPreviewStatus: {
          visible: false,
          labelWidth: '100px'
        }
      }
    },
    mounted () {
      this.getPlaybook('')
      // this.getGrpType('')
      // this.fetchData()
    },
    components: {
      ServerTree,
      PreviewContentDialog,
      AnsibleResult,
      editor: require('vue2-ace-editor')
    },
    methods: {
      selectPlaybook (playbook) {
        this.playbook = playbook || {}
      },
      getPlaybook (queryName) {
        this.playbookSearching = true
        let requestBody = {
          queryName: queryName,
          page: 1,
          length: 20
        }
        queryPlaybookPage(requestBody)
          .then(res => {
            this.playbookOptions = res.body.data
            this.playbookSearching = false
          })
      },
      previewPlaybook () {
        //  let previewData = Object.assign({}, this.ansible)
        const previewData = {
          name: this.playbook.name,
          content: this.playbook.playbook,
          path: this.playbook.path,
          lang: 'yaml',
          comment: this.playbook.comment
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
      executorPlaybook () {
        let requestBody = Object.assign({}, this.executorPlaybookParam)
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
        if (JSON.stringify(this.playbook) === '{}') {
          this.$message.error('未选择playbook')
          return
        }
        requestBody.playbookId = this.playbook.id
        requestBody.vars = this.playbook.extraVars
        requestBody.tags = this.playbook.selectedTags
        // 重置定时器
        executorPlaybook(requestBody).then(res => {
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
