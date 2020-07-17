<template>
  <div>
    <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
      <el-input v-model="queryParam.queryName" placeholder="关键字查询" class="input"/>
      <el-button @click="fetchData" class="button">查询</el-button>
      <el-button @click="handlerRowAdd" style="margin-left: 5px">新增</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="accountUid" label="主账户uid" v-if="false"></el-table-column>
      <el-table-column prop="project" label="日志服务配置">
        <template slot-scope="scope">
          <div>日志项目: {{ scope.row.project}}</div>
          <div>日志库: {{ scope.row.logstore}}</div>
          <div>logtail配置: {{ scope.row.config}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="logstore" label="日志库" v-if="false"></el-table-column>
      <el-table-column prop="config" label="logtail配置" v-if="false"></el-table-column>
      <el-table-column prop="memberSize" label="成员" width="80">
        <template slot-scope="props">
          <el-tag style="margin-left: 5px">{{ props.row.memberSize }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="240">
        <template slot-scope="scope">
          <el-button @click="handlerRowMember(scope.row)" type="primary" plain size="mini" style="margin-left: 5px">成员</el-button>
          <el-button @click="handlerRowEdit(scope.row)" type="primary" plain size="mini" style="margin-left: 5px">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handlerRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]"
                   @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <AliyunLogDialog ref="aliyunLogDialog" :formStatus="formStatus" @closeDialog="fetchData"></AliyunLogDialog>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  // API
  import { queryAliyunLogPage } from '@api/cloud/aliyun.log.js'

  import AliyunLogDialog from '@/components/opscloud/dialog/AliyunLogDialog'

  export default {
    data () {
      return {
        tableData: [],
        loading: false,
        formStatus: {
          visible: false,
          addTitle: '新增日志服务配置',
          updateTitle: '更新日志服务配置',
          operationType: true
        },
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          queryName: ''
        }
      }
    },
    name: 'AliyunLogTable',
    mounted () {
      this.initPageSize()
      this.fetchData()
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    components: {
      AliyunLogDialog
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
      handlerRowAdd () {
        let aliyunLog = {
          id: 0,
          account_uid: '',
          project: '',
          logstore: '',
          config: '',
          comment: ''
        }
        this.formStatus.operationType = true
        this.formStatus.visible = true
        this.$refs.aliyunLogDialog.initData(aliyunLog)
      },
      handlerRowMember (row) {
        this.$emit('handlerSelLog', row.id)
      },
      handlerRowEdit (row) {
        this.formStatus.operationType = false
        this.formStatus.visible = true
        this.$refs.aliyunLogDialog.initData(row)
      },
      handlerRowDel (row) {
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        let requestBody = Object.assign({}, this.queryParam)
        requestBody.page = this.pagination.currentPage
        requestBody.length = this.pagination.pageSize
        queryAliyunLogPage(requestBody)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
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

  .input {
    display: inline-block;
    max-width: 200px;
    margin-right: 5px;
  }

  .select {
    margin-right: 5px;
  }

  .button {
    margin-right: 5px;
  }
</style>
