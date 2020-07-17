<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="kubernetesClusterNamespace">
      <el-form-item label="集群" :label-width="labelWidth" :required="true">
        <el-select v-model="kubernetesClusterNamespace.clusterId" filterable clearable class="select"
                   @change="handlerSetCluster"
                   remote reserve-keyword placeholder="搜索集群" :remote-method="getCluster">
          <el-option
            v-for="item in clusterOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="kubernetesClusterNamespace">
      <el-form-item label="命名空间" :label-width="labelWidth" :required="true">
        <el-select v-model="kubernetesClusterNamespace.namespace" filterable clearable class="select" :disabled="kubernetesClusterNamespace.clusterId === ''" :loading="namespaceLoading"
                   remote reserve-keyword placeholder="选择命名空间">
          <el-option
            v-for="item in namespaceOptions"
            :key="item.namespace"
            :label="item.namespace"
            :value="item.namespace">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="kubernetesClusterNamespace">
      <el-form-item label="环境" :label-width="labelWidth" :required="true">
        <el-select v-model="kubernetesClusterNamespace.envType" filterable clearable
                   remote reserve-keyword>
          <el-option
            v-for="item in envTypeOptions"
            :key="item.envType"
            :label="item.envName"
            :value="item.envType">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="kubernetesClusterNamespace">
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="kubernetesClusterNamespace.comment" placeholder="请输入内容"></el-input>
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
  import { queryEnvPage } from '@api/env/env.js'
  import { queryKubernetesClusterPage, queryKubernetesExcludeNamespace, addKubernetesClusterNamespace, updateKubernetesClusterNamespace } from '@api/kubernetes/kubernetes.cluster.js'

  export default {
    data () {
      return {
        kubernetesClusterNamespace: {},
        namespaceLoading: false,
        labelWidth: '100px',
        options: {
          stripe: true
        },
        envTypeOptions: [],
        clusterOptions: [],
        namespaceOptions: []
      }
    },
    name: 'KubernetesClusterNamespaceDialog',
    props: ['formStatus'],
    components: {},
    mounted () {
      this.getCluster('')
      this.getEnvType()
    },
    methods: {
      initData (namespace) {
        this.kubernetesClusterNamespace = namespace
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      handlerSetCluster () {
        this.getNamespace()
        this.kubernetesClusterNamespace.namespace = ''
      },
      getCluster (queryName) {
        let requestBody = {
          'queryName': queryName,
          'extend': 0,
          'page': 1,
          'length': 10
        }
        queryKubernetesClusterPage(requestBody)
          .then(res => {
            this.clusterOptions = res.body.data
          })
      },
      getNamespace () {
        if (this.kubernetesClusterNamespace.clusterId === '') return
        this.namespaceLoading = true
        let requestBody = {
          'clusterId': this.kubernetesClusterNamespace.clusterId
        }
        queryKubernetesExcludeNamespace(requestBody)
          .then(res => {
            this.namespaceOptions = res.body
            this.namespaceLoading = false
          })
      },
      getEnvType () {
        queryEnvPage('', '', 1, 20)
          .then(res => {
            this.envTypeOptions = res.body.data
          })
      },
      handlerSave () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.kubernetesClusterNamespace)
          if (this.formStatus.operationType) {
            addKubernetesClusterNamespace(requestBody)
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
            updateKubernetesClusterNamespace(requestBody)
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
