<template>
  <div>
    <el-row style="margin-bottom: 5px" :gutter="24">
      <el-input v-model.trim="queryParam.queryName" placeholder="输入任务名称查询"></el-input>
      <el-checkbox v-model="queryParam.showHide" @change="fetchData">显示隐藏任务</el-checkbox>
      <el-button @click="fetchData" style="margin-left: 5px" :disabled="application === ''">查询</el-button>
      <el-button @click="handlerAdd" style="margin-left: 5px" :disabled="application === ''">新建任务</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="任务名称">
        <template slot-scope="props">
          <el-tooltip class="item" effect="light" :content="props.row.jobKey" placement="top-start">
            <span>{{ props.row.name }}</span>
          </el-tooltip>
          <span class="tag-group">
              <span v-for="item in props.row.tags" :key="item.id">
                <el-tooltip class="item" effect="light" :content="item.comment" placement="top-start">
                  <el-tag style="margin-left: 5px" :style="{ color: item.color }">{{ item.tagKey }}</el-tag>
                </el-tooltip>
              </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="branch" label="首选分支" width="110">
        <template slot-scope="scope">
          <i class="fa fa-code-fork" style="margin-right: 2px"></i>
          <b>{{scope.row.branch}}</b>
        </template>
      </el-table-column>
      <el-table-column prop="sonarQube" label="代码质量" width="210">
        <template slot-scope="scope">
          <div v-if="scope.row.enableSonar && JSON.stringify(scope.row.sonarQube.measures) != '{}'">
            <sonar-popover :sonarQube="scope.row.sonarQube"></sonar-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="env" label="环境" width="80">
        <template slot-scope="scope">
          <el-tag disable-transitions :style="{ color: scope.row.env.color }">{{scope.row.env.envName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="最新构建" width="210">
        <template slot-scope="props">
          <build-view :items="props.row.buildViews" @handlerOpenExecutor="handlerOpenExecutor"
                      @handlerOpenOutput="handlerOpenOutput"></build-view>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="210">
        <template slot-scope="scope">
          <el-button-group style="margin-right: 5px">
            <el-button type="primary" icon="fa fa-play"
                       @click="handlerRowRunBuild(scope.row)"></el-button>
            <el-button type="primary" icon="fa fa-cloud-upload" v-if="scope.row.deploymentJobId !== 0"
                       @click="handlerRowRunDeployment(scope.row)"></el-button>
          </el-button-group>
          <el-dropdown split-button type="primary" @click="handlerRowEdit(scope.row)">
            <i class="el-icon-edit"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="fa fa-plane"><span @click="handlerRowEngineEdit(scope.row)">工作引擎</span>
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-edit"><span @click="handlerRowCreateDeployment(scope.row)">新建部署</span>
              </el-dropdown-item>
              <el-dropdown-item icon="fa fa-user"><span @click="handlerRowPermissionEdit(scope.row)">权限配置</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange"
                   :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <!-- 任务编辑对话框 -->
    <ci-job-dialog ref="ciJobDialog" :formStatus="formStatus.ciJob" @closeDialog="fetchData"></ci-job-dialog>
    <cd-job-dialog ref="cdJobDialog" :formStatus="formStatus.cdJob" @closeDialog="fetchData"></cd-job-dialog>
    <!-- 引擎配置-->
    <job-engine-dialog ref="jobEngineDialog" :formStatus="formStatus.engine"></job-engine-dialog>
    <!-- 构建对话框 -->
    <java-build-dialog ref="javaBuildDialog" :formStatus="formStatus.build.java"></java-build-dialog>
    <h5-build-dialog ref="h5BuildDialog" :formStatus="formStatus.build.h5"></h5-build-dialog>
    <ios-build-dialog ref="iosBuildDialog" :formStatus="formStatus.build.ios"></ios-build-dialog>
    <android-build-dialog ref="androidBuildDialog" :formStatus="formStatus.build.android"></android-build-dialog>
    <!-- 部署对话框 -->
    <java-deployment-dialog ref="javaDeploymentDialog"
                            :formStatus="formStatus.deployment.java"></java-deployment-dialog>
    <terminal-master :formStatus="formStatus.terminal" ref="terminalMaster">
      <template :slot-scope="executor">
        <div class="tips" v-if="executor != null">
          <el-button type="text" style="margin-left: 10px; padding: 3px 0"
                     @click="handlerSendCmd()">[点击进入工作目录] `cd
            {{executor.workspace}}`
          </el-button>
        </div>
      </template>
    </terminal-master>
    <build-output ref="buildOutput" :formStatus="formStatus.buildOutput"></build-output>
    <ci-job-permission-dialog ref="ciJobPermissionDialog"
                              :formStatus="formStatus.permission"></ci-job-permission-dialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  // Component
  import terminalMaster from '@/components/opscloud/xterm/TerminalMaster'
  import CiJobDialog from '@/components/opscloud/application/CiJobDialog'
  import CdJobDialog from '@/components/opscloud/application/CdJobDialog'
  import JobEngineDialog from '@/components/opscloud/application/JobEngineDialog'
  import buildOutput from '@/components/opscloud/application/BuildOutput'
  import buildView from '@/components/opscloud/application/BuildView'
  // build
  import javaBuildDialog from '@/components/opscloud/build/JavaBuildDialog'
  import h5BuildDialog from '@/components/opscloud/build/H5BuildDialog'
  import iosBuildDialog from '@/components/opscloud/build/IOSBuildDialog'
  import androidBuildDialog from '@/components/opscloud/build/AndroidBuildDialog'
  // deployment
  import javaDeploymentDialog from '@/components/opscloud/build/JavaDeploymentDialog'

  import CiJobPermissionDialog from '@/components/opscloud/application/CiJobPermissionDialog'
  import SonarPopover from '@/components/opscloud/build/sonar/SonarPopover'

  import { queryCiJobPage } from '@api/application/ci.job.js'
  import { abortBuildCiJob } from '@api/build/job.build.js'

  export default {
    name: 'BuildJobTable',
    data () {
      return {
        application: '',
        tableData: [],
        options: {
          stripe: true
        },
        loading: false,
        executor: null,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          showHide: false,
          queryName: ''
        },
        formStatus: {
          engine: { visible: false },
          terminal: { visible: false },
          buildOutput: { visible: false },
          permission: { visible: false },
          build: {
            java: { visible: false },
            h5: { visible: false },
            ios: { visible: false },
            android: { visible: false }
          },
          deployment: {
            java: { visible: false },
            android: { visible: false }
          },
          ciJob: {
            visible: false,
            operationType: true,
            addTitle: '新增任务配置',
            updateTitle: '更新任务配置'
          },
          cdJob: {
            visible: false,
            operationType: true,
            addTitle: '新增部署任务配置',
            updateTitle: '更新部署任务配置'
          }
        },
        labelWidth: '100px'
      }
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    mounted () {
      this.initPageSize()
    },
    beforeDestroy () {
    },
    components: {
      terminalMaster,
      CiJobDialog,
      CdJobDialog,
      JobEngineDialog,
      javaBuildDialog,
      h5BuildDialog,
      iosBuildDialog,
      androidBuildDialog,
      javaDeploymentDialog,
      buildOutput,
      CiJobPermissionDialog,
      SonarPopover,
      buildView
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
      initData (application) {
        this.application = application
        this.queryParam.queryName = ''
        this.fetchData()
      },
      handlerAdd () {
        let ciJob = {
          id: '',
          applicationId: this.application.id,
          jobTpl: null,
          name: '',
          jobKey: '',
          branch: '',
          envType: 0,
          jotTplId: '',
          jobType: '',
          enableTag: false,
          enableSonar: false,
          parameterYaml: '',
          jobBuildNumber: 0,
          hide: false,
          deploymentJobId: 0,
          atAll: false,
          dingtalk: null,
          dingtalkId: '',
          bucket: null,
          ossBucketId: '',
          scmMemberId: '',
          comment: ''
        }
        this.formStatus.ciJob.operationType = true
        this.formStatus.ciJob.visible = true
        this.$refs.ciJobDialog.initData(this.application, ciJob)
      },
      handlerRowRunBuild (row) {
        switch (row.jobType) {
          case 'HTML5':
            this.formStatus.build.h5.visible = true
            this.$refs.h5BuildDialog.initData(this.application, row)
            break
          case 'JAVA':
            this.formStatus.build.java.visible = true
            this.$refs.javaBuildDialog.initData(this.application, row)
            break
          case 'IOS':
            this.formStatus.build.ios.visible = true
            this.$refs.iosBuildDialog.initData(this.application, row)
            break
          case 'ANDROID':
            this.formStatus.build.android.visible = true
            this.$refs.androidBuildDialog.initData(this.application, row)
            break
          default:
            this.$message.error('构建任务类型配置错误!')
        }
      },
      handlerRowRunDeployment (row) {
        if (row.cdJob === null) {
          this.$message.error('部署任务未创建!')
        }
        switch (row.cdJob.jobType) {
          case 'JAVA_DEPLOYMENT':
            this.formStatus.deployment.java.visible = true
            this.$refs.javaDeploymentDialog.initData(this.application, row.cdJob)
            break
          default:
            this.$message.error('部署任务类型配置错误!')
        }
      },
      handlerRowCreateDeployment (row) {
        let cdJob = {
          id: '',
          ciJobId: row.id,
          applicationId: row.applicationId,
          jobTpl: null,
          name: '',
          jobKey: '',
          envType: 0,
          jotTplId: '',
          jobType: '',
          parameterYaml: '',
          jobBuildNumber: 0,
          comment: ''
        }
        this.formStatus.cdJob.operationType = true
        this.$refs.cdJobDialog.initData(this.application, cdJob)
        this.formStatus.cdJob.visible = true
      },
      handlerRowPermissionEdit (row) {
        this.formStatus.permission.visible = true
        this.$refs.ciJobPermissionDialog.initData(Object.assign({}, row))
      },
      handlerRowEngineEdit (row) {
        let data = {
          ciJobId: row.id,
          cdJobId: row.cdJob !== null ? row.cdJob.id : null
        }
        this.formStatus.engine.visible = true
        this.$refs.jobEngineDialog.initData(data)
      },
      handlerRowEdit (row) {
        this.formStatus.ciJob.operationType = false
        this.formStatus.ciJob.visible = true
        this.$refs.ciJobDialog.initData(this.application, Object.assign({}, row))
      },
      handlerOpenExecutor (executor) {
        this.executor = executor
        this.formStatus.terminal.visible = true
        this.$refs.terminalMaster.open(executor.server)
      },
      handlerSendCmd () {
        let commandMessage = {
          data: 'cd ' + this.executor.workspace + '\n',
          status: 'COMMAND',
          instanceId: this.executor.server.name
        }
        this.$refs.terminalMaster.sendCmd(this.executor.server, commandMessage)
      },
      handlerAbortBuild (executors) {
        abortBuildCiJob(executors[0].buildId)
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
      handlerOpenOutput (executor) {
        this.formStatus.buildOutput.visible = true
        this.$refs.buildOutput.open(0, executor.buildId)
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      setRunning () {
        let args = {
          type: 0,
          isRunning: false
        }
        for (let job of this.tableData) {
          for (let view of job.buildViews) {
            if (view.building) {
              args.isRunning = true
              this.$emit('setRunning', args)
              return
            }
          }
        }
        this.$emit('setRunning', args)
      },
      fetchData () {
        if (this.application === '') return
        if (this.tableData.length === 0) this.loading = true
        let requestBody = {
          'applicationId': this.application.id,
          'queryName': this.queryParam.queryName,
          'showHide': this.queryParam.showHide,
          'extend': 1,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryCiJobPage(requestBody)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
            this.setRunning()
          })
      }
    }
  }
</script>

<style scoped>

  .el-dropdown {
    vertical-align: top;
  }

  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-input {
    display: inline-block;
    max-width: 200px;
    margin-left: 20px;
    margin-right: 10px;
  }

  .el-checkbox {
    display: inline-block;
    max-width: 200px;
  }

  .tips {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 10px 10px;
    margin-bottom: 5px;
    margin-left: 5px;
    margin-right: 15px;
  }
</style>
