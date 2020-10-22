<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="50%" @before-close="closeDialog">
    <el-tabs v-model="activeName">
      <el-tab-pane label="执行构建" name="build">
        <!--        <el-divider></el-divider>-->
        <el-form :model="ciJob">
          <el-form-item label="任务名称" :label-width="labelWidth">
            <el-input v-model="ciJob.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="仓库" :label-width="labelWidth">
            <!--            :disabled="!formStatus.operationType"-->
            <el-select v-model.trim="ciJob.scmMemberId" style="width: 500px" disabled>
              <el-option
                v-for="item in application.scmMembers"
                :key="item.id"
                :label="item.scmSshUrl"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分支" :label-width="labelWidth" required>
            <el-select v-model.trim="ciJob.branch" style="width: 500px">
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
            <el-button size="mini" type="primary" style="margin-left: 5px" @click="getBranches"
                       :loading="branchesLoading"><i class="fa fa-refresh" aria-hidden="true"></i></el-button>
            <el-button size="mini" type="primary" style="margin-left: 5px" @click="getCommit"
                       :loading="commitLoading"><i class="fa fa-info" aria-hidden="true"></i></el-button>
          </el-form-item>
          <el-form-item label="commit" :label-width="labelWidth" v-show="commit !== ''">
            <el-card shadow="naver">
              <div><span style="color: #99a9bf">id : </span>{{commit.id}}</div>
              <div><span style="color: #99a9bf">message : </span>{{commit.message}}</div>
            </el-card>
          </el-form-item>
          <el-form-item label="构建类型" :label-width="labelWidth">
            <el-select v-model="buildParam.paramMap.buildType" placeholder="选择类型">
              <el-option
                v-for="item in buildTypeOptions"
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
              <!--              变更详情11-->
              <el-row>
                <el-col :span="22">
                  <div class="tag-group" v-show="scope.row.changes !== null && scope.row.changes.length > 0">
                    <div v-for="item in scope.row.changes" :key="item.id">
                      <el-tooltip class="item" effect="light" :content="item.commitId" placement="top-start">
                        <el-tag type="primary">{{ item.shortCommitId }}</el-tag>
                      </el-tooltip>
                      <el-tag style="margin-left: 5px" type="primary">{{ item.commitMsg }}</el-tag>
                    </div>
                  </div>
                  <span v-show="scope.row.changes === null || scope.row.changes.length === 0">No Changes</span>
                </el-col>
                <el-col :span="2">
                  <el-tooltip class="item" effect="light" content="变更详情" placement="top-start">
                    <i class="fa fa-comment-o" aria-hidden="true"></i>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-divider></el-divider>
              <!--              产出物详情-->
              <el-row>
                <el-col :span="22">
                  <div class="tag-group" v-show="scope.row.artifacts !== null">
                    <div v-for="item in scope.row.artifacts" :key="item.id">
                      <el-tooltip class="item" effect="light" :content="item.ossUrl" placement="top-start">
                        <el-tag type="primary">{{ item.artifactFileName }}</el-tag>
                      </el-tooltip>
                      <el-tooltip class="item" effect="light" content="文件大小" placement="top-start">
                        <el-tag style="margin-left: 5px" type="primary">{{ item.artifactFileSize }}</el-tag>
                      </el-tooltip>
                    </div>
                  </div>
                  <span v-show="scope.row.artifacts === null">No Artifacts</span>
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
                  <div class="tag-group" v-show="scope.row.executors !== null">
                    <div v-for="item in scope.row.executors" :key="item.id">
                      <el-tag type="primary">{{ item.nodeName }}:{{ item.privateIp}}</el-tag>
                    </div>
                  </div>
                  <span v-show="scope.row.executors === null">No Executors</span>
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
                           @click="handlerRowAbortBuild(scope.row)"></el-button>
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

  import { queryCiJobBuildPage, buildCiJob, queryCiJobBuildByBuildId, abortBuildCiJob } from '@api/build/job.build.js'
  import {
    queryApplicationSCMMemberBranch,
    queryApplicationSCMMemberBranchCommit
  } from '@api/application/application.js'

  const buildTypeOptions = [{
    value: 'alpha',
    label: 'alpha'
  }, {
    value: 'release',
    label: 'release'
  }]


  export default {
    data () {
      return {
        title: 'iOS构建',
        activeName: 'build',
        application: '',
        ciJob: '',
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
        buildTypeOptions: buildTypeOptions,
        branchOptions: [],
        branchesLoading: false,
        tableData: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 5,
          total: 0
        },
        building: false,
        commitLoading: false,
        commit: '',
        timer: null // 查询定时器
      }
    },
    name: 'IOSJobBuildDialog',
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
      initData (application, ciJob) {
        this.activeName = 'build'
        this.application = application
        this.ciJob = ciJob
        this.commit = ''
        this.buildParam.paramMap.buildType = this.ciJob.parameters.buildType
        this.getBranches()
        this.setTimer()
        this.fetchData()
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
      getCommit () {
        this.commitLoading = true
        let requestBody = {
          'scmMemberId': this.ciJob.scmMemberId,
          'branch': this.ciJob.branch
        }
        queryApplicationSCMMemberBranchCommit(requestBody)
          .then(res => {
            this.commit = res.body
            this.commitLoading = false
          })
      },
      handlerRowAbortBuild (row) {
        abortBuildCiJob(row.id)
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
      handlerRowOpenBuildUrl (row) {
        window.open(row.jobBuildUrl)
      },
      handlerRowOpenBuildDetails (row) {
        let host = window.location.host
        let httpProtocol = window.location.href.split('://')[0]
        let buildDetailsUrl = httpProtocol + '://' + host + '/#/job/build/ios?buildId=' + row.id
        util.open(buildDetailsUrl)
        //window.open(buildDetailsUrl )
      },
      handlerBuild () {
        this.building = true
        let requestBody = {
          'ciJobId': this.ciJob.id,
          'branch': this.ciJob.branch,
          'versionName': this.buildParam.versionName,
          'versionDesc': this.buildParam.versionDesc,
          'paramMap': this.buildParam.paramMap
        }
        buildCiJob(requestBody)
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
          'ciJobId': this.ciJob.id,
          'queryName': this.queryParam.queryName,
          'extend': 1,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryCiJobBuildPage(requestBody)
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
