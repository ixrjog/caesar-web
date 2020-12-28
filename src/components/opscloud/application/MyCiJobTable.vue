<template>
  <div>
    <el-row style="margin-bottom: 5px" :gutter="24">
      <el-input v-model.trim="application.name" disabled placeholder="应用名称" class="input">
      </el-input>
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
      <el-table-column prop="branch" label="分支">
        <template slot-scope="scope">
          <i class="fa fa-code-fork" style="margin-right: 2px"></i>
          <b>{{scope.row.branch}}</b>
        </template>
      </el-table-column>
      <el-table-column prop="sonarQube" label="代码质量" width="210">
        <template slot-scope="scope">
          <sonar-popover :sonarQube="scope.row.sonarQube" v-if="scope.row.enableSonar"></sonar-popover>
        </template>
      </el-table-column>
      <el-table-column prop="env" label="环境" width="80">
        <template slot-scope="scope">
          <el-tag disable-transitions :style="{ color: scope.row.env.color }">{{scope.row.env.envName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="最新构建" width="210">
        <template slot-scope="props">
          <el-button-group>
            <el-button v-for="item in props.row.buildViews" :key="item.buildNumber"
                       :style="{ backgroundColor: item.color, color: '#FFFFFF',width: '50px' }">
              <el-popover placement="top-start" trigger="hover">
                <el-card class="box-card" shadow="never">
                  <div slot="header" class="clearfix">
                    <span>控制台</span>
                    <el-button style="float: right; padding: 3px 0" type="text"
                               @click="handlerAbortBuild(item.executors)" v-show="item.building">中止任务
                    </el-button>
                  </div>
                  <el-form>
                  <span v-show="item.executors.length > 0">
                    <el-tag type="primary">构建日志
                      <el-button type="text" style="margin-left: 10px; padding: 3px 0"
                                 @click="handlerOpenViewBuildOutput(item.executors)"><span
                        style="color: #535353">查看</span></el-button>
                    </el-tag>
                    <el-divider></el-divider>
                    <div v-for="executor in item.executors" :key="executor.id">
                      <el-tag type="primary">{{ executor.nodeName }}:{{ executor.privateIp}}
                        <el-button type="text" style="margin-left: 10px; padding: 3px 0"
                                   @click="handlerOpenXTerm(executor)"><span
                          style="color: #535353">打开终端</span></el-button>
                      </el-tag>
                    </div>
                  </span>
                    <span v-show="item.executors.length === 0">No Executors</span>
                  </el-form>
                </el-card>
                <span slot="reference"><i class="el-icon-loading" v-if="item.building"></i>{{item.buildNumber}}</span>
              </el-popover>
            </el-button>
          </el-button-group>
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
              <el-dropdown-item icon="el-icon-edit"><span @click="handlerRowDeploymentEdit(scope.row)">部署配置</span>
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
    <ciJobDialog ref="ciJobDialog" :formStatus="formCiJobStatus" @closeDialog="fetchData"></ciJobDialog>
    <cdJobDialog ref="cdJobDialog" :formStatus="formCdJobStatus" @closeDialog="fetchData"></cdJobDialog>
    <!-- 任务引擎编辑对话框 -->
    <jobEngineDialog ref="jobEngineDialog" :formStatus="formEngineStatus"></jobEngineDialog>
    <h5JobBuildDialog ref="h5JobBuildDialog" :formStatus="formH5BuildStatus"></h5JobBuildDialog>
    <javaJobBuildDialog ref="javaJobBuildDialog" :formStatus="formJavaBuildStatus"></javaJobBuildDialog>
    <javaJobDeployDialog ref="javaJobDeployDialog" :formStatus="formJavaDeployStatus"></javaJobDeployDialog>
    <iOSJobBuildDialog ref="iOSJobBuildDialog" :formStatus="formIOSBuildStatus"></iOSJobBuildDialog>
    <pythonJobBuildDialog ref="pythonJobBuildDialog" :formStatus="formPythonBuildStatus"></pythonJobBuildDialog>
    <androidJobBuildDialog ref="androidJobBuildDialog" :formStatus="formAndroidBuildStatus"></androidJobBuildDialog>
    <androidReinforceJobBuildDialog ref="androidReinforceJobBuildDialog"
                                    :formStatus="formAndroidReinforceBuildStatus"></androidReinforceJobBuildDialog>
    <!--    @openXTerm="handlerOpenXTerm"-->
    <jenkinsNodeXTerm ref="xtermDialog" :formStatus="formXtermStatus"></jenkinsNodeXTerm>
    <viewJobBuildOutput ref="viewJobBuildOutput" :formStatus="formBuildOutputStatus"></viewJobBuildOutput>
    <ciJobPermissionDialog ref="ciJobPermissionDialog" :formStatus="formPermissionStatus"></ciJobPermissionDialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  // Component
  // XTerm
  import JenkinsNodeXTerm from '@/components/opscloud/xterm/JenkinsNodeXTerm'
  import CiJobDialog from '@/components/opscloud/application/CiJobDialog'
  import CdJobDialog from '@/components/opscloud/application/CdJobDialog'
  import JobEngineDialog from '@/components/opscloud/application/JobEngineDialog'
  import ViewJobBuildOutput from '@/components/opscloud/application/ViewJobBuildOutput'
  // Component Build
  import H5JobBuildDialog from '@/components/opscloud/build/H5JobBuildDialog'
  import JavaJobBuildDialog from '@/components/opscloud/build/JavaJobBuildDialog'
  import JavaJobDeployDialog from '@/components/opscloud/build/JavaJobDeployDialog'
  import IOSJobBuildDialog from '@/components/opscloud/build/IOSJobBuildDialog'
  import PythonJobBuildDialog from '@/components/opscloud/build/PythonJobBuildDialog'
  import AndroidJobBuildDialog from '@/components/opscloud/build/AndroidJobBuildDialog'
  import AndroidReinforceJobBuildDialog from '@/components/opscloud/build/AndroidReinforceJobBuildDialog'
  import CiJobPermissionDialog from '@/components/opscloud/application/CiJobPermissionDialog'
  import SonarPopover from '@/components/opscloud/build/sonar/SonarPopover'

  import { queryCiJobPage } from '@api/application/ci.job.js'
  import { abortBuildCiJob } from '@api/build/job.build.js'

  export default {
    name: 'MyCiJobTable',
    data () {
      return {
        application: '',
        tableData: [],
        options: {
          stripe: true
        },
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          instanceId: '',
          queryName: ''
        },
        formCiJobStatus: {
          visible: false,
          operationType: true,
          addTitle: '新增任务配置',
          updateTitle: '更新任务配置'
        },
        formCdJobStatus: {
          visible: false,
          operationType: true,
          addTitle: '新增部署任务配置',
          updateTitle: '更新部署任务配置'
        },
        formEngineStatus: {
          visible: false
        },
        formH5BuildStatus: {
          visible: false
        },
        formJavaBuildStatus: {
          visible: false
        },
        formJavaDeployStatus: {
          visible: false
        },
        formIOSBuildStatus: {
          visible: false
        },
        formPythonBuildStatus: {
          visible: false
        },
        formAndroidBuildStatus: {
          visible: false
        },
        // cd Reinforce
        formAndroidReinforceBuildStatus: {
          visible: false
        },
        formXtermStatus: {
          visible: false
        },
        formBuildOutputStatus: {
          visible: false
        },
        formPermissionStatus: {
          visible: false
        },
        labelWidth: '100px',
        timer: null // 查询定时器
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
      clearInterval(this.timer) // 销毁定时器
    },
    components: {
      JenkinsNodeXTerm,
      CiJobDialog,
      CdJobDialog,
      JobEngineDialog,
      H5JobBuildDialog,
      JavaJobBuildDialog,
      JavaJobDeployDialog,
      IOSJobBuildDialog,
      PythonJobBuildDialog,
      AndroidJobBuildDialog,
      AndroidReinforceJobBuildDialog,
      ViewJobBuildOutput,
      CiJobPermissionDialog,
      SonarPopover
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
      setTimer () {
        if (this.timer !== null) {
          return
        }
        this.timer = setInterval(() => {
          this.fetchData()
          // console.log('开始定时...每8秒执行一次')
        }, 8000)
      },
      initData (application) {
        this.application = application
        this.fetchData()
        this.setTimer()
        // this.fetchData()
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
        this.formCiJobStatus.operationType = true
        this.formCiJobStatus.visible = true
        this.$refs.ciJobDialog.initData(this.application, ciJob)
      },
      handlerRowRunBuild (row) {
        switch (row.jobType) {
          case 'HTML5':
            this.formH5BuildStatus.visible = true
            this.$refs.h5JobBuildDialog.initData(this.application, row)
            break
          case 'JAVA':
            this.formJavaBuildStatus.visible = true
            this.$refs.javaJobBuildDialog.initData(this.application, row)
            break
          case 'IOS':
            this.formIOSBuildStatus.visible = true
            this.$refs.iOSJobBuildDialog.initData(this.application, row)
            break
          case 'PYTHON':
            this.formPythonBuildStatus.visible = true
            this.$refs.pythonJobBuildDialog.initData(this.application, row)
            break
          case 'ANDROID':
            this.formAndroidBuildStatus.visible = true
            this.$refs.androidJobBuildDialog.initData(this.application, row)
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
          case 'ANDROID_REINFORCE':
            this.formAndroidReinforceBuildStatus.visible = true
            this.$refs.androidReinforceJobBuildDialog.initData(this.application, row.cdJob)
            break
          case 'JAVA_DEPLOYMENT':
            this.formJavaDeployStatus.visible = true
            this.$refs.javaJobDeployDialog.initData(this.application, row.cdJob)
            break
          default:
            this.$message.error('部署任务类型配置错误!')
        }
      },
      handlerRowDeploymentEdit (row) {
        if (row.cdJob === null) {
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
          this.formCdJobStatus.operationType = true
          this.$refs.cdJobDialog.initData(this.application, cdJob)
        } else {
          this.formCdJobStatus.operationType = false
          this.$refs.cdJobDialog.initData(this.application, Object.assign({}, row.cdJob))
        }
        this.formCdJobStatus.visible = true
      },
      handlerRowPermissionEdit (row) {
        this.formPermissionStatus.visible = true
        this.$refs.ciJobPermissionDialog.initData(Object.assign({}, row))
      },
      handlerRowEngineEdit (row) {
        let data = {
          ciJobId: row.id,
          cdJobId: row.cdJob !== null ? row.cdJob.id : null
        }
        this.formEngineStatus.visible = true
        this.$refs.jobEngineDialog.initData(data)
      },
      handlerRowEdit (row) {
        this.formCiJobStatus.operationType = false
        this.formCiJobStatus.visible = true
        this.$refs.ciJobDialog.initData(this.application, Object.assign({}, row))
      },
      handlerOpenXTerm (executor) {
        this.formXtermStatus.visible = true
        this.$refs.xtermDialog.initData(executor)
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
      handlerOpenViewBuildOutput (executors) {
        this.formBuildOutputStatus.visible = true
        this.$refs.viewJobBuildOutput.initData(0, executors[0].buildId)
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        if (this.application === '') return
        if (this.tableData.length === 0) this.loading = true
        let requestBody = {
          'applicationId': this.application.id,
          'queryName': this.queryParam.queryName,
          'extend': 1,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryCiJobPage(requestBody)
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
  .table-expand {
    font-size: 0;
  }

  .table-expand label {
    width: 150px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-dropdown {
    vertical-align: top;
  }

  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .input {
    display: inline-block;
    max-width: 200px;
  }

  .select {
    margin-right: 5px;
  }
</style>
