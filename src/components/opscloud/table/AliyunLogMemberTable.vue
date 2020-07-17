<template>
  <div v-show="queryParam.logId !== ''">
    <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
      <el-input v-model="queryParam.queryName" placeholder="关键字查询" class="input"/>
      <el-button @click="fetchData" class="button">查询</el-button>
      <el-button @click="handlerAdd" style="margin-left: 5px">新增</el-button>
      <el-button @click="handlerPush(scope.row)" style="margin-left: 5px">推送</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="serverGroupName" label="服务器组名称"></el-table-column>
      <el-table-column prop="topic" label="自定义topic">
        <template slot-scope="props">
          <el-tag style="margin-left: 5px" v-show="props.row.topic != null && props.row.topic != ''">{{ props.row.topic
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ago" label="推送时间" width="100"></el-table-column>
      <el-table-column fixed="right" label="操作" width="240">
        <template slot-scope="scope">
          <el-button @click="handlerRowPush(scope.row)" type="primary" plain size="mini" style="margin-left: 5px">推送</el-button>
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
    <AliyunLogMemberDialog ref="aliyunLogMemberDialog" :formStatus="formStatus"
                           @closeDialog="fetchData"></AliyunLogMemberDialog>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  // API
  import { queryAliyunLogMemberPage, removeAliyunLogMemberById, pushAliyunLogMemberById } from '@api/cloud/aliyun.log.member.js'
  import { pushAliyunLogById } from '@api/cloud/aliyun.log.js'
  import AliyunLogMemberDialog from '@/components/opscloud/dialog/AliyunLogMemberDialog'

  export default {
    data () {
      return {
        tableData: [],
        loading: false,
        formStatus: {
          visible: false,
          addTitle: '新增日志服务配置成员',
          updateTitle: '更新日志服务配置成员',
          operationType: true
        },
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          logId: '',
          queryName: ''
        }
      }
    },
    name: 'AliyunLogMemberTable',
    mounted () {
      this.initPageSize()
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    components: {
      AliyunLogMemberDialog
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
      initData (logId) {
        this.queryParam.logId = logId
        this.fetchData()
      },
      handlerAdd () {
        let aliyunLogMember = {
          id: 0,
          logId: this.queryParam.logId,
          serverGroupId: '',
          serverGroupName: '',
          topic: '',
          comment: ''
        }
        this.formStatus.operationType = true
        this.formStatus.visible = true
        this.$refs.aliyunLogMemberDialog.initData(aliyunLogMember)
      },
      handlerPush () {
        pushAliyunLogById(this.queryParam.logId)
          .then(res => {
            // 返回数据
            if (res.success) {
              this.$message({
                message: '推送成功',
                type: 'success'
              })
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      handlerRowPush (row) {
        pushAliyunLogMemberById(row.id)
          .then(res => {
            // 返回数据
            if (res.success) {
              this.$message({
                message: '推送成功',
                type: 'success'
              })
              this.fetchData()
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      handlerRowEdit (row) {
        this.formStatus.operationType = false
        this.formStatus.visible = true
        this.$refs.aliyunLogMemberDialog.initData(row)
      },
      handlerRowDel (row) {
        removeAliyunLogMemberById(row.id)
          .then(res => {
            // 返回数据
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.fetchData()
          })
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
        queryAliyunLogMemberPage(requestBody)
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
