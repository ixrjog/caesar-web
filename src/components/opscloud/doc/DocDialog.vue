<template>
  <el-dialog title="帮助文档" :visible.sync="formStatus.visible" @close="handlerClose">
    <el-form :model="userDoc">
      <d2-markdown :source="userDoc.docContent" v-if="operationType === 0"/>
      <d2-highlight/>
      <editor v-model="userDoc.docContent" @init="editorInit" theme="kuroir" lang="markdown" v-if="operationType === 1"
              height="400"></editor>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handlerEdit" v-if="!formStatus.readMode && operationType === 0">编辑</el-button>
      <el-button @click="handlerSave" v-if="!formStatus.readMode && operationType === 1">保存</el-button>
      <el-button @click="handlerClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { saveUserDoc } from '@api/doc/doc.js'

  export default {
    data () {
      return {
        userDoc: {},
        // 0 查看 1 编辑
        operationType: -1,
        labelWidth: '100px',
        options: {
          stripe: true
        }
      }
    },
    name: 'DocDialog',
    props: ['formStatus'],
    mounted () {
    },
    components: {
      editor: require('vue2-ace-editor')
    },
    methods: {
      editorInit: function (ed) {
        // language extension prerequsite...
        require('brace/ext/language_tools')
        // language
        require('brace/mode/yaml')
        require('brace/mode/markdown')
        require('brace/theme/chrome')
        require('brace/theme/kuroir')
        // snippet
        require('brace/snippets/markdown')
        // ed.setReadOnly(true)
      },
      initData (userDoc) {
        this.userDoc = userDoc
        this.operationType = 0
      },
      handlerClose () {
        this.operationType = -1
        this.userDoc = {}
        this.formStatus.visible = false
      },
      handlerEdit () {
        this.operationType = 1
      },
      handlerSave () {
        saveUserDoc(this.userDoc).then(res => {
          if (res.success) {
            this.$message({
              message: '更新成功!',
              type: 'success'
            })
            this.operationType = 0
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
</script>
