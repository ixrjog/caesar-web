<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="logData">
      <el-form-item label="日志项目" :label-width="labelWidth" :required="true">
        <el-select v-model="logData.project" filterable clearable
                   remote reserve-keyword placeholder="输入关键词搜索project" :remote-method="getProject"
                   @change="handlerSelProject" :loading="loading">
          <el-option
            v-for="item in projectOptions"
            :key="item.projectName"
            :label="item.name"
            :value="item.projectName">
            <span style="float: left">{{ item.projectName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.projectDesc }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="logData">
      <el-form-item label="日志库" :label-width="labelWidth" :required="true">
        <el-select v-model.trim="logData.logstore" placeholder="选择logstore" @change="handlerSelLogstore" :disabled="logData.project === ''">
          <el-option
            v-for="item in logstoreOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="logData">
      <el-form-item label="Logtail配置" :label-width="labelWidth" :required="true">
        <el-select v-model.trim="logData.config" placeholder="选择config" :disabled="logData.logstore === ''">
          <el-option
            v-for="item in configOptions"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="logData">
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model.trim="logData.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="saveInfo">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

  // API
  import { addAliyunLog, updateAliyunLog, queryProject, queryLogstore, queryConfig } from '@api/cloud/aliyun.log.js'

  export default {
    data () {
      return {
        labelWidth: '150px',
        logData: {},
        projectOptions: [],
        logstoreOptions: [],
        configOptions: [],
        loading: false
      }
    },
    name: 'AliyunLogDialog',
    props: ['formStatus'],
    mounted () {
      this.getProject('')
    },
    methods: {
      initData (aliyunLog) {
        this.logData = aliyunLog
      },
      getProject (param) {
        let requestBody = {
          queryName: param
        }
        queryProject(requestBody)
          .then(res => {
            this.projectOptions = res.body
          })
      },
      getLogStore () {
        let requestBody = {
          projectName: this.logData.project
        }
        queryLogstore(requestBody)
          .then(res => {
            this.logstoreOptions = res.body
          })
      },
      getConfig () {
        let requestBody = {
          projectName: this.logData.project,
          logstoreName: this.logData.logstore
        }
        queryConfig(requestBody)
          .then(res => {
            this.configOptions = res.body
          })
      },
      handlerSelProject () {
        this.logstoreOptions = []
        this.logData.logstore = ''
        this.configOptions = []
        this.logData.config = ''
        this.getLogStore()
      },
      handlerSelLogstore () {
        this.configOptions = []
        this.logData.config = ''
        this.getConfig()
      },
      saveInfo () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.logData)
          if (this.formStatus.operationType) {
            addAliyunLog(requestBody)
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
            updateAliyunLog(requestBody)
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
