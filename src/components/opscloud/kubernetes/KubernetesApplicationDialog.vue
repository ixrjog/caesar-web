<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" @before-close="handlerCloseDialog">
    <el-form :model="kubernetesApplication">
      <el-form-item label="应用名称" :label-width="labelWidth" :required="true">
        <el-input v-model.trim="kubernetesApplication.name" placeholder="请输入内容"
                  :disabled="!formStatus.operationType"></el-input>
      </el-form-item>
      <el-form-item label="服务器组" :label-width="labelWidth" :required="true">
        <el-select v-model="kubernetesApplication.serverGroupId" filterable clearable
                   remote reserve-keyword placeholder="输入关键词搜组类型" :remote-method="getServerGroup">
          <el-option
            v-for="item in serverGroupOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="kubernetesApplication.comment" placeholder="请输入内容"></el-input>
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
  import { addKubernetesApplication, updateKubernetesApplication } from '@api/kubernetes/kubernetes.application.js'
  import { queryServerGroupPage } from '@api/server/server.group.js'

  export default {
    data () {
      return {
        activeName: 'application',
        kubernetesApplication: {},
        labelWidth: '100px',
        options: {
          stripe: true
        },
        serverGroupOptions: []
      }
    },
    name: 'KubernetesApplicationDialog',
    props: ['formStatus'],
    components: {},
    mounted () {
    },
    methods: {
      handlerCloseDialog () {
        this.formStatus.visible = false
        this.kubernetesApplication = {}
        this.serverGroupOptions = []
        this.$emit('closeDialog')
      },
      getServerGroup (queryName) {
        queryServerGroupPage(queryName, '', 1, 20)
          .then(res => {
            this.serverGroupOptions = res.body.data
          })
      },
      initData (kubernetesApplication) {
        if (this.formStatus.operationType) {
          this.getServerGroup('')
        } else {
          this.serverGroupOptions = []
          this.serverGroupOptions.push(kubernetesApplication.serverGroup)
        }
        this.kubernetesApplication = kubernetesApplication
      },
      handlerSave () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.kubernetesApplication)
          if (this.formStatus.operationType) {
            addKubernetesApplication(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.handlerCloseDialog()
              })
          } else {
            updateKubernetesApplication(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.handlerCloseDialog()
              })
          }
        }, 600)
      }
    }
  }
</script>
