<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px;">
      <el-input v-model="queryParam.queryName" placeholder="关键字查询" class="input-bar"/>
      <el-button @click="fetchData" class="button">查询</el-button>
      <el-button @click="addItem" class="button">新增</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="editItem(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange"
                   layout="prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <WorkorderGroupDialog :formStatus="formStatus" ref="workorderGroupDialog"
                          @closeWorkorderGroupDialog="fetchData"></WorkorderGroupDialog>
  </div>
</template>

<script>

  import WorkorderGroupDialog from '@/components/opscloud/workorder/WorkorderGroupDialog.vue'

  // API
  import { deleteWorkorderGroupById, queryWorkorderGroupPage } from '@api/workorder/workorder.group.js'

  export default {
    data () {
      return {
        formStatus: {
          visible: false,
          addTitle: '新增工单组配置',
          updateTitle: '更新工单组配置',
          operationType: true
        },
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
          queryName: ''
        }
      }
    },
    name: 'WorkorderGroupTable',
    props: [],
    mounted () {
      this.fetchData()
    },
    components: {
      WorkorderGroupDialog
    },
    methods: {
      addItem () {
        let workorderGroupData = {
          id: '',
          name: '',
          comment: '',
          workorderType: 0
        }
        this.formStatus.operationType = true
        this.formStatus.visible = true
        this.$refs.workorderGroupDialog.initData(workorderGroupData)
      },
      editItem (row) {
        let workorderGroupData = Object.assign({}, row)
        this.formStatus.operationType = false
        this.formStatus.visible = true
        this.$refs.workorderGroupDialog.initData(workorderGroupData)
      },
      delItem (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteWorkorderGroupById(row.id).then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        var requestBody = Object.assign({}, this.queryParam)
        requestBody.page = this.pagination.currentPage
        requestBody.length = this.pagination.pageSize
        queryWorkorderGroupPage(requestBody)
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

  .input-bar {
    display: inline-block;
    max-width: 200px;
    margin-left: 12px;
  }

  .button {
    margin-left: 5px;
  }
</style>
