<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" :before-close="closeDialog">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="任务配置" name="job">
        <el-form :model="application">
          <el-form-item label="应用名称" :label-width="labelWidth">
            <el-input v-model="application.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="应用key" :label-width="labelWidth">
            <el-input v-model="application.applicationKey" disabled></el-input>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <el-form :model="ciJob">
          <el-form-item label="任务名称" :label-width="labelWidth" required>
            <el-input v-model="ciJob.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="任务key" :label-width="labelWidth" required>
            <el-input v-model="ciJob.jobKey" placeholder="请输入内容(只允许使用a-zA-Z、0-9、-)"></el-input>
          </el-form-item>
          <el-form-item label="仓库" :label-width="labelWidth" required>
            <el-select v-model.trim="ciJob.scmMemberId" placeholder="请选择选择" style="width: 500px"
                       :disabled="!formStatus.operationType"
                       @change="handlerSelScm">
              <el-option
                v-for="item in application.scmMembers"
                :key="item.id"
                :label="item.scmSshUrl"
                :value="item.id">
              </el-option>
            </el-select>
            <el-checkbox v-model="ciJob.enableTag" style="margin-left: 20px" @change="handlerSelScm">
              <span>允许标签构建(tag)</span>
            </el-checkbox>
          </el-form-item>
          <el-form-item label="分支" :label-width="labelWidth" required>
            <el-select v-model.trim="ciJob.branch" placeholder="请选择选择" style="width: 500px"
                       :disabled="branchOptions === '' || branchOptions.length === 0">
              <el-option-group
                v-for="group in branchOptions"
                :key="group.label"
                :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="环境" :label-width="labelWidth" required>
            <el-select v-model.trim="ciJob.envType" filterable clearable
                       remote reserve-keyword>
              <el-option
                v-for="item in envTypeOptions"
                :key="item.envType"
                :label="item.envName"
                :value="item.envType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="隐藏任务" :label-width="labelWidth" required>
            <el-select v-model.trim="ciJob.hide" placeholder="选择类型">
              <el-option
                v-for="item in hideOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model.trim="ciJob.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="通知配置" name="dingtalk">
        <el-form :model="ciJob">
          <el-form-item label="钉钉" :label-width="labelWidth">
            <el-select v-model.trim="ciJob.dingtalkId" filterable clearable placeholder="请选择选择" remote
                       :remote-method="getDingtalk" style="width: 500px">
              <el-option
                v-for="item in dingtalkOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通知类型" :label-width="labelWidth" required>
            <el-select v-model.trim="ciJob.atAll" placeholder="选择类型">
              <el-option
                v-for="item in atAllOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-divider></el-divider>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { queryEnvPage } from '@api/env/env.js'
  import { queryApplicationSCMMemberBranch } from '@api/application/application.js'
  import { queryDingtalkPage } from '@api/dingtalk/dingtalk.js'
  import { addCiJob, updateCiJob } from '@api/application/ci.job.js'

  const enableTagOptions = [{
    value: false,
    label: '否'
  }, {
    value: true,
    label: '是'
  }]

  const atAllOptions = [{
    value: false,
    label: '自己'
  }, {
    value: true,
    label: '所有人'
  }]

  const hideOptions = [{
    value: false,
    label: '否'
  }, {
    value: true,
    label: '是'
  }]

  export default {
    data () {
      return {
        activeName: 'job',
        application: '',
        ciJob: '',
        labelWidth: '150px',
        options: {
          stripe: true
        },
        // scmMembers: [],
        // scmMemberLoading: false,
        queryParam: {
          instanceId: '',
          queryName: ''
        },
        envTypeOptions: [],
        enableTagOptions: enableTagOptions,
        atAllOptions: atAllOptions,
        hideOptions: hideOptions,
        branchesLoading: false,
        branchOptions: [],
        dingtalkOptions: []
      }
    },
    name: 'CiJobDialog',
    props: ['formStatus'],
    components: {},
    mounted () {
      this.getEnvType()
    },
    methods: {
      closeDialog () {
        this.branchOptions = []
        this.dingtalkOptions = []
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      initData (application, ciJob) {
        this.application = application
        this.ciJob = ciJob
        if (!this.formStatus.operationType) {
          this.getBranches()
        }
        if (this.ciJob.dingtalkId === null || this.ciJob.dingtalkId === '') {
          this.getDingtalk('')
        } else {
          this.dingtalkOptions.push(ciJob.dingtalk)
        }
      },
      getDingtalk (queryName) {
        let requestBody = {
          'queryName': queryName,
          'extend': 1,
          'page': 1,
          'length': 10
        }
        queryDingtalkPage(requestBody)
          .then(res => {
            this.dingtalkOptions = res.body.data
          })
      },
      handlerSelScm () {
        if (this.ciJob.scmMemberId !== '') {
          this.getBranches()
        }
      },
      getBranches () {
        this.branchesLoading = true
        let requestBody = {
          'scmMemberId': this.ciJob.scmMemberId,
          'enableTag': this.ciJob.enableTag
        }
        queryApplicationSCMMemberBranch(requestBody)
          .then(res => {
            this.branchOptions = res.body.options
            this.branchesLoading = false
          })
      },
      getEnvType () {
        queryEnvPage('', '', 1, 20)
          .then(res => {
            this.envTypeOptions = res.body.data
          })
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      handlerSave () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.ciJob)
          if (this.formStatus.operationType) {
            addCiJob(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.closeDialog()
              })
          } else {
            updateCiJob(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.closeDialog()
              })
          }
        }, 600)
      }
    }
  }
</script>
