<template>
  <div>
    <el-card shadow="hover">
      <el-col :span="12">
        <div style="margin-bottom: 20px">
          <span style="font-size: 14px">Latest Build Tasks</span>
          <el-tag style="float: right;margin-right: 10px" type="text">Build Total {{latestTasks.buildTaskTotal}}
          </el-tag>
        </div>
        <el-table :data="latestTasks.latestBuildTasks" style="width: 100%;margin-bottom: 13px">
          <el-table-column prop="jobName" label="任务名称" width="280">
            <template slot-scope="scope">
              <span style="color:#5b5d66;font-weight: 300">{{scope.row.jobName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="时间" width="80">
            <template slot-scope="scope">
              <span style="color: #20A9D9">{{scope.row.ago}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" :content="scope.row.buildStatus" placement="top-start">
                <el-tag disable-transitions :type="scope.row.buildStatus | getJobBuildStatusType "><i
                  class="el-icon-loading" v-show="!scope.row.finalized"></i>{{scope.row.buildStatus|
                  getJobBuildStatusText}}
                </el-tag>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <div style="margin-bottom: 20px">
          <span style="font-size: 14px">Latest Deployment Tasks</span>
          <el-tag style="float: right;margin-right: 10px" type="text">Deployment Total
            {{latestTasks.deploymentTaskTotal}}
          </el-tag>
        </div>
        <el-table :data="latestTasks.latestDeploymentTasks" style="width: 100%;margin-bottom: 13px">
          <el-table-column prop="jobName" label="任务名称" width="280">
            <template slot-scope="scope">
              <span style="color:#5b5d66;font-weight: 300">{{scope.row.jobName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="时间" width="80">
            <template slot-scope="scope">
              <span style="color: #20A9D9">{{scope.row.ago}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" :content="scope.row.buildStatus" placement="top-start">
                <el-tag disable-transitions :type="scope.row.buildStatus | getJobBuildStatusType "><i
                  class="el-icon-loading" v-show="!scope.row.finalized"></i>{{scope.row.buildStatus|
                  getJobBuildStatusText}}
                </el-tag>
              </el-tooltip>
            </template>
          </el-table-column>

        </el-table>
      </el-col>
    </el-card>
  </div>
</template>

<script>

  import { getJobBuildStatusType, getJobBuildStatusText } from '@/filters/jenkins.js'

  import { queryLatestTasks } from '@api/dashboard/dashboard.js'

  export default {
    name: 'LatestTasks',
    data () {
      return {
        latestTasks: '',
        loading: false,
        timer: null // 查询定时器
      }
    },
    filters: {
      getJobBuildStatusType, getJobBuildStatusText
    },
    mounted () {
      this.fetchData()
      this.setTimer()
    },
    beforeDestroy () {
      clearInterval(this.timer) // 销毁定时器
    },
    methods: {
      setTimer () {
        if (this.timer !== null) {
          return
        }
        this.timer = setInterval(() => {
          this.fetchData()
          // console.log('开始定时...每N秒执行一次')
        }, 10000)
      },
      fetchData () {
        this.loading = true
        queryLatestTasks()
          .then(res => {
            this.latestTasks = res.body
            this.loading = false
          })
      }
    }
  }
</script>

<style>
  .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
