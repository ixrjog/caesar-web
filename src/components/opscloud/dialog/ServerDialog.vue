<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" @before-close="handlerCloseDialog">
    <el-form :model="serverData">
      <el-form-item label="名称" :label-width="formStatus.labelWidth" :required="true">
        <el-input v-model.trim="serverData.name" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="serverData">
      <el-form-item label="服务器组" :label-width="formStatus.labelWidth" :required="true">
        <el-select v-model.trim="serverData.serverGroupId" filterable clearable
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
    </el-form>
    <el-form :model="serverData">
      <el-form-item label="服务器类型" :label-width="formStatus.labelWidth" :required="true">
        <el-select v-model="serverData.serverType" placeholder="选择类型">
          <el-option
            v-for="item in serverTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="serverData">
      <el-form-item label="登录用户" :label-width="formStatus.labelWidth">
        <el-input v-model.trim="serverData.loginUser" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="serverData">
      <el-form-item label="登录类型" :label-width="formStatus.labelWidth">
        <el-select v-model.trim="serverData.loginType" placeholder="选择类型">
          <el-option
            v-for="item in loginTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="serverData">
      <el-form-item label="环境" :label-width="formStatus.labelWidth" :required="true">
        <el-select v-model.trim="serverData.envType" filterable clearable
                   remote reserve-keyword
                   :loading="loading">
          <el-option
            v-for="item in envTypeOptions"
            :key="item.envType"
            :label="item.envName"
            :value="item.envType">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="serverData">
      <el-form-item label="区" :label-width="formStatus.labelWidth">
        <el-input v-model.trim="serverData.area" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="serverData">
      <el-form-item label="公网ip" :label-width="formStatus.labelWidth">
        <el-input v-model.trim="serverData.publicIp" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="serverData">
      <el-form-item label="私网ip" :label-width="formStatus.labelWidth" :required="true">
        <el-input v-model.trim="serverData.privateIp" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="serverData">
      <el-form-item label="序号" :label-width="formStatus.labelWidth" :required="true">
        <el-input v-model.number="serverData.serialNumber" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="serverData">
      <el-form-item label="描述" :label-width="formStatus.labelWidth">
        <el-input v-model.trim="serverData.comment" placeholder="请输入内容"></el-input>
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
  import { queryEnvPage } from '@api/env/env.js'
  import { addServer, updateServer } from '@api/server/server.js'
  import { queryServerGroupPage } from '@api/server/server.group.js'
  import { querySettingMapByName } from '@api/setting/setting.js'

  const accountSettingName = 'SERVER_ACCOUNT'

  const serverTypeOptions = [{
    value: 0,
    label: 'server'
  }, {
    value: 1,
    label: 'vmware vm'
  }, {
    value: 2,
    label: 'aliyun ecs'
  }, {
    value: 3,
    label: 'aws ec2'
  }, {
    value: 4,
    label: 'tencent cvm'
  }, {
    value: 5,
    label: 'vmware esxi'
  }]

  const loginTypeOptions = [{
    value: 0,
    label: 'key'
  }, {
    value: 1,
    label: 'passwd'
  }]

  export default {
    data () {
      return {
        loading: false,
        envTypeOptions: [],
        serverGroupOptions: [],
        serverData: {},
        loginUser: '',
        serverTypeOptions: serverTypeOptions,
        loginTypeOptions: loginTypeOptions
      }
    },
    name: 'ServerDialog',
    props: ['formStatus'],
    mixins: [],
    mounted () {
    },
    methods: {
      setAccountSetting () {
        querySettingMapByName(accountSettingName)
          .then(res => {
            this.serverData.loginUser = res.body[accountSettingName]
          })
      },
      handlerCloseDialog () {
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      getEnvType () {
        queryEnvPage('', '', 1, 20)
          .then(res => {
            this.envTypeOptions = res.body.data
          })
      },
      initData (serverData, serverGroupOptions) {
        this.serverData = serverData
        this.serverGroupOptions = serverGroupOptions
        this.getEnvType()
        this.setAccountSetting()
        // 尝试选择匹配服务器组
        if (JSON.stringify(this.serverData.serverGroup) === '{}') {
          let queryName = this.serverData.name.replace(new RegExp('-[0-9]+$'), '')
          queryServerGroupPage(queryName, '', 1, 20)
            .then(res => {
              this.serverGroupOptions = res.body.data
              if (JSON.stringify(this.serverGroupOptions) === '[]') return
              if (this.serverGroupOptions.length >= 0) {
                this.serverData.serveGroup = this.serverGroupOptions[0]
                this.serverData.serverGroupId = this.serverGroupOptions[0].id
              }
            })
        }
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      getServerGroup (queryName) {
        queryServerGroupPage(queryName, '', 1, 20)
          .then(res => {
            this.serverGroupOptions = res.body.data
          })
      },
      saveInfo () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.serverData)
          delete requestBody.serverGroupOptions
          delete requestBody.serverGroup
          delete requestBody.envTypeOptions
          delete requestBody.tags
          delete requestBody.env
          // requestBody.serverGroupId = this.formData.serverGroup == null ? this.formData.serverGroupId : this.formData.serverGroup.id
          if (this.formStatus.operationType) {
            addServer(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.handlerCloseDialog()
              })
          } else {
            updateServer(requestBody)
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
