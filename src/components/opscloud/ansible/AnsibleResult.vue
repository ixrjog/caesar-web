<template>
  <div>
    <el-tabs tab-position="top" v-if="serverTask != '' && serverTask.memberMap != null" v-model="activeName">
      <el-tab-pane name="execute" v-if="serverTask.memberMap.EXECUTE_QUEUE != null">
        <span slot="label"><i class="el-icon-loading"></i> 执行中</span>
        <el-card shadow="never" v-for="member in serverTask.memberMap.EXECUTE_QUEUE" :key="member.id"
                 style="margin-top: 5px">
          <el-row>
            <el-tag disable-transitions>{{member.hostPattern}} - {{member.manageIp}}</el-tag>
            <el-tag disable-transitions :style="{ color: member.env.color , marginLeft: '5px' }">
              {{member.env.envName}}
            </el-tag>
            <el-button type="text" style="float: right" @click="abortServerTaskMember(member.id)">停止</el-button>
          </el-row>
          <d2-highlight v-if="member.outputMsgLog != null" :code="member.outputMsgLog" style="margin-top: 5px"/>
        </el-card>
      </el-tab-pane>
      <el-tab-pane name="queue" v-if="serverTask.memberMap.QUEUE != null">
        <span slot="label"><i class="el-icon-video-pause"></i> 队列</span>
        <el-card shadow="never" v-for="member in serverTask.memberMap.QUEUE" :key="member.id"
                 style="margin-top: 5px">
          <el-tag disable-transitions>{{member.hostPattern}} - {{member.manageIp}}</el-tag>
          <el-tag disable-transitions :style="{ color: member.env.color , marginLeft: '5px' }">
            {{member.env.envName}}
          </el-tag>
        </el-card>
      </el-tab-pane>
      <el-tab-pane name="finalized">
        <span slot="label"><i class="el-icon-check"></i> 完成</span>
        <!--result选择器-->
        <div v-if="serverTask.finalized === 1">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
            <el-tag size="mini">{{ serverTask.taskStatistics.total }}</el-tag>
            显示所有
          </el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedResults" @change="handleCheckedResultsChange">
            <el-checkbox v-for="result in resultOptions" :label="result.key" :key="result.key">
              <el-tag size="mini" :type="result.type">{{ result.count }}</el-tag>
              {{result.key}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-card shadow="never" v-for="member in serverTask.memberMap.FINALIZED" :key="member.id"
                 style="margin-top: 5px" v-show="!member.hide">
          <el-row>
            <el-tag disable-transitions color="#5C887A" v-if="member.success"><span
              :style="{ color: 'white' }">success</span>
            </el-tag>
            <el-tag disable-transitions color="#F56C6C" v-if="!member.success"><span :style="{ color: 'white' }">{{ member.taskResult }}</span>
            </el-tag>
            <el-tag disable-transitions :style="{ marginLeft: '5px' }">{{member.hostPattern}} -
              {{member.manageIp}}
            </el-tag>
            <el-tag disable-transitions :style="{ color: member.env.color , marginLeft: '5px' }">
              {{member.env.envName}}
            </el-tag>
            <el-button type="primary" plain size="mini" style="float: right; margin-right: 20px"
                       @click="handlerXTerm(member)">登录
            </el-button>
          </el-row>
          <d2-highlight v-if="member.result == null && member.outputMsgLog != null" :code="member.outputMsgLog"
                        style="margin-top: 5px"/>
          <d2-highlight v-if="member.result != null" :code="member.result.stdout" style="margin-top: 5px"/>
          <d2-highlight v-if="member.showErrorLog" :code="member.errorMsgLog" style="margin-top: 5px"/>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <terminal :formStatus="formXtermStatus" ref="xtermDialog"></terminal>
  </div>
</template>

<script>

  // XTerm
  import terminal from '@/components/opscloud/xterm/Terminal'

  import { queryServerTaskById, abortServerTaskById, abortServerTaskMemberById } from '@api/server/server.task.js'

  export default {
    data () {
      return {
        formXtermStatus: {
          visible: false
        },
        serverTask: '',
        resultOptions: [],
        isIndeterminate: true,
        checkAll: true,
        checkedResults: [],
        timer: null,
        taskId: '',
        activeName: '',
        options: {
          stripe: true
        },
        playbook: {},
        playbookOptions: [],
        labelWidth: '100px'
      }
    },
    name: 'AnsibleResult',
    props: [],
    mixins: [],
    mounted () {
    },
    components: {
      terminal
    },
    methods: {
      initData (taskId) {
        this.timer = null
        this.activeName = 'execute'
        this.taskId = taskId
        this.queryTask()
        this.setTimer()
      },
      handlerXTerm (item) {
        this.formXtermStatus.visible = true
        let server = {
          name: item.hostPattern,
          privateIp: item.manageIp
        }
        this.$refs.xtermDialog.initData(server)
      },
      handleCheckAllChange (val) {
        this.checkedResults = val ? ['successful', 'failed', 'error'] : []
        this.isIndeterminate = false
        this.setServerTaskMemberHide()
      },
      handleCheckedResultsChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.checkedResults.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkedResults.length
        this.setServerTaskMemberHide()
      },
      setServerTaskMemberHide () {
        for (var i = 0; i < this.serverTask.memberMap.FINALIZED.length; i++) {
          let member = this.serverTask.memberMap.FINALIZED[i]
          let hide = true
          for (var j = 0; j < this.checkedResults.length; j++) {
            if (member.taskResult.toLowerCase() === this.checkedResults[j]) {
              hide = false
              break
            }
          }
          member.hide = hide
        }
      },
      setTimer () {
        if (this.timer == null) {
          this.timer = setInterval(() => {
            this.queryTask()
            console.log('开始定时...每n秒执行一次')
          }, 3000)
        }
      },
      handleDialogCancel (done) {
        this.$message({
          message: '取消保存',
          type: 'warning'
        })
        done()
      },
      abortServerTask (taskId) {
        abortServerTaskById(taskId).then(res => {
          if (res.success) {
            this.$message({
              message: '任务停止中!',
              type: 'success'
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      abortServerTaskMember (memberId) {
        abortServerTaskMemberById(memberId).then(res => {
          if (res.success) {
            this.$message({
              message: '任务停止中!',
              type: 'success'
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      queryTask () {
        queryServerTaskById(this.taskId)
          .then(res => {
            this.serverTask = res.body
            if (res.body.finalized === 1) {
              clearInterval(this.timer)
              // 任务完成后需要渲染结果选择  resultOptions: ['successful', 'failed', 'error'],
              this.resultOptions = []
              let successful = {
                key: 'successful',
                count: this.serverTask.taskStatistics.successfulCount,
                type: 'success'
              }
              this.resultOptions.push(successful)
              let failed = {
                key: 'failed',
                count: this.serverTask.taskStatistics.failedCount,
                type: 'warning'
              }
              this.resultOptions.push(failed)
              let error = {
                key: 'error',
                count: this.serverTask.taskStatistics.errorCount,
                type: 'danger'
              }
              this.resultOptions.push(error)
              this.checkedResults = ['successful', 'failed', 'error']
              this.activeName = 'finalized'
            }
          })
      }
    }
  }
</script>

<style scoped>

</style>
