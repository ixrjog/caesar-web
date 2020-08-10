<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" :before-close="closeDialog" width="60%">
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
          </el-form-item>
        </el-form>
        <div style="width:100%;text-align:center">
          <el-button size="mini" type="primary" @click="handlerBuild" icon="fa fa-play" :loading="building" :disabled="building">执行任务</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="构建详情" name="details">
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="工作引擎">{{props.row.jobEngine.jenkinsInstance.name}}</el-form-item>
                <el-form-item label="引擎构建编号">{{props.row.engineBuildNumber}}</el-form-item>
                <el-form-item label="描述">{{props.row.comment}}</el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="jobBuildNumber" label="构建编号" width="100px">
          </el-table-column>
          <el-table-column prop="branch" label="构建分支">
            <template slot-scope="scope">
              <i class="fa fa-code-fork" style="margin-right: 2px"></i>
              <b>{{scope.row.branch}}</b>
            </template>
          </el-table-column>
          <el-table-column label="详情">
            <template slot-scope="scope">
              <el-tag disable-transitions :type="scope.row.buildStatus | getJobBuildStatusType ">{{scope.row.buildStatus
                | getJobBuildStatusText}}
              </el-tag>
              <el-divider><i class="el-icon-time" aria-hidden="true"></i></el-divider>
              <div>开始时间: {{scope.row.startTime}}</div>
              <div>结束时间: {{scope.row.endTime}}</div>
              <el-divider><i class="fa fa-comment-o" aria-hidden="true"></i></el-divider>
<!--              变更详情-->
              <div class="tag-group">
                <div v-for="item in scope.row.changes" :key="item.id">
                  <el-tooltip class="item" effect="light" :content="item.ossUrl" placement="top-start">
                    <el-tag style="margin-left: 5px" type="primary">{{ item.artifactFileName }}</el-tag>
                  </el-tooltip>
                  <el-tooltip class="item" effect="light" content="文件大小" placement="top-start">
                    <el-tag style="margin-left: 5px" type="primary">{{ item.artifactFileSize }}</el-tag>
                  </el-tooltip>
                </div>
              </div>
              <el-divider><i class="el-icon-folder" aria-hidden="true"></i></el-divider>
<!--              产出物详情-->
              <div class="tag-group">
                <div v-for="item in scope.row.artifacts" :key="item.id">
                  <el-tooltip class="item" effect="light" :content="item.ossUrl" placement="top-start">
                    <el-tag style="margin-left: 5px" type="primary">{{ item.artifactFileName }}</el-tag>
                  </el-tooltip>
                  <el-tooltip class="item" effect="light" content="文件大小" placement="top-start">
                    <el-tag style="margin-left: 5px" type="primary">{{ item.artifactFileSize }}</el-tag>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180">
            <template slot-scope="scope">
              <el-button-group style="margin-right: 5px">
                <el-button type="primary" icon="fa fa-stop"
                           @click="handlerSelRow(scope.row)"></el-button>
                <el-button type="primary" icon="fa fa-search" @click="handlerRowOpenBuildUrl(scope.row)">
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background @current-change="paginationCurrentChange"
                       :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                       layout="sizes, prev, pager, next" :total="pagination.total"
                       :current-page="pagination.currentPage"
                       :page-size="pagination.pageSize">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>

    <el-divider></el-divider>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
      <!--      <el-button size="mini" type="primary" @click="handlerBuild">确定</el-button>-->
    </div>
  </el-dialog>
</template>

<script>

  import { mapState, mapActions } from 'vuex'

  // Filters
  import { getJobBuildStatusType, getJobBuildStatusText } from '@/filters/jenkins.js'

  import { queryCiJobBuildPage, buildCiJob } from '@api/build/job.build.js'
  import { queryApplicationSCMMemberBranch } from '@api/application/application.js'
  import { addCiJob, updateCiJob } from '@api/application/ci.job.js'

  export default {
    data () {
      return {
        title: 'HTML5构建',
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
        branchOptions: [],
        branchesLoading: false,
        tableData: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        building: false
      }
    },
    name: 'JobH5BuildDialog',
    props: ['formStatus'],
    components: {},
    filters: {
      getJobBuildStatusType, getJobBuildStatusText
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    mounted () {
    },
    methods: {
      ...mapActions({
        setPageSize: 'd2admin/user/set'
      }),
      handleSizeChange (size) {
        this.pagination.pageSize = size
        this.info.pageSize = size
        this.setPageSize(this.info)
        this.fetchData()
      },
      initPageSize () {
        if (typeof (this.info.pageSize) !== 'undefined') {
          this.pagination.pageSize = this.info.pageSize
        }
      },
      closeDialog () {
        this.$emit('closeDialog')
      },
      initData (application, ciJob) {
        this.activeName = 'build'
        this.application = application
        this.ciJob = ciJob
        this.getBranches()
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
      handlerRowOpenBuildUrl (row) {
        window.open(row.jobBuildUrl)
      },
      handlerBuild () {
        this.building = true
        let requestBody = {
          'ciJobId': this.ciJob.id,
          'branch': this.ciJob.branch,
          'versionName': '',
          'versionDesc': '',
          'paramMap': {}
        }
        buildCiJob(requestBody)
          .then(res => {
            if(res.success){
              this.$message({
                type: 'success',
                message: '任务执行中!'
              })
            }else{
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
        this.loading = true
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
    margin: 5px 0;
  }

</style>
