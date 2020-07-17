<template>
  <el-dialog title="预览文件" :visible.sync="formStatus.visible">
    <el-form :model="previewData">
      <el-form-item label="名称" :label-width="formStatus.labelWidth">
        <el-input v-model="previewData.name" placeholder="" disabled></el-input>
      </el-form-item>
      <el-form-item label="路径" :label-width="formStatus.labelWidth">
        <el-input v-model="previewData.path" placeholder="" disabled></el-input>
      </el-form-item>
      <el-form-item label="说明" :label-width="formStatus.labelWidth">
        <el-input v-model="previewData.comment" placeholder="" disabled></el-input>
      </el-form-item>
      <el-form-item label="内容" :label-width="formStatus.labelWidth">
        <editor v-model="previewData.content" @init="editorInit" :lang="previewData.lang" theme="kuroir"
                height="400"></editor>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        example: '',
        previewData: '',
        options: {
          stripe: true
        }
      }
    },
    name: 'PreviewContextDialog',
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
        require('brace/theme/chrome')
        require('brace/theme/kuroir')
        // snippet
        require('brace/snippets/yaml')
        ed.setReadOnly(true)
      },
      initData (previewData) {
        this.previewData = previewData
      },
      handleClick () {
        this.$emit('input', !this.value)
      }
    }
  }
</script>
