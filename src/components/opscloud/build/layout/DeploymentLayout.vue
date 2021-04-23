<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="执行部署" name="deploy">
      <el-form :model="deploymentJob">
        <el-form-item label="任务名称" :label-width="labelWidth">
          <el-input v-model="deploymentJob.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="发布版本" :label-width="labelWidth" required>
          <el-select v-model="buildId" placeholder="选择构件版本" :loading="loadArtifacts"
                     :disabled="artifactOptions.length === 0">
            <el-option
              v-for="item in artifactOptions"
              :key="item.id"
              :label="item.versionName"
              :value="item.id"
              :disabled="item.noArtifact">
              <span style="float: left">{{item.versionName}}</span>
              <span
                style="float: right; color: #8492a6; font-size: 13px; margin-left: 10px">#{{ item.jobBuildNumber}} {{ item.endTime }}({{ item.ago }})</span>
            </el-option>
          </el-select>
        </el-form-item>
        <slot name="customParameters">
          <!--自定义参数插槽-->
        </slot>
      </el-form>
      <div style="width:100%;text-align:center">
        <el-button size="mini" type="primary" @click="handlerBuild" icon="fa fa-play" :loading="building"
                   :disabled="building">执行任务
        </el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="构建详情" name="details">
      <el-button size="mini" type="primary" @click="fetchData">刷新</el-button>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="jobBuildNumber" label="构建编号" width="100px">
        </el-table-column>
        <el-table-column prop="branch" label="构建分支" width="150px" v-if="false">
          <template slot-scope="scope">
            <build-branch :branch="scope.row.branch"></build-branch>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">
            <build-status :build="scope.row"></build-status>
          </template>
        </el-table-column>
        <el-table-column label="详情">
          <template slot-scope="scope">
            <build-user :user="scope.row.user" :ago="scope.row.ago"></build-user>
            <build-times :buildTime="scope.row.buildTime" :startTime="scope.row.startTime"
                         :endTime="scope.row.endTime"></build-times>
            <!--              主机分组-->
            <build-host-pattern :hostPattern="scope.row.hostPattern"></build-host-pattern>
            <!--              部署服务器-->
            <build-servers :servers="scope.row.servers"></build-servers>
            <!--              产出物详情-->
            <build-artifacts :artifacts="scope.row.artifacts"></build-artifacts>
            <!--              工作节点-->
            <build-executors :executors="scope.row.executors"></build-executors>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <build-operation :build="scope.row" :option="operationOption"></build-operation>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @current-change="paginationCurrentChange"
                     layout="prev, pager, next" :total="pagination.total"
                     :current-page="pagination.currentPage"
                     :page-size="pagination.pageSize">
      </el-pagination>
    </el-tab-pane>
  </el-tabs>

</template>

<script>

  // Component
  import buildUser from '@/components/opscloud/build/summary/BuildUser'
  import buildTimes from '@/components/opscloud/build/summary/BuildTimes'
  import buildArtifacts from '@/components/opscloud/build/summary/BuildArtifacts'
  import buildExecutors from '@/components/opscloud/build/summary/BuildExecutors'
  import buildChanges from '@/components/opscloud/build/summary/BuildChanges'
  import buildHostPattern from '@/components/opscloud/build/summary/BuildHostPattern'
  import buildServers from '@/components/opscloud/build/summary/BuildServers'
  import buildStatus from '@/components/opscloud/build/summary/BuildStatus'
  import buildOperation from '@/components/opscloud/build/operation/BuildOperation'
  import buildBranch from '@/components/opscloud/build/summary/BuildBranch'

  import {
    queryCdJobBuildPage, buildCdJob, queryCiJobBuildArtifact, queryCdJobHostPatternByJobId
  } from '@api/build/job.build.js'

  export default {
    name: 'DeploymentLayout',
    props: ['title', 'application', 'deploymentJob', 'operationOption'],
    data () {
      return {
        activeName: 'deploy',
        labelWidth: '150px',
        options: {
          stripe: true
        },
        queryParam: {
          queryName: ''
        },
        buildId: '',
        buildParam: {
          versionName: '',
          versionDesc: '',
          paramMap: {}
        },
        loadArtifacts: false,
        artifactOptions: [],
        tableData: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 5,
          total: 0
        },
        building: false
      }
    },
    components: {
      buildUser,
      buildTimes,
      buildArtifacts,
      buildExecutors,
      buildChanges,
      buildHostPattern,
      buildServers,
      buildStatus,
      buildOperation,
      buildBranch
    },
    methods: {
      getBuildArtifact () {
        this.loadArtifacts = true
        let requestBody = {
          'ciJobId': this.deploymentJob.ciJobId,
          'size': 10
        }
        queryCiJobBuildArtifact(requestBody)
          .then(res => {
            this.artifactOptions = res.body
            if (this.artifactOptions !== null && this.artifactOptions.length > 0) {
              // 选中最新构件
              this.buildId = this.artifactOptions[0].id
            }
            this.loadArtifacts = false
          })
      },
      init () {
        this.activeName = 'deploy'
        this.buildId = ''
        this.artifactOptions = []
        this.fetchData()
        this.getBuildArtifact()
      },
      setParamMap (key, value) {
        this.buildParam.paramMap[key] = value
      },
      handlerBuild () {
        if (this.buildId === '') {
          this.$message({
            message: '未选中部署构建',
            type: 'warning'
          })
          return
        }
        let result = {}
        this.$emit('checkParam', this.buildParam.paramMap, val => {
          result = val
        })
        if (!result.success) {
          this.$message({
            message: result.message,
            type: result.type
          })
          return
        }
        let requestBody = {
          'cdJobId': this.deploymentJob.id,
          'ciBuildId': this.buildId,
          'versionName': this.buildParam.versionName,
          'versionDesc': this.buildParam.versionDesc,
          'paramMap': this.buildParam.paramMap
        }
        this.building = false
        buildCdJob(requestBody)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '任务执行中!'
              })
            } else {
              this.$message.error(res.msg)
            }
            this.building = false
          })
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        if (this.tableData.length === 0) {
          this.loading = true
        }
        let requestBody = {
          'cdJobId': this.deploymentJob.id,
          'queryName': this.queryParam.queryName,
          'extend': 1,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryCdJobBuildPage(requestBody)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
          })
      }
    }
  }
</script>

<style scoped>

</style>
