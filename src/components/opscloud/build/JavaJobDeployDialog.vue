<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="50%" @before-close="closeDialog">
    <el-tabs v-model="activeName">
      <el-tab-pane label="执行部署" name="deploy">
        <!--        <el-divider></el-divider>-->
        <el-form :model="cdJob">
          <el-form-item label="任务名称" :label-width="labelWidth">
            <el-input v-model="cdJob.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="选择构件" :label-width="labelWidth">
            <el-select v-model.trim="buildId" placeholder="选择类型" :loading="loadBuildArtifact">
              <el-option
                v-for="item in buildArtifactOptions"
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
          <el-form-item label="主机分组" :label-width="labelWidth">
            <el-select v-model.trim="hostPattern" placeholder="选择类型" @change="handlerSelHostPattern">
              <el-option
                v-for="item in hostPatternOptions"
                :key="item.hostPattern"
                :label="item.hostPattern"
                :value="item.hostPattern">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主机详情" :label-width="labelWidth">
            <el-card shadow="never">
                <div v-for="server in servers" :key="server.id">
                    <el-tag style="margin-left: 5px" type="primary">{{ server.name }}-{{ server.serialNumber}} - {{ server.privateIp}}</el-tag>
                    <el-tag style="margin-left: 2px" type="success" effect="dark">{{ server.deployVersion === null ? '首次发布': server.deployVersion.versionName}}</el-tag>
                </div>
            </el-card>
          </el-form-item>
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
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="工作引擎">{{props.row.jobEngine.jenkinsInstance.name}}</el-form-item>
                <el-form-item label="引擎构建编号">{{props.row.engineBuildNumber}}</el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="jobBuildNumber" label="构建编号" width="100px">
          </el-table-column>
          <el-table-column prop="branch" label="构建分支" width="150px">
            <template slot-scope="scope">
              <i class="fa fa-code-fork" style="margin-right: 2px"></i>
              <b>{{scope.row.branch}}</b>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100px">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" :content="scope.row.buildStatus" placement="top-start">
                <el-tag disable-transitions :type="scope.row.buildStatus | getJobBuildStatusType "><i
                  class="el-icon-loading" v-show="!scope.row.finalized"></i>{{scope.row.buildStatus|
                  getJobBuildStatusText}}
                </el-tag>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="详情">
            <template slot-scope="scope">
              <el-row>
                <build-user :user="scope.row.user" :ago="scope.row.ago"></build-user>
              </el-row>
              <el-divider></el-divider>
              <el-row>
                <build-times :buildTime="scope.row.buildTime" :startTime="scope.row.startTime" :endTime="scope.row.endTime"></build-times>
              </el-row>
              <el-divider></el-divider>
              <!--              主机分组-->
              <el-row >
                <build-host-pattern :hostPattern="scope.row.hostPattern"></build-host-pattern>
              </el-row>
              <el-divider></el-divider>
              <!--              部署服务器-->
              <el-row>
                <build-servers :servers="scope.row.servers"></build-servers>
              </el-row>
              <!--              产出物详情-->
              <el-row v-if="false">
                <build-artifacts :artifacts="scope.row.artifacts"></build-artifacts>
              </el-row>
              <el-divider></el-divider>
              <!--              工作节点-->
              <el-row>
                <build-executors :executors="scope.row.executors"></build-executors>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180">
            <template slot-scope="scope">
              <el-button-group style="float: right; padding: 3px 0">
                <el-button type="primary" icon="fa fa-stop" v-if="!scope.row.finalized"
                           @click="handlerSelRow(scope.row)"></el-button>
                <el-button type="primary" icon="el-icon-position"
                           @click="handlerRowOpenBuildUrl(scope.row)"></el-button>
                <el-button type="primary" icon="fa fa-download" @click="handlerRowOpenBuildDetails(scope.row)">
                </el-button>
              </el-button-group>
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
    <el-divider></el-divider>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import util from '@/libs/util.js'
  // Component
  import BuildUser from '@/components/opscloud/build/summary/BuildUser'
  import BuildTimes from '@/components/opscloud/build/summary/BuildTimes'
  import BuildArtifacts from '@/components/opscloud/build/summary/BuildArtifacts'
  import BuildExecutors from '@/components/opscloud/build/summary/BuildExecutors'
  import BuildChanges from '@/components/opscloud/build/summary/BuildChanges'
  import BuildHostPattern from '@/components/opscloud/build/summary/BuildHostPattern'
  import BuildServers from '@/components/opscloud/build/summary/BuildServers'

  // Filters
  import { getJobBuildStatusType, getJobBuildStatusText } from '@/filters/jenkins.js'

  import {
    queryCdJobBuildPage,
    buildCdJob,
    queryCiJobBuildArtifact,
    queryCdJobHostPatternByJobId
  } from '@api/build/job.build.js'

  export default {
    data () {
      return {
        title: 'Java发布任务',
        activeName: 'deploy',
        application: '',
        cdJob: '',
        labelWidth: '150px',
        options: {
          stripe: true
        },
        queryParam: {
          queryName: ''
        },
        buildParam: {
          versionName: '',
          versionDesc: '',
          paramMap: {}
        },
        loadBuildArtifact: false,
        buildArtifactOptions: [],
        buildId: '',
        hostPattern: '',
        hostPatternOptions: [],
        servers: [],
        tableData: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 5,
          total: 0
        },
        building: false,
        timer: null // 查询定时器
      }
    },
    name: 'JavaJobDeployDialog',
    props: ['formStatus'],
    components: {
      BuildUser,
      BuildTimes,
      BuildArtifacts,
      BuildExecutors,
      BuildChanges,
      BuildHostPattern,
      BuildServers
    },
    filters: {
      getJobBuildStatusType, getJobBuildStatusText
    },
    computed: {},
    mounted () {
    },
    beforeDestroy () {
      clearInterval(this.timer) // 销毁定时器
    },
    methods: {
      closeDialog () {
        clearInterval(this.timer) // 销毁定时器
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      setTimer () {
        if (this.timer !== null) return
        this.timer = setInterval(() => {
          if (!this.formStatus.visible) return
          this.fetchData()
          // console.log('开始定时...每10秒执行一次')
        }, 5000)
      },
      getBuildArtifact () {
        this.loadBuildArtifact = true
        let requestBody = {
          'ciJobId': this.cdJob.ciJobId,
          'size': 10
        }
        queryCiJobBuildArtifact(requestBody)
          .then(res => {
            this.buildArtifactOptions = res.body
            if (res.body !== null && res.body.length > 0) {
              this.buildId = res.body[0].id
            }
            this.loadBuildArtifact = false
          })
      },
      getHostPattern () {
        queryCdJobHostPatternByJobId(this.cdJob.id)
          .then(res => {
            if (res.success) {
              this.hostPatternOptions = res.body
              this.handlerSelHostPattern()
            }
          })
      },
      initData (application, cdJob) {
        this.activeName = 'deploy'
        this.buildId = ''
        this.application = application
        this.cdJob = cdJob
        this.hostPatternOptions = []
        this.servers = []
        this.server = ''
        this.hostPattern = ''
        // 初始化参数
        if (cdJob.parameters.hostPattern !== null) {
          this.hostPattern = cdJob.parameters.hostPattern
        }
        this.setTimer()
        this.fetchData()
        this.getBuildArtifact()
        this.getHostPattern()
      },
      handlerSelHostPattern () {
        this.servers = []
        for (let hostPattern of this.hostPatternOptions) {
          if (hostPattern.hostPattern === this.hostPattern) {
            this.servers = hostPattern.servers
            break
          }
        }
      },
      handlerRowOpenBuildUrl (row) {
        window.open(row.jobBuildUrl)
      },
      handlerRowOpenBuildDetails (row) {
        let host = window.location.host
        let httpProtocol = window.location.href.split('://')[0]
        let buildDetailsUrl = httpProtocol + '://' + host + '/#/job/build/android/reinforce?buildId=' + row.id
        util.open(buildDetailsUrl)
        //window.open(buildDetailsUrl)
      },
      handlerBuild () {
        this.building = true
        this.buildParam.paramMap.hostPattern = this.hostPattern // 服务器分组
        let requestBody = {
          'cdJobId': this.cdJob.id,
          'ciBuildId': this.buildId,
          'versionName': this.buildParam.versionName,
          'versionDesc': this.buildParam.versionDesc,
          'paramMap': this.buildParam.paramMap
        }
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
          'cdJobId': this.cdJob.id,
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

<style>
  .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 10px 0;
  }

</style>
