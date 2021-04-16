<template>
  <div>
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
          <build-view :items="props.row.buildViews" @handlerOpenExecutor="handlerOpenExecutor"
                      @handlerOpenOutput="handlerOpenOutput"></build-view>
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
    <cd-job-dialog ref="cdJobDialog" :formStatus="formStatus.cdJob" @closeDialog="fetchData"></cd-job-dialog>
    <!-- 任务引擎编辑对话框 -->
    <job-engine-dialog ref="jobEngineDialog" :formStatus="formStatus.engine"></job-engine-dialog>
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
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  // Component
  import terminalMaster from '@/components/opscloud/xterm/TerminalMaster'
  import CdJobDialog from '@/components/opscloud/application/CdJobDialog'
  import JobEngineDialog from '@/components/opscloud/application/JobEngineDialog'

  // deployment
  import javaDeploymentDialog from '@/components/opscloud/build/JavaDeploymentDialog'

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
        executor: null,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          instanceId: '',
          queryName: ''
        },
        formStatus: {
          engine: { visible: false },
          terminal: {
            visible: false
          },
          buildOutput: {
            visible: false
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
      terminalMaster,
      CdJobDialog,
      JobEngineDialog,
      javaDeploymentDialog,
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
            break
          case 'JAVA_DEPLOYMENT':
            this.formStatus.deployment.java.visible = true
            this.$refs.javaDeploymentDialog.initData(this.application, row)
            break
          default:
            this.$message.error('部署任务类型配置错误!')
        }
      },
      handlerRowDeploymentEdit (row) {
        this.formStatus.cdJob.operationType = false
        this.$refs.cdJobDialog.initData(this.application, Object.assign({}, row))
        this.formStatus.cdJob.visible = true
      },
      handlerRowEngineEdit (row) {
        let data = {
          ciJobId: row.ciJobId,
          cdJobId: row.id
        }
        this.formStatus.engine.visible = true
        this.$refs.jobEngineDialog.initData(data)
      },
      handlerOpenOutput (executor) {
        this.formStatus.buildOutput.visible = true
        this.$refs.buildOutput.open(1, executor.buildId)
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
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryCdJobPage(requestBody)
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

  .el-input {
    display: inline-block;
    max-width: 200px;
    margin-right: 10px;
  }

  .tips {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 10px 10px;
    margin-bottom: 5px;
    margin-left: 5px;
    margin-right: 15px;
  }
</style>
