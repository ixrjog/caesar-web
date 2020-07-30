<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="jenkinsInstance">
      <el-form-item label="实例名称" :label-width="labelWidth" :required="true">
        <el-input v-model="jenkinsInstance.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="jenkins服务器" :label-width="labelWidth" :required="true">
        <el-select v-model.trim="jenkinsInstance.serverId" filterable clearable
                   remote reserve-keyword placeholder="输入关键词搜索" :remote-method="getServer" :loading="serverLoading">
          <el-option v-for="item in serverOptions"
                     :key="item.id" :label="item.name" :value="item.id">
            <span style="float: left; margin-right: 15px">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.privateIp }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="节点服务器组" :label-width="labelWidth" :required="true">
        <el-select v-model.trim="jenkinsInstance.nodeServerGroupId" filterable clearable
                   remote reserve-keyword placeholder="输入关键词搜组类型" :remote-method="getServerGroup"
                   :loading="groupLoading">
          <el-option
            v-for="item in serverGroupOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="管理url" :label-width="labelWidth" :required="true">
        <el-input v-model="jenkinsInstance.url" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="账户" :label-width="labelWidth" :required="true">
        <el-input v-model="jenkinsInstance.username" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="token" :label-width="labelWidth">
        <el-input v-model="jenkinsInstance.token" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="有效" :label-width="labelWidth" :required="true">
        <el-select v-model.trim="jenkinsInstance.isActive" clearable>
          <el-option
            v-for="item in activeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="jenkinsInstance.comment" placeholder="请输入内容"></el-input>
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
  import { fuzzyQueryServerPage } from '@api/server/server.js'
  import { queryServerGroupPage } from '@api/server/server.group.js'
  import { addJenkinsInstance, updateJenkinsInstance } from '@api/jenkins/jenkins.instance.js'

  const activeOptions = [
    {
      value: true,
      label: '有效'
    }, {
      value: false,
      label: '无效'
    }]

  export default {
    data () {
      return {
        jenkinsInstance: {},
        labelWidth: '150px',
        options: {
          stripe: true
        },
        activeOptions: activeOptions,
        serverLoading: false,
        serverOptions: [],
        groupLoading: false,
        serverGroupOptions: []
      }
    },
    name: 'JenkinsInstanceDailog',
    props: ['formStatus'],
    components: {},
    mounted () {
    },
    methods: {
      initData (jenkinsInstance) {
        this.jenkinsInstance = jenkinsInstance
        if (this.jenkinsInstance.id === '') {
          this.getServer('')
          this.getServerGroup('')
        } else {
          this.serverOptions = []
          this.serverOptions.push(jenkinsInstance.server)
          this.serverGroupOptions = []
          this.serverGroupOptions.push(jenkinsInstance.nodeGroup)
        }
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      getServer (queryName) {
        this.serverLoading = true
        let requestBody = {
          queryName: queryName,
          serverGroupId: '',
          envType: '',
          tagId: '',
          isActive: '',
          serverStatus: '',
          page: 1,
          length: 10
        }
        fuzzyQueryServerPage(requestBody)
          .then(res => {
            this.serverOptions = res.body.data
            this.serverLoading = false
          })
      },
      getServerGroup (queryName) {
        queryServerGroupPage(queryName, '', 1, 20)
          .then(res => {
            this.serverGroupOptions = res.body.data
          })
      },
      handlerSave () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.jenkinsInstance)
          if (this.formStatus.operationType) {
            addJenkinsInstance(requestBody)
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
            updateJenkinsInstance(requestBody)
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
