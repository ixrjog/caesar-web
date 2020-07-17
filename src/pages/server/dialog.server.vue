<template>
  <el-dialog :title="form.operationType ? form.addTitle : form.updateTitle"
             :visible.sync="form.visible">
    <el-form :model="server">
      <el-form-item label="名称" :label-width="form.labelWidth">
        <el-input v-model.trim="server.name" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="server">
      <el-form-item label="服务器组" :label-width="form.labelWidth">
        <el-select v-model.trim="server.serverGroupId" filterable clearable
                   remote reserve-keyword placeholder="输入关键词搜组类型" :remote-method="getServerGroup"
                   :loading="loading">
          <el-option
            v-for="item in server.serverGroupOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="server">
      <el-form-item label="服务器类型" :label-width="form.labelWidth">
        <el-select v-model.trim="server.serverType" placeholder="选择类型">
          <el-option
            v-for="item in serverTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="server">
      <el-form-item label="登录用户" :label-width="form.labelWidth">
        <el-input v-model.trim="server.loginUser" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="server">
      <el-form-item label="登录类型" :label-width="form.labelWidth">
        <el-select v-model.trim="server.loginType" placeholder="选择类型">
          <el-option
            v-for="item in loginTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="server">
      <el-form-item label="环境" :label-width="form.labelWidth">
        <el-select v-model.trim="server.envType" filterable clearable
                   remote reserve-keyword
                   :loading="loading">
          <el-option
            v-for="item in server.envTypeOptions"
            :key="item.envType"
            :label="item.envName"
            :value="item.envType">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="server">
      <el-form-item label="区" :label-width="form.labelWidth">
        <el-input v-model.trim="server.area" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="server">
      <el-form-item label="公网ip" :label-width="form.labelWidth">
        <el-input v-model.trim="server.publicIp" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="server">
      <el-form-item label="私网ip" :label-width="form.labelWidth">
        <el-input v-model.trim="server.privateIp" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="server">
      <el-form-item label="序号" :label-width="form.labelWidth">
        <el-input v-model.number="server.serialNumber" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="server">
      <el-form-item label="描述" :label-width="form.labelWidth">
        <el-input v-model.trim="server.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="form.visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="saveItem">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { addServer, updateServer } from '@api/server/server.js'
  import { queryServerGroupPage } from '@api/server/server.group.js'

  export default {
    data () {
      return {
        loading: false,
        serverTypeOptions: [{
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
        }],
        loginTypeOptions: [{
          value: 0,
          label: 'key'
        }, {
          value: 1,
          label: 'passwd'
        }]
      }
    },
    name: 'dialog-server',
    props: {
      form: {},
      server: {
        serverGroup: {},
        id: '',
        name: '',
        serverGroupId: '',
        loginType: '',
        loginUser: '',
        envType: '',
        publicIp: '',
        privateIp: '',
        serverType: '',
        area: '',
        serialNumber: '',
        monitorStatus: '',
        comment: '',
        serverGroupOptions: []
      }
    },
    mixins: [],
    mounted () {
    },
    methods: {
      handleClick () {
        this.$emit('input', !this.value)
      },
      getServerGroup (queryName) {
        queryServerGroupPage(queryName, '', 1, 20)
          .then(res => {
            this.server.serverGroupOptions = res.body.data
          })
      },
      saveItem () {
        setTimeout(() => {
          var requestBody = {}
          requestBody = Object.assign({}, this.server)
          delete requestBody.serverGroupOptions
          delete requestBody.tags
          delete requestBody.env
          requestBody.serverGroupId = this.server.serverGroup == null ? this.server.serverGroupId : this.server.serverGroup.id
          if (this.formStatus.operationType) {
            addServer(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeServerDialog')
              })
          } else {
            updateServer(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeServerDialog')
              })
          }
        }, 600)
      }
    }
  }
</script>
