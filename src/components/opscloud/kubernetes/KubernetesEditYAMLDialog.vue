<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="template">
      <el-form-item label="名称" :label-width="labelWidth" :required="true">
        <el-input v-model="template.name"></el-input>
      </el-form-item>
      <el-form-item label="模版类型" :label-width="labelWidth" :required="true">
        <el-select v-model="template.templateType" filterable clearable placeholder="选择模版类型">
          <el-option
            v-for="item in tplTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="环境类型" :label-width="labelWidth" :required="true">
        <el-select v-model="template.envType" clearable>
          <el-option
            v-for="item in envTypeOptions"
            :key="item.id"
            :label="item.envName"
            :value="item.envType">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="template.comment"></el-input>
      </el-form-item>
      <el-form-item label="YAML" :label-width="labelWidth">
        <editor v-model="template.templateYaml" @init="editorInit" lang="yaml" theme="chrome" height="400"
                :options="options"></editor>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">关闭</el-button>
      <el-button size="mini" type="primary" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { addKubernetesTemplate, updateKubernetesTemplate } from '@api/kubernetes/kubernetes.template.js'

  const options = {
    // vue2-ace-editor编辑器配置自动补全等
    enableBasicAutocompletion: true,
    enableSnippets: true,
    // 自动补全
    enableLiveAutocompletion: true
  }

  export default {
    data () {
      return {
        labelWidth: '100px',
        template: '',
        options: options,
        tplTypeOptions: [],
        envTypeOptions: []
      }
    },
    name: 'KubernetesEditYAMLDialog',
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
      initData (template, tplTypeOptions, envTypeOptions) {
        this.template = template
        this.tplTypeOptions = tplTypeOptions
        this.envTypeOptions = envTypeOptions
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      handlerSave () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.template)
          if (this.formStatus.operationType) {
            addKubernetesTemplate(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeDialog')
              })
          } else {
            updateKubernetesTemplate(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeDialog')
              })
          }
        }, 600)
      }
    }
  }
</script>
