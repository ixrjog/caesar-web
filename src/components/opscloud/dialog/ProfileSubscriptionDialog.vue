<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" @before-close="handlerCloseDialog">
    <el-form :model="profileSubscriptionData">
      <el-form-item label="名称" :label-width="labelWidth" :required="true">
        <el-input v-model.trim="profileSubscriptionData.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="订阅类型" :label-width="labelWidth" :required="true">
        <el-select v-model.trim="profileSubscriptionData.subscriptionType" placeholder="选择类型">
          <el-option
            v-for="item in subscriptionTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择脚本" :label-width="labelWidth" :required="true">
        <el-select v-model="profileSubscriptionData.scriptId" filterable value-key="id" reserve-keyword
                   remote placeholder="搜索playbook" :remote-method="getPlaybook"
                   :loading="playbookSearching">
          <el-option v-for="item in playbookOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务器组" :label-width="labelWidth" :required="true">
        <el-select v-model.trim="profileSubscriptionData.serverGroupId" filterable clearable
                   remote reserve-keyword placeholder="输入关键词搜组类型" :remote-method="getServerGroup"
                   :loading="loading">
          <el-option
            v-for="item in serverGroupOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主机模式" :label-width="labelWidth" :required="true">
        <el-input v-model.trim="profileSubscriptionData.hostPattern" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="vars" :label-width="labelWidth" :required="true">
        <editor v-model="profileSubscriptionData.vars" @init="editorInit" lang="yaml" theme="chrome"
                width="100%" height="100"></editor>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model.trim="profileSubscriptionData.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handlerCloseDialog">取消</el-button>
      <el-button type="primary" size="mini" @click="saveInfo">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { queryServerGroupPage } from '@api/server/server.group.js'
  import { addProfileSubscription, updateProfileSubscription } from '@api/profile/profile.subscription.js'
  import { queryPlaybookPage } from '@api/server/server.task.js'

  const subscriptionTypeOptions = [{
    value: 'ANSIBLE_HOSTS',
    label: 'ANSIBLE_HOSTS'
  }]

  export default {
    data () {
      return {
        loading: false,
        playbookSearching: false,
        labelWidth: '150px',
        profileSubscriptionData: {},
        subscriptionTypeOptions: subscriptionTypeOptions,
        serverGroupOptions: [],
        playbookOptions: []
      }
    },
    name: 'ProfileSubscriptionDialog',
    props: ['formStatus'],
    mixins: [],
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
      handlerCloseDialog () {
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      getServerGroup (queryName) {
        queryServerGroupPage(queryName, '', 1, 20)
          .then(res => {
            this.serverGroupOptions = res.body.data
          })
      },
      initData (profileSubscriptionData) {
        this.profileSubscriptionData = profileSubscriptionData
        if (this.formStatus.operationType) {
          this.getServerGroup('')
          this.getPlaybook('')
        } else {
          this.serverGroupOptions = []
          this.serverGroupOptions.push(profileSubscriptionData.serverGroup)
          this.playbookOptions = []
          this.playbookOptions.push(profileSubscriptionData.ansiblePlaybook)
        }
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      saveInfo () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.profileSubscriptionData)
          // requestBody.serverGroupId = this.formData.serverGroup == null ? this.formData.serverGroupId : this.formData.serverGroup.id
          if (this.formStatus.operationType) {
            addProfileSubscription(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.handlerCloseDialog()
              })
          } else {
            updateProfileSubscription(requestBody)
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
