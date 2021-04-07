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
          <build-view :items="props.row.buildViews" @handlerOpenExecutor="handlerOpenExecutor" @handlerOpenOutput="handlerOpenOutput"></build-view>
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
    <terminal ref="terminalDialog" :formStatus="formXtermStatus"></terminal>
    <build-output ref="buildOutput" :formStatus="formBuildOutputStatus"></build-output>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  // Component
  import terminal from '@/components/opscloud/xterm/NodeTerminal'
  import CdJobDialog from '@/components/opscloud/application/CdJobDialog'
  import JobEngineDialog from '@/components/opscloud/application/JobEngineDialog'
  import AndroidReinforceJobBuildDialog from '@/components/opscloud/build/AndroidReinforceJobBuildDialog'
  import JavaJobDeployDialog from '@/components/opscloud/build/JavaJobDeployDialog'
  import buildOutput from '@/components/opscloud/application/BuildOutput'
  import buildView from '@/components/opscloud/application/BuildView'

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
      terminal,
      CdJobDialog,
      JobEngineDialog,
      AndroidReinforceJobBuildDialog,
      JavaJobDeployDialog,
      buildOutput,
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
      handlerOpenOutput (executor) {
        this.formBuildOutputStatus.visible = true
        this.$refs.buildOutput.open(1, executor.buildId)
      },
      handlerOpenExecutor (executor) {
        this.formXtermStatus.visible = true
        this.$refs.terminalDialog.open(executor)
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
