<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="60%" @before-close="closeDialog">
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
            <el-select v-model.trim="ciJob.branch" filterable style="width: 500px">
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
            <execute-commit style="margin-top: 10px" v-if="commit !== ''" :commit="commit"></execute-commit>
          </el-form-item>
          <el-form-item label="质量管理" :label-width="labelWidth" v-show="ciJob.enableSonar">
            <el-checkbox v-model="buildParam.isSonar">本次构建启用Sonar扫描</el-checkbox>
          </el-form-item>
          <el-form-item label="版本名称" :label-width="labelWidth">
            <el-input v-model="buildParam.versionName" placeholder="留空自动生成版本号"></el-input>
          </el-form-item>
          <el-form-item label="版本说明" :label-width="labelWidth">
            <el-input v-model="buildParam.versionDesc"></el-input>
          </el-form-item>
          <el-form-item label="通知静默" :label-width="labelWidth">
            <el-checkbox v-model="buildParam.isSilence">本次构建不发送钉钉通知</el-checkbox>
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
                <build-times :buildTime="scope.row.buildTime" :startTime="scope.row.startTime"
                             :endTime="scope.row.endTime"></build-times>
              </el-row>
              <el-divider></el-divider>
              <!--              版本-->
              <el-row>
                <build-verison :versionName="scope.row.versionName" :versionDesc="scope.row.versionDesc" :isRollback="scope.row.isRollback"
                               :buildStatus="scope.row.buildStatus"></build-verison>
              </el-row>
              <el-divider></el-divider>
              <!--              commit-->
              <el-row>
                <build-commit :commit="scope.row.commitDetails"></build-commit>
              </el-row>
              <el-divider></el-divider>
              <!--              变更详情-->
              <el-row>
                <build-changes :changes="scope.row.changes"></build-changes>
              </el-row>
              <el-divider></el-divider>
              <!--              产出物详情-->
              <el-row>
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
                <el-tooltip class="item" effect="light" content="回滚当前任务版本" placement="top"
                            v-if="scope.row.supportRollback && scope.row.finalized && scope.row.buildStatus === 'SUCCESS'">
                  <el-button type="primary" icon="fa fa-undo"
                             :loading="rollbacking"
                             @click="handlerRollback(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="打开构建任务详情" placement="top">
                  <el-button type="primary" icon="el-icon-position" @click="handlerRowOpenBuildUrl(scope.row)">
                  </el-button>
                </el-tooltip>
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
  import ExecuteCommit from '@/components/opscloud/build/execute/ExecuteCommit'
  import BuildCommit from '@/components/opscloud/build/summary/BuildCommit'
  import BuildUser from '@/components/opscloud/build/summary/BuildUser'
  import BuildTimes from '@/components/opscloud/build/summary/BuildTimes'
  import BuildArtifacts from '@/components/opscloud/build/summary/BuildArtifacts'
  import BuildExecutors from '@/components/opscloud/build/summary/BuildExecutors'
  import BuildChanges from '@/components/opscloud/build/summary/BuildChanges'
  import BuildVerison from '@/components/opscloud/build/summary/BuildVersion'

  // Filters
  import { getJobBuildStatusType, getJobBuildStatusText } from '@/filters/jenkins.js'

  import { queryCiJobBuildPage, buildCiJob, queryCiJobBuildByBuildId } from '@api/build/job.build.js'
  import {
    queryApplicationSCMMemberBranch,
    queryApplicationSCMMemberBranchCommit
  } from '@api/application/application.js'

  export default {
    data () {
      return {
        title: 'Java构建',
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
          isSilence: false,
          isSonar: null,
          paramMap: {}
        },
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
        rollbacking: false,
        commitLoading: false,
        commit: '',
        timer: null // 查询定时器
      }
    },
    name: 'JobJavaBuildDialog',
    props: ['formStatus'],
    components: {
      ExecuteCommit,
      BuildCommit,
      BuildUser,
      BuildTimes,
      BuildArtifacts,
      BuildExecutors,
      BuildChanges,
      BuildVerison
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
      initData (application, ciJob) {
        this.activeName = 'build'
        this.application = application
        this.ciJob = ciJob
        this.commit = ''
        this.getBranches()
        this.setTimer()
        this.fetchData()
        if (ciJob.parameters.isSonar !== null) {
          if (ciJob.parameters.isSonar === 'true') {
            this.buildParam.isSonar = true
          } else {
            this.buildParam.isSonar = false
          }
        }
      },
      getBranches () {
        this.branchesLoading = true
        let requestBody = {
          'ciJobId': this.ciJob.id,
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
      handlerRollback (row) {
        // 回滚操作
        this.$confirm('确定回滚当前版本?')
          .then(_ => {
            this.rollbacking = true
            let paramMap = {
              rollbackJobBuildId: row.id
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
      handlerRowOpenBuildUrl (row) {
        util.open(row.jobBuildUrl)
      },
      handlerBuild () {
        this.building = true
        let requestBody = {
          'ciJobId': this.ciJob.id,
          'branch': this.ciJob.branch,
          'versionName': this.buildParam.versionName,
          'versionDesc': this.buildParam.versionDesc,
          'isSilence': this.buildParam.isSilence,
          'paramMap': {}
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
