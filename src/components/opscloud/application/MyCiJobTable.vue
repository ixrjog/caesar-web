<template>
  <div>
    <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
      <el-input v-model.trim="application.name" disabled placeholder="应用名称" class="input"></el-input>
      <el-button @click="handlerAdd" style="margin-left: 5px" :disabled="application === ''">新建任务</el-button>
      <!--      <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"-->
      <!--                class="input"/>-->
      <!--      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>-->
    </el-row>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="仓库">{{props.row.scmMember.scmSshUrl}}</el-form-item>
            <el-form-item label="描述">{{props.row.comment}}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
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
      <el-table-column prop="env" label="环境" width="80">
        <template slot-scope="scope">
          <el-tag disable-transitions :style="{ color: scope.row.env.color }">{{scope.row.env.envName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="最新任务">
        <template slot-scope="props">
          <el-button-group>
            <el-button type="warning"><i class="el-icon-loading"></i><b>3</b></el-button>
            <el-button type="success"><b>2</b></el-button>
            <el-button type="danger"><b>1</b></el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button-group style="margin-right: 5px">
            <el-button type="primary" icon="fa fa-play"
                       @click="handlerRowRunBuild(scope.row)"></el-button>
            <el-button type="primary" icon="fa fa-stop"
                       @click="handlerSelRow(scope.row)"></el-button>
          </el-button-group>
          <el-dropdown split-button type="primary" @click="handlerRowEdit(scope.row)">
            <i class="el-icon-edit"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="fa fa-plane"><span @click="handlerRowEngineEdit(scope.row)">工作引擎</span></el-dropdown-item>
              <el-dropdown-item icon="fa fa-user">权限配置</el-dropdown-item>
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
    <CiJobDialog ref="ciJobDialog" :formStatus="formStatus" @closeDialog="fetchData"></CiJobDialog>
    <!-- 任务引擎编辑对话框 -->
    <CiJobEngineDialog ref="ciJobEngineDialog" :formStatus="formEngineStatus"></CiJobEngineDialog>
    <JobH5BuildDialog ref="jobH5BuildDialog" :formStatus="formH5BuildStatus"></JobH5BuildDialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  // Component
  import CiJobDialog from '@/components/opscloud/application/CiJobDialog'
  import CiJobEngineDialog from '@/components/opscloud/application/CiJobEngineDialog'
  // Component Build
  import JobH5BuildDialog from '@/components/opscloud/build/JobH5BuildDialog'

  import { queryCiJobPage } from '@api/application/ci.job.js'

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
        formStatus: {
          visible: false,
          operationType: true,
          addTitle: '新增任务配置',
          updateTitle: '更新任务配置'
        },
        formEngineStatus: {
          visible: false
        },
        formH5BuildStatus: {
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
    components: {
      CiJobDialog,
      CiJobEngineDialog,
      JobH5BuildDialog
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
      handlerRowSel (row) {
        this.$emit('handlerSelApplication', row)
      },
      handlerAdd () {
        let ciJob = {
          id: '',
          applicationId: this.application.id,
          jobTpl: {},
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
          dingtalkId: '',
          scmMemberId: '',
          comment: ''
        }
        this.formStatus.operationType = true
        this.formStatus.visible = true
        this.$refs.ciJobDialog.initData(this.application, ciJob)
      },
      handlerRowRunBuild (row) {
        switch (row.jobType) {
          case 'HTML5':
            this.formH5BuildStatus.visible = true
            this.$refs.jobH5BuildDialog.initData(this.application,row)
            break
          case 'IOS':
            this.formH5BuildStatus.visible = true
            this.$refs.jobH5BuildDialog.initData(this.application,row)
            break
          default:
            this.$message.error('任务类型配置错误!')
        }
      },
      handlerRowEngineEdit (row) {
        this.formEngineStatus.visible = true
        this.$refs.ciJobEngineDialog.initData(Object.assign({}, row))
      },
      handlerRowEdit (row) {
        this.formStatus.operationType = false
        this.formStatus.visible = true
        this.$refs.ciJobDialog.initData(this.application, Object.assign({}, row))
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
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
