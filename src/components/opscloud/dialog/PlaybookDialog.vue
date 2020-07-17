<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="playbook" name="playbook">
        <el-form :model="playbookData">
          <el-form-item label="名称" :label-width="formStatus.labelWidth" :required="true">
            <el-input v-model="playbookData.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="说明" :label-width="formStatus.labelWidth">
            <el-input v-model="playbookData.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="内容" :label-width="formStatus.labelWidth" :required="true">
            <editor v-model="playbookData.playbook" @init="editorInit" lang="yaml" theme="chrome"
                    width="100%" height="400"></editor>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="自定义变量" name="vars">
        <el-form :model="playbookData">
          <el-form-item label="vars" :label-width="formStatus.labelWidth">
            <editor v-model="playbookData.extraVars" @init="editorInit" lang="yaml" theme="chrome"
                    width="100%" height="500"></editor>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="任务标签" name="tags">
        <el-form :model="playbookData">
          <el-form-item label="tags" :label-width="formStatus.labelWidth">
            <editor v-model="playbookData.tags" @init="editorInit" lang="yaml" theme="chrome"
                    width="100%" height="500"></editor>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="帮助" name="help">
        <d2-markdown :source="doc"/>
        <!-- 为了高亮md-->
        <d2-highlight :code="example" lang="yaml"/>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="saveInfo">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import doc from '@/static/md/ansible.playbook.md'

  // API
  import { addPlaybook, updatePlaybook } from '@api/server/server.task.js'

  export default {
    data () {
      return {
        doc,
        example: '',
        playbookData: {},
        activeName: 'playbook',
        options: {
          stripe: true
        },
        loading: false,
        needAuthOptions: [{
          value: 0,
          label: '不鉴权'
        }, {
          value: 1,
          label: '鉴权'
        }]
      }
    },
    name: 'PlaybookDialog',
    props: ['formStatus'],
    mounted () {
    },
    components: {
      editor: require('vue2-ace-editor')
    },
    methods: {
      editorInit: function () {
        // language extension prerequsite...
        require('brace/ext/language_tools')
        // language
        require('brace/mode/yaml')
        require('brace/theme/chrome')
        // snippet
        require('brace/snippets/yaml')
      },
      initData (playbookData) {
        this.playbookData = playbookData
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      saveInfo () {
        setTimeout(() => {
          var requestBody = Object.assign({}, this.playbookData)
          if (this.formStatus.operationType) {
            addPlaybook(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closePlaybookDialog')
              })
          } else {
            updatePlaybook(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closePlaybookDialog')
              })
          }
        }, 600)
      }
    }
  }
</script>
