<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Script" name="script">
        <el-form :model="scriptData">
          <el-form-item label="名称" :label-width="formStatus.labelWidth" :required="true">
            <el-input v-model="scriptData.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="lang" :label-width="formStatus.labelWidth" :required="true">
            <el-input v-model="scriptData.scriptLang" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="锁定" :label-width="formStatus.labelWidth" :required="true">
            <el-select v-model="scriptData.scriptLock" placeholder="选择类型">
              <el-option
                v-for="item in scriptLockOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="说明" :label-width="formStatus.labelWidth">
            <el-input v-model="scriptData.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="内容" :label-width="formStatus.labelWidth" :required="true">
            <editor v-model="scriptData.scriptContent" @init="editorInit" lang="yaml" theme="chrome"
                    width="100%" height="400"></editor>
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

  import doc from '@/static/md/ansible.script.md'

  // API
  import { addScript, updateScript } from '@api/server/server.task.js'

  export default {
    data () {
      return {
        doc,
        example: '',
        scriptData: {},
        activeName: 'script',
        options: {
          stripe: true
        },
        loading: false,
        scriptLockOptions: [{
          value: 0,
          label: '开放'
        }, {
          value: 1,
          label: '锁定'
        }]
      }
    },
    name: 'StringDialog',
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
        require('brace/mode/sh')
        require('brace/mode/python')
        require('brace/theme/chrome')
        // snippet
        require('brace/snippets/yaml')
      },
      initData (scriptData) {
        this.scriptData = scriptData
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      saveInfo () {
        setTimeout(() => {
          var requestBody = Object.assign({}, this.scriptData)
          if (this.formStatus.operationType) {
            addScript(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeScriptDialog')
              })
          } else {
            updateScript(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeScriptDialog')
              })
          }
        }, 600)
      }
    }
  }
</script>
