<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" :before-close="closeDialog">
    <el-form :model="logMemberData">
      <el-form-item label="服务器组" :label-width="labelWidth" :required="true" v-show="formStatus.operationType">
        <el-select v-model.trim="serverGroup" filterable clearable value-key="name"
                   remote reserve-keyword placeholder="输入关键词搜索服务器组" :remote-method="getServerGroup" :loading="loading">
          <el-option
            v-for="item in serverGroupOptions"
            :key="item.id"
            :label="item.name"
            :value="item">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.comment }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="logMemberData">
      <el-form-item label="服务器组" v-show="!formStatus.operationType" :label-width="labelWidth">
        <el-input v-model.trim="logMemberData.serverGroupName" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="logMemberData">
      <el-form-item label="自定义topic" :label-width="labelWidth">
        <el-input v-model.trim="logMemberData.topic" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="logMemberData">
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model.trim="logMemberData.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="handlerAdd">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

  // API
  import { queryLogMemberServerGroupPage, addAliyunLogMember } from '@api/cloud/aliyun.log.member.js'

  export default {
    data () {
      return {
        labelWidth: '150px',
        serverGroup: '',
        logMemberData: {},
        serverGroupOptions: [],
        loading: false
      }
    },
    name: 'AliyunLogMemberDialog',
    props: ['formStatus'],
    mounted () {
    },
    methods: {
      closeDialog () {
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      initData (aliyunLogMember) {
        this.logMemberData = aliyunLogMember
        if (this.logMemberData.serverGroup !== null) {
          this.serverGroup = this.logMemberData.serverGroup
        }
        this.getServerGroup('')
      },
      getServerGroup (param) {
        let requestBody = {
          queryName: param,
          logId: this.logMemberData.logId
        }
        queryLogMemberServerGroupPage(requestBody)
          .then(res => {
            this.serverGroupOptions = res.body
          })
      },
      handlerAdd () {
        let requestBody = Object.assign({}, this.logMemberData)
        requestBody.serverGroupId = this.serverGroup.id
        addAliyunLogMember(requestBody)
          .then(res => {
            // 返回数据
            this.$message({
              message: '成功',
              type: 'success'
            })
            this.closeDialog()
          })
      }
    }
  }
</script>
