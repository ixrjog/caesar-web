<template>
  <div>
    <el-row style="margin-bottom: 5px" :gutter="24">
      <el-input v-model.trim="application.name" disabled placeholder="应用名称" class="input"></el-input>
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
                  <span v-show="item.executors.length === 0">
                    No Executors
                  </span>
                </el-form>
                <span slot="reference"><i class="el-icon-loading" v-if="item.building"></i>{{item.buildNumber}}</span>
              </el-popover>
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="210">
        <template slot-scope="scope">
          <el-button-group style="margin-right: 5px">
            <el-button type="primary" icon="fa fa-cloud-upload" v-show="scope.row.deploymentJobId !== 0"
                       @click="handlerRowRunDeployment(scope.row)"></el-button>
          </el-button-group>
          <el-dropdown split-button type="primary" @click="handlerRowDeploymentEdit(scope.row)">
            <i class="el-icon-edit"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="fa fa-plane"><span @click="handlerRowEngineEdit(scope.row)">工作引擎</span>
              </el-dropdown-item>
              <el-dropdown-item icon="fa fa-user"><span>权限配置</span></el-dropdown-item>
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
    <cd-job-dialog ref="cdJobDialog" :formStatus="formCdJobStatus" @closeDialog="fetchData"></cd-job-dialog>
    <!-- 任务引擎编辑对话框 -->
    <job-engine-dialog ref="jobEngineDialog" :formStatus="formEngineStatus"></job-engine-dialog>
    <android-reinforce-job-build-dialog ref="androidReinforceJobBuildDialog"
                                    :formStatus="formAndroidReinforceBuildStatus"></android-reinforce-job-build-dialog>
    <java-job-deploy-dialog ref="javaJobDeployDialog" :formStatus="formJavaDeployStatus"></java-job-deploy-dialog>
    <jenkins-node-x-term ref="xtermDialog" :formStatus="formXtermStatus" @openXTerm="handlerOpenXTerm"></jenkins-node-x-term>
    <view-job-build-output ref="viewJobBuildOutput" :formStatus="formBuildOutputStatus"></view-job-build-output>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  // Component
  import JenkinsNodeXTerm from '@/components/opscloud/xterm/JenkinsNodeXTerm'
  import CdJobDialog from '@/components/opscloud/application/CdJobDialog'
  import JobEngineDialog from '@/components/opscloud/application/JobEngineDialog'
  import AndroidReinforceJobBuildDialog from '@/components/opscloud/build/AndroidReinforceJobBuildDialog'
  import JavaJobDeployDialog from '@/components/opscloud/build/JavaJobDeployDialog'
  import ViewJobBuildOutput from '@/components/opscloud/application/ViewJobBuildOutput'

  import { queryCdJobPage } from '@api/application/cd.job.js'

  export default {
    name: 'MyCdJobTable',
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
        // cd Reinforce
        formAndroidReinforceBuildStatus: {
          visible: false
        },
        formJavaDeployStatus: {
          visible: false
        },
        formXtermStatus: {
          visible: false
        },
        formBuildOutputStatus: {
          visible: false
        }
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
      JenkinsNodeXTerm,
      CdJobDialog,
      JobEngineDialog,
      AndroidReinforceJobBuildDialog,
      JavaJobDeployDialog,
      ViewJobBuildOutput
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
        this.fetchData()
      },
      handlerRowRunDeployment (row) {
        switch (row.jobType) {
          case 'ANDROID_REINFORCE':
            this.formAndroidReinforceBuildStatus.visible = true
            this.$refs.androidReinforceJobBuildDialog.initData(this.application, row)
            break
          case 'JAVA_DEPLOYMENT':
            this.formJavaDeployStatus.visible = true
            this.$refs.javaJobDeployDialog.initData(this.application, row)
            break
          default:
            this.$message.error('部署任务类型配置错误!')
        }
      },
      handlerRowDeploymentEdit (row) {
        this.formCdJobStatus.operationType = false
        this.$refs.cdJobDialog.initData(this.application, Object.assign({}, row))
        this.formCdJobStatus.visible = true
      },
      handlerRowEngineEdit (row) {
        let data = {
          ciJobId: row.ciJobId,
          cdJobId: row.id
        }
        this.formEngineStatus.visible = true
        this.$refs.jobEngineDialog.initData(data)
      },
      handlerOpenXTerm (executor) {
        this.formXtermStatus.visible = true
        this.$refs.xtermDialog.initData(executor)
      },
      handlerOpenViewBuildOutput (executors) {
        this.formBuildOutputStatus.visible = true
        this.$refs.viewJobBuildOutput.initData(1, executors[0].buildId)
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
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryCdJobPage(requestBody)
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
