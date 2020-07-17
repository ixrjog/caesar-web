<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="kubernetesCluster">
      <el-form-item label="集群名称" :label-width="labelWidth" :required="true">
        <el-input v-model="kubernetesCluster.name" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="kubernetesCluster">
      <el-form-item label="管理url" :label-width="labelWidth" :required="true">
        <el-input v-model="kubernetesCluster.masterUrl" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="kubernetesCluster">
      <el-form-item label="kubeconfig" :label-width="labelWidth" :required="true">
        <editor v-model="kubernetesCluster.kubeconfig" @init="editorInit" lang="yaml" theme="chrome"
                width="100%" height="300"></editor>
      </el-form-item>
    </el-form>
    <el-form :model="kubernetesCluster">
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="kubernetesCluster.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { addKubernetesCluster, updateKubernetesCluster } from '@api/kubernetes/kubernetes.cluster.js'

  export default {
    data () {
      return {
        kubernetesCluster: {},
        labelWidth: '100px',
        options: {
          stripe: true
        }
      }
    },
    name: 'KubernetesClusterDialog',
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
        require('brace/theme/chrome')
        // snippet
        require('brace/snippets/yaml')
      },
      initData (kubernetesCluster) {
        this.kubernetesCluster = kubernetesCluster
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      handlerSave () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.kubernetesCluster)
          if (this.formStatus.operationType) {
            addKubernetesCluster(requestBody)
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
            updateKubernetesCluster(requestBody)
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
