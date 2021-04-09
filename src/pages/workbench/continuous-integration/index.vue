<template>
  <d2-container>
    <h1>{{title}}</h1>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="我的应用" name="application">
        <el-row :gutter="10">
          <el-col :span="7">
            <el-card shadow="hover">
              <my-application-table ref="myApplicationTable"
                                    @handlerSelApplication="handlerSelApplication"></my-application-table>
            </el-card>
          </el-col>
          <el-col :span="17">
            <announcement-carousel></announcement-carousel>
            <block-platform-status></block-platform-status>
            <el-card shadow="hover" v-show="buildType" style="margin-bottom: 10px">
              <div slot="header" class="clearfix">
                <span>All build jobs</span>
                <el-button style="float: right; padding: 3px 0;margin-right: 45px" type="primary"
                           @click="handlerSwitch">
                  <span style="margin-left: 5px;margin-right: 5px"><i class="fa fa-refresh" aria-hidden="true"></i>SWITCH</span>
                </el-button>
              </div>
              <my-ci-job-table ref="myCiJobTable"></my-ci-job-table>
            </el-card>
            <el-card shadow="hover" v-show="!buildType" style="margin-bottom: 10px">
              <div slot="header" class="clearfix">
                <span>All deploy jobs</span>
                <el-button style="float: right; padding: 3px 0;margin-right: 45px" type="primary"
                           @click="handlerSwitch">
                  <i class="fa fa-refresh" aria-hidden="true"></i>SWITCH
                </el-button>
              </div>
              <my-cd-job-table ref="myCdJobTable"></my-cd-job-table>
            </el-card>
            <task-pipeline v-show="buildType" :buildType="0" :queryParam="queryParam" @handlerOpenExecutor="handlerOpenExecutor"></task-pipeline>
            <task-pipeline v-show="!buildType" :buildType="1" :queryParam="queryParam" @handlerOpenExecutor="handlerOpenExecutor"></task-pipeline>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="引擎视图" name="engineChart">
        <engine-chart style="margin-top: 10px" v-if="activeName === 'engineChart'"></engine-chart>
      </el-tab-pane>
    </el-tabs>
    <terminalMaster :formStatus="formTerminalStatus" ref="terminalMaster">
      <template :slot-scope="executor">
        <div class="tips" v-if="executor != null" >
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

  import MyApplicationTable from '@/components/opscloud/application/MyApplicationTable.vue'
  import engineChart from '@/components/opscloud/jenkins/EngineChart'
  import MyCiJobTable from '@/components/opscloud/application/MyCiJobTable.vue'
  import MyCdJobTable from '@/components/opscloud/application/MyCdJobTable.vue'
  import AnnouncementCarousel from '@/components/opscloud/announcement/AnnouncementCarousel.vue'
  import BlockPlatformStatus from '@/components/opscloud/platform/BlockPlatformStatus.vue'
  import TaskPipeline from '@/components/opscloud/pipeline/TaskPipeline.vue'

  import terminalMaster from '@/components/opscloud/xterm/TerminalMaster'

  export default {
    data () {
      return {
        title: '持续集成',
        activeName: 'application',
        buildType: true,
        timer: null, // 查询定时器
        intervalTime: 12000,
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
      MyApplicationTable,
      engineChart,
      MyCiJobTable,
      MyCdJobTable,
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
            if (this.buildType) {
              this.$refs.myCiJobTable.fetchData()
            } else {
              this.$refs.myCdJobTable.fetchData()
            }
          }, this.intervalTime)
        }
      },
      handleClick () {
      },
      handlerSwitch () {
        this.buildType = !this.buildType
      },
      handlerSelApplication (application) {
        this.$refs.myCiJobTable.initData(application)
        this.$refs.myCdJobTable.initData(application)
        this.setTimer() // 启动定时器查询任务列表
      },
      handlerOpenExecutor (executor) {
        this.executor = executor
        this.formTerminalStatus.visible = true
        this.$refs.terminalMaster.open(executor.server)
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
