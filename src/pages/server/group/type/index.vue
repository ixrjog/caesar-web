<template>
  <d2-container>
    <template>
      <div>
        <h1>服务器组类型</h1>
      </div>
      <div style="margin-bottom: 5px">
        <el-row :gutter="24" style="margin-bottom: 5px">
            <el-input v-model.trim="queryParam.name" placeholder="名称" :style="searchBarHeadStyle"/>
            <el-button @click="fetchData" :style="searchBarStyle">查询</el-button>
            <el-button @click="addItem" :style="searchBarStyle">新增</el-button>
        </el-row>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="名称">
          <template slot-scope="scope">
            <el-tag disable-transitions :style="{ color: scope.row.color }">{{scope.row.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="grpType" label="类型值" ></el-table-column>
        <el-table-column prop="comment" label="描述" ></el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="warning" plain size="mini" @click="updateItem(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage" :page-size="pagination.pageSize">
      </el-pagination>
      <ServerGroupTypeDialog :formStatus="formServerGroupTypeStatus" :formData="serverGroupType"
                         @closeServerGroupTypeDialog="fetchData"></ServerGroupTypeDialog>
    </template>
  </d2-container>
</template>

<script>
  import ServerGroupTypeDialog from '@/components/opscloud/dialog/ServerGroupTypeDialog'
  // API
  import { queryServerGroupTypePage, deleteServerGroupTypeById } from '@api/server/server.group.type.js'
  import { mapActions, mapState } from 'vuex'

  export default {
    data () {
      return {
        searchBarHeadStyle: {
          display: 'inline-block',
          maxWidth: '200px',
          marginLeft: '10px'
        },
        searchBarStyle: {
          marginLeft: '5px'
        },
        serverGroupType: {},
        formServerGroupTypeStatus: {
          visible: false,
          addTitle: '新增服务器组类型配置',
          updateTitle: '更新服务器组类型配置',
          labelWidth: '100px',
          operationType: true
        },
        tableData: [],
        options: {
          stripe: true
        },
        formOptions: {
          labelWidth: '80px',
          labelPosition: 'left',
          saveLoading: false
        },
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          name: '',
          grpType: ''
        }
      }
    },
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
      ServerGroupTypeDialog
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
      handleDialogCancel (done) {
        this.$message({
          message: '取消保存',
          type: 'warning'
        })
        done()
      },
      delItem (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteServerGroupTypeById(row.id).then(res => {
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
      addItem () {
        this.formServerGroupTypeStatus.operationType = true
        this.formServerGroupTypeStatus.visible = true
        this.serverGroupType = {
          id: '',
          name: '',
          grpType: '',
          color: '#dd4d3a',
          comment: ''
        }
      },
      updateItem (row) {
        this.serverGroupType = Object.assign({}, row)
        this.formServerGroupTypeStatus.operationType = false
        this.formServerGroupTypeStatus.visible = true
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        queryServerGroupTypePage(this.queryParam.name, this.queryParam.grpType, this.pagination.currentPage, this.pagination.pageSize)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
          })
      }
    }
  }
</script>
