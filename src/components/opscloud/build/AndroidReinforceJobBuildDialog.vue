<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="50%" @before-close="closeDialog">
    <el-tabs v-model="activeName">
      <el-tab-pane label="执行加固" name="reinforce">
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
                :value="item.id">
                <span style="float: left">{{item.versionName}}</span>
                <span
                  style="float: right; color: #8492a6; font-size: 13px; margin-left: 10px">#{{ item.jobBuildNumber}} {{ item.endTime }}({{ item.ago }})</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="构建渠道" :label-width="labelWidth">
            <el-select v-model.trim="channelType" placeholder="选择类型">
              <el-option
                v-for="item in channelTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择渠道" :label-width="labelWidth" v-show="channelType !== 0">
            <el-select v-model="channelGroup" placeholder="选择类型" multiple style="width: 100%">
              <el-option
                v-for="item in channelGroupOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本名称" :label-width="labelWidth">
            <el-input v-model="buildParam.versionName" placeholder="留空自动生成版本号"></el-input>
          </el-form-item>
          <el-form-item label="版本说明" :label-width="labelWidth">
            <el-input v-model="buildParam.versionDesc"></el-input>
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
                <el-col :span="22">
                  <el-tooltip class="item" effect="light" :content="scope.row.user.email" placement="top-start">
                    <el-tag disable-transitions type="primary">{{scope.row.user.displayName}}
                    </el-tag>
                  </el-tooltip>
                  <span style="margin-left: 5px">{{scope.row.ago}}</span>
                </el-col>
                <el-col :span="2">
                  <el-tooltip class="item" effect="light" content="执行人" placement="top-start">
                    <i class="el-icon-user" aria-hidden="true"></i>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-divider></el-divider>
              <el-row>
                <el-col :span="22">
                  <div>构建时长: {{scope.row.buildTime}}</div>
                  <div>开始时间: {{scope.row.startTime}}</div>
                  <div>结束时间: {{scope.row.endTime}}</div>
                </el-col>
                <el-col :span="2">
                  <el-tooltip class="item" effect="light" content="构建时间" placement="top-start">
                    <i class="el-icon-time" aria-hidden="true"></i>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-divider></el-divider>
              <!--              产出物详情-->
              <el-row>
                <el-col :span="22">
                  <div class="tag-group" v-show="scope.row.artifacts.length > 0">
                    <div v-for="item in scope.row.artifacts" :key="item.id">
                      <el-tooltip class="item" effect="light" :content="item.ossUrl" placement="top-start">
                        <el-tag type="primary">{{ item.artifactFileName }}</el-tag>
                      </el-tooltip>
                      <el-tooltip class="item" effect="light" content="文件大小" placement="top-start">
                        <el-tag style="margin-left: 5px" type="primary">{{ item.artifactFileSize }}</el-tag>
                      </el-tooltip>
                    </div>
                  </div>
                  <span v-show="scope.row.artifacts.length === 0">No Artifacts</span>
                </el-col>
                <el-col :span="2">
                  <el-tooltip class="item" effect="light" content="产出物" placement="top-start">
                    <i class="el-icon-folder" aria-hidden="true"></i>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-divider></el-divider>
              <!--              工作节点-->
              <el-row>
                <el-col :span="22">
                  <div class="tag-group" v-show="scope.row.executors.length > 0">
                    <div v-for="item in scope.row.executors" :key="item.id">
                      <el-tag type="primary">{{ item.nodeName }}:{{ item.privateIp}}</el-tag>
                    </div>
                  </div>
                  <span v-show="scope.row.executors.length === 0">No Executors</span>
                </el-col>
                <el-col :span="2">
                  <el-tooltip class="item" effect="light" content="工作节点" placement="top-start">
                    <i class="fa fa-television" aria-hidden="true"></i>
                  </el-tooltip>
                </el-col>
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
  // Filters
  import { getJobBuildStatusType, getJobBuildStatusText } from '@/filters/jenkins.js'

  import { queryCdJobBuildPage, buildCdJob, queryCiJobBuildArtifact } from '@api/build/job.build.js'


  const channelTypeOptions = [
    {
      value: 0,
      label: '全渠道'
    },
    {
      value: 1,
      label: '选择渠道'
    }
  ]

  const channelGroupOptions = [
    {
      value: 'yyb',
      label: '应用宝'
    },
    {
      value: 'huawei',
      label: '华为'
    },
    {
      value: 'xiaomi',
      label: '小米'
    },
    {
      value: 'oppo',
      label: 'OPPO'
    },
    {
      value: 'vivo',
      label: 'VIVO'
    },
    {
      value: 'baidu',
      label: '百度'
    },
    {
      value: 'bmhy',
      label: '斑马会员'
    },
    {
      value: 'ceshi',
      label: '测试渠道'
    }
  ]

  export default {
    data () {
      return {
        title: 'Android加固任务',
        activeName: 'reinforce',
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
        channelType: '',
        channelGroup: [],
        channelTypeOptions: channelTypeOptions,
        channelGroupOptions: channelGroupOptions,
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
    name: 'AndroidReinforceJobBuildDialog',
    props: ['formStatus'],
    components: {},
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
      initData (application, cdJob) {
        this.activeName = 'reinforce'
        this.buildId = ''
        this.application = application
        this.cdJob = cdJob
        // 初始化参数
        this.channelType = 0
        this.channelGroup = []
        this.setTimer()
        this.fetchData()
        this.getBuildArtifact()
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
        this.buildParam.paramMap['channelType'] = this.channelType
        if (this.channelType !== 0) {
          this.buildParam.paramMap['channelGroup'] = JSON.stringify(this.channelGroup)
        }
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
