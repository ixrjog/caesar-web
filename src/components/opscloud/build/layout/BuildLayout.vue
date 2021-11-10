<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="执行构建" name="build">
      <el-form :model="buildJob">
        <el-form-item label="任务名称" :label-width="labelWidth">
          <el-input v-model="buildJob.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="仓库" :label-width="labelWidth">
          <el-select v-model.trim="buildJob.scmMemberId" style="width: 500px" disabled>
            <el-option v-for="item in application.scmMembers" :key="item.id" :label="item.scmSshUrl" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分支" :label-width="labelWidth" required>
          <el-select v-model.trim="buildJob.branch" filterable style="width: 500px">
            <el-option-group v-for="group in branchOptions" :key="group.label" :label="group.label">
              <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-option-group>
          </el-select>
          <el-button size="mini" type="primary" style="margin-left: 5px" @click="getBranches"
                     :loading="branchesLoading"><i class="fa fa-refresh" aria-hidden="true"></i></el-button>
          <el-button size="mini" type="primary" style="margin-left: 5px" @click="getCommit"
                     :loading="commitLoading"><i class="fa fa-info" aria-hidden="true"></i></el-button>
          <execute-commit style="margin-top: 10px" v-if="commit !== ''" :commit="commit"></execute-commit>
        </el-form-item>
        <slot name="customParameters">
          <!--自定义参数插槽-->
        </slot>
        <el-form-item label="版本名称" :label-width="labelWidth">
          <el-input v-model="buildParam.versionName" placeholder="留空自动生成版本号(Andorid构建:留空自动生成`0.0.0`版本)"></el-input>
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
            <build-verison :versionName="scope.row.versionName" :versionDesc="scope.row.versionDesc"
                           :isRollback="scope.row.isRollback"
                           :buildStatus="scope.row.buildStatus"></build-verison>
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
            <build-operation :build="scope.row" :job="buildJob" :option="operationOption"></build-operation>
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
  import executeCommit from '@/components/opscloud/build/execute/ExecuteCommit'
  import buildOperation from '@/components/opscloud/build/operation/BuildOperation'
  import buildBranch from '@/components/opscloud/build/summary/BuildBranch'
  import buildStatus from '@/components/opscloud/build/summary/BuildStatus'
  // Summary
  import buildUser from '@/components/opscloud/build/summary/BuildUser'
  import buildTimes from '@/components/opscloud/build/summary/BuildTimes'
  import buildVerison from '@/components/opscloud/build/summary/BuildVersion'
  import buildCommit from '@/components/opscloud/build/summary/BuildCommit'
  import buildChanges from '@/components/opscloud/build/summary/BuildChanges'
  import buildArtifacts from '@/components/opscloud/build/summary/BuildArtifacts'
  import buildExecutors from '@/components/opscloud/build/summary/BuildExecutors'

  import { queryCiJobBuildPage, buildCiJob } from '@api/build/job.build.js'
  import {
    queryApplicationSCMMemberBranch,
    queryApplicationSCMMemberBranchCommit
  } from '@api/application/application.js'

  export default {
    data () {
      return {
        activeName: 'build',
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
        commitLoading: false,
        commit: ''
      }
    },
    name: 'BuildDialogTemplate',
    props: ['title', 'application', 'buildJob', 'operationOption'],
    components: {
      executeCommit,
      buildOperation,
      buildBranch,
      buildStatus,
      buildUser,
      buildTimes,
      buildVerison,
      buildCommit,
      buildChanges,
      buildArtifacts,
      buildExecutors
    },
    filters: {},
    computed: {},
    mounted () {
    },
    beforeDestroy () {
      // clearInterval(this.timer) // 销毁定时器
    },
    methods: {
      init () {
        this.activeName = 'build'
        this.commit = ''
        this.getBranches()
        this.fetchData()
        if (this.buildJob.parameters.isSonar !== null) {
          this.buildParam.isSonar = this.buildJob.parameters.isSonar === 'true'
        }
      },
      setParamMap (key, value) {
        this.buildParam.paramMap[key] = value
      },
      getBranches () {
        this.branchesLoading = true
        let requestBody = {
          'ciJobId': this.buildJob.id,
          'scmMemberId': this.buildJob.scmMemberId,
          'enableTag': this.buildJob.enableTag
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
          'scmMemberId': this.buildJob.scmMemberId,
          'branch': this.buildJob.branch
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
          'ciJobId': this.buildJob.id,
          'branch': this.buildJob.branch,
          'versionName': this.buildParam.versionName,
          'versionDesc': this.buildParam.versionDesc,
          'isSilence': this.buildParam.isSilence,
          'isSonar': this.buildParam.isSonar,
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
          'ciJobId': this.buildJob.id,
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
