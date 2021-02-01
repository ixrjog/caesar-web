<template>
  <d2-container>
    <h1>{{title}}</h1>
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
        <el-card shadow="hover" v-show="buildType">
          <div slot="header" class="clearfix">
            <span>All build jobs</span>
            <el-button style="float: right; padding: 3px 0;margin-right: 45px" type="primary" @click="handlerSwitch">
              <i class="fa fa-refresh" aria-hidden="true"></i>SWITCH
            </el-button>
          </div>
          <my-ci-job-table ref="myCiJobTable"></my-ci-job-table>
        </el-card>
        <el-card shadow="hover" v-show="!buildType">
          <div slot="header" class="clearfix">
            <span>All deploy jobs</span>
            <el-button style="float: right; padding: 3px 0;margin-right: 45px" type="primary" @click="handlerSwitch">
              <i class="fa fa-refresh" aria-hidden="true"></i>SWITCH
            </el-button>
          </div>
          <my-cd-job-table ref="myCdJobTable"></my-cd-job-table>
        </el-card>
        <jenkins-engine-status style="margin-top: 10px"></jenkins-engine-status>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

  import MyApplicationTable from '@/components/opscloud/application/MyApplicationTable.vue'
  import JenkinsEngineStatus from '@/components/opscloud/jenkins/JenkinsEngineStatus.vue'
  import MyCiJobTable from '@/components/opscloud/application/MyCiJobTable.vue'
  import MyCdJobTable from '@/components/opscloud/application/MyCdJobTable.vue'
  import AnnouncementCarousel from '@/components/opscloud/announcement/AnnouncementCarousel.vue'
  import BlockPlatformStatus from '@/components/opscloud/platform/BlockPlatformStatus.vue'

  export default {
    data () {
      return {
        title: '我的应用',
        buildType: true,
        timer: null, // 查询定时器
        intervalTime: 12000
      }
    },
    components: {
      MyApplicationTable,
      JenkinsEngineStatus,
      MyCiJobTable,
      MyCdJobTable,
      AnnouncementCarousel,
      BlockPlatformStatus
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
      handlerSwitch () {
        this.buildType = !this.buildType
      },
      handlerSelApplication (application) {
        this.$refs.myCiJobTable.initData(application)
        this.$refs.myCdJobTable.initData(application)
        this.setTimer() // 启动定时器查询任务列表
      }
    }
  }
</script>

<style>
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
</style>
