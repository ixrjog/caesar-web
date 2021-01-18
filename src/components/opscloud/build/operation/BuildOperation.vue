<template>
  <div>
    <el-button-group style="float: right">
      <el-tooltip class="item" effect="light" content="回滚当前任务版本" placement="top"
                  v-if="build.supportRollback && build.finalized && build.buildStatus === 'SUCCESS'">
        <el-button type="primary" icon="fa fa-undo"
                   :loading="rollbacking"
                   @click="handlerRollback()"></el-button>
      </el-tooltip>
      <el-button type="primary" icon="fa fa-stop" v-if="!build.finalized"
                 @click="handlerAbortBuild()"></el-button>
      <!--      打开任务链接-->
      <el-tooltip class="item" effect="light" content="打开构建任务详情" placement="top">
        <el-button type="primary" icon="el-icon-position" @click="handlerOpenBuildUrl()">
        </el-button>
      </el-tooltip>
      <!--      打开任务详情-->
      <el-button type="primary" icon="fa fa-download" v-if="option != null && option.showBuildDetails"
                 @click="handlerOpenBuildDetails()">
      </el-button>
    </el-button-group>
  </div>

</template>

<script>

  import util from '@/libs/util.js'

  import { buildCiJob, abortBuildCiJob } from '@api/build/job.build.js'

  export default {
    name: 'BuildOperation',
    data () {
      return {
        rollbacking: false
      }
    },
    props: ['build', 'option'],
    filters: {},
    mounted () {
    },
    methods: {
      handlerRollback () {
        // 回滚操作
        this.$confirm('确定回滚当前版本?')
          .then(_ => {
            this.rollbacking = true
            let paramMap = {
              rollbackJobBuildId: this.build.id
            }
            let requestBody = {
              'ciJobId': this.ciJob.id,
              'branch': this.ciJob.branch,
              'versionName': '',
              'versionDesc': '',
              'isSilence': this.buildParam.isSilence,
              'isRollback': true,
              'paramMap': paramMap
            }
            buildCiJob(requestBody)
              .then(res => {
                if (res.success) {
                  this.$message({
                    type: 'success',
                    message: '回滚任务执行中!'
                  })
                } else {
                  this.$message.error(res.msg)
                }
                this.rollbacking = false
              })
            done()
          })
          .catch(_ => {
          })
      },
      handlerAbortBuild () {
        abortBuildCiJob(this.build.id)
          .then(res => {
            if (res.success) {
              this.$message({
                message: '执行成功（请等待）!',
                type: 'success'
              })
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      handlerOpenBuildUrl () {
        util.open(this.build.jobBuildUrl)
      },
      handlerOpenBuildDetails () {
        let host = window.location.host
        let httpProtocol = window.location.href.split('://')[0]
        switch(this.option.buildType) {
          case 'ANDROID_BUILD':
            util.open(httpProtocol + '://' + host + '/#/job/build/android?buildId=' + this.build.id)
            break;
          case 'IOS_BUILD':
            util.open(httpProtocol + '://' + host + '/#/job/build/ios?buildId=' + this.build.id)
            break;
          default:
        }
      }
    }
  }
</script>

<style scoped>

</style>
