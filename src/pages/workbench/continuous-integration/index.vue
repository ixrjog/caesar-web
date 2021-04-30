<template>
  <d2-container>
    <h1 v-show="false">{{title}}</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="我的应用" name="application">
        <el-row :gutter="10">
          <el-col :span="7">
            <my-application-card @handlerSelApplication="handlerSelApplication"></my-application-card>
          </el-col>
          <el-col :span="17">
            <!--公告-->
            <announcement-carousel></announcement-carousel>
            <block-platform-status></block-platform-status>
            <el-card shadow="hover">
              <el-tabs type="card" style="margin-bottom: 10px">
                <el-tab-pane>
                  <span slot="label"><span class="title">
                    <i class="el-icon-loading" v-if="running.build"></i>Build</span></span>
                  <build-job-table ref="buildJobTable" @setRunning="setRunning"></build-job-table>
                  <el-divider>pipelines</el-divider>
                  <task-pipeline :buildType="0" :queryParam="queryParam"
                                 @handlerOpenExecutor="handlerOpenExecutor"></task-pipeline>
                </el-tab-pane>
                <el-tab-pane>
                  <span slot="label"><span class="title">
                    <i class="el-icon-loading" v-if="running.deployment"></i>Deployment</span></span>
                  <deployment-job-table ref="deploymentJobTable"
                                        @setRunning="setRunning"></deployment-job-table>
                  <el-divider>pipelines</el-divider>
                  <task-pipeline :buildType="1" :queryParam="queryParam"
                                 @handlerOpenExecutor="handlerOpenExecutor"></task-pipeline>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="引擎视图" name="engineChart">
        <engine-chart style="margin-top: 10px" v-if="activeName === 'engineChart'"></engine-chart>
      </el-tab-pane>
    </el-tabs>
    <terminalMaster :formStatus="formTerminalStatus" ref="terminalMaster">
      <template :slot-scope="executor">
        <div class="tips" v-if="executor != null">
          <el-button type="text" style="margin-left: 10px; padding: 3px 0"
                     @click="handlerSendCmd()">[点击进入工作目录] `cd
            {{executor.workspace}}`
          </el-button>
        </div>
      </template>
    </terminalMaster>
  </d2-container>
</template>

<script>

  import myApplicationCard from '@/components/opscloud/application/MyApplicationCard.vue'
  import engineChart from '@/components/opscloud/jenkins/EngineChart'
  import buildJobTable from '@/components/opscloud/application/BuildJobTable.vue'
  import deploymentJobTable from '@/components/opscloud/application/DeploymentJobTable.vue'
  import AnnouncementCarousel from '@/components/opscloud/announcement/AnnouncementCarousel.vue'
  import BlockPlatformStatus from '@/components/opscloud/platform/BlockPlatformStatus.vue'
  import TaskPipeline from '@/components/opscloud/pipeline/TaskPipeline.vue'

  import terminalMaster from '@/components/opscloud/xterm/TerminalMaster'

  export default {
    data () {
      return {
        title: '持续集成',
        activeName: 'application',
        running: {
          build: false,
          deployment: false
        },
        application: null,
        timer: null, // 查询定时器
        intervalTime: 10000,
        executor: null,
        queryParam: {
          queryType: 'MY',
          querySize: 2
        },
        formTerminalStatus: {
          visible: false
        }
      }
    },
    components: {
      myApplicationCard,
      engineChart,
      buildJobTable,
      deploymentJobTable,
      AnnouncementCarousel,
      BlockPlatformStatus,
      TaskPipeline,
      terminalMaster
    },
    beforeDestroy () {
      clearInterval(this.timer) // 销毁定时器
    },
    mounted () {
    },
    methods: {
      setTimer () {
        if (this.timer === null) {
          this.timer = setInterval(() => {
            this.$refs.buildJobTable.fetchData()
            this.$refs.deploymentJobTable.fetchData()
          }, this.intervalTime)
        }
      },
      handlerSelApplication (application) {
        this.application = application
        this.$refs.buildJobTable.initData(application)
        this.$refs.deploymentJobTable.initData(application)
        this.setTimer() // 启动定时器查询任务列表
      },
      handlerOpenExecutor (executor) {
        this.executor = executor
        this.formTerminalStatus.visible = true
        this.$refs.terminalMaster.open(executor.server)
      },
      setRunning (args) {
        if (args.type === 0) {
          this.running.build = args.isRunning
        } else {
          this.running.deployment = args.isRunning
        }
      },
      handlerSendCmd () {
        let commandMessage = {
          data: 'cd ' + this.executor.workspace + '\n',
          status: 'COMMAND',
          instanceId: this.executor.server.name
        }
        this.$refs.terminalMaster.sendCmd(this.executor.server, commandMessage)
      }
    }
  }
</script>

<style scoped>
  .table-expand {
    font-size: 0;
  }

  .table-expand label {
    width: 150px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .tips {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 10px 10px;
    margin-bottom: 5px;
    margin-right: 10px;
  }
</style>
