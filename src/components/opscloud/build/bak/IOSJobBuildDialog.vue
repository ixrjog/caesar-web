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
              <!--              版本-->
              <build-version :versionName="scope.row.versionName" :versionDesc="scope.row.versionDesc"
                             :buildStatus="scope.row.buildStatus"></build-version>
              <!--              commit-->
              <build-commit :commit="scope.row.commitDetails"></build-commit>
              <!--              变更详情-->
              <build-changes :changes="scope.row.changes"></build-changes>
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

    <el-divider></el-divider>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

  // Component
  import ExecuteCommit from '@/components/opscloud/build/execute/ExecuteCommit'
  import BuildCommit from '@/components/opscloud/build/summary/BuildCommit'
  import BuildUser from '@/components/opscloud/build/summary/BuildUser'
  import BuildTimes from '@/components/opscloud/build/summary/BuildTimes'
  import BuildArtifacts from '@/components/opscloud/build/summary/BuildArtifacts'
  import BuildExecutors from '@/components/opscloud/build/summary/BuildExecutors'
  import BuildChanges from '@/components/opscloud/build/summary/BuildChanges'
  import BuildVersion from '@/components/opscloud/build/summary/BuildVersion'
  import BuildBranch from '@/components/opscloud/build/summary/BuildBranch'
  import BuildStatus from '@/components/opscloud/build/summary/BuildStatus'
  import BuildOperation from '@/components/opscloud/build/operation/BuildOperation'

  import { queryCiJobBuildPage, buildCiJob } from '@api/build/job.build.js'
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
        operationOption: {
          buildType: 'IOS_BUILD',
          showBuildDetails: true
        },
        timer: null // 查询定时器
      }
    },
    name: 'IOSJobBuildDialog',
    props: ['formStatus'],
    components: {
      ExecuteCommit,
      BuildCommit,
      BuildUser,
      BuildTimes,
      BuildArtifacts,
      BuildExecutors,
      BuildChanges,
      BuildVersion,
      BuildStatus,
      BuildBranch,
      BuildOperation
    },
    filters: {
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
