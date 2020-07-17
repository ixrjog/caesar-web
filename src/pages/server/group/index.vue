<template>
  <d2-container>
    <template>
      <div>
        <h1>服务器组</h1>
      </div>
      <div style="margin-bottom: 5px">
        <el-row :gutter="24" style="margin-bottom: 5px">
          <el-input v-model.trim="queryParam.name" placeholder="名称" :style="searchBarHeadStyle"/>
          <el-select v-model.trim="queryParam.grpType" filterable clearable :style="searchBarStyle"
                     remote reserve-keyword placeholder="输入关键词搜组类型" :remote-method="getGrpType" :loading="loading">
            <el-option
              v-for="item in grpTypeOptions"
              :key="item.grpType"
              :label="item.name"
              :value="item.grpType">
            </el-option>
          </el-select>
          <el-button @click="fetchData" :style="searchBarStyle">查询</el-button>
          <el-button @click="addItem" :style="searchBarStyle">新增</el-button>
        </el-row>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="serverGroupType" label="组类型">
          <template slot-scope="scope">
            <el-tag disable-transitions :style="{ color: scope.row.serverGroupType.color }">
              {{scope.row.serverGroupType.name}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="描述"></el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="warning" plain size="mini" @click="editItem(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                     :page-size="pagination.pageSize">
      </el-pagination>
      <ServerGroupDialog :formStatus="formServerGroupStatus" ref="serverGroupDialog"
                         @closeServerGroupDialog="fetchData"></ServerGroupDialog>
    </template>
  </d2-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  import ServerGroupDialog from '@/components/opscloud/dialog/ServerGroupDialog'
  // API
  import { queryServerGroupTypePage } from '@api/server/server.group.type.js'
  import { queryServerGroupPage, deleteServerGroupById } from '@api/server/server.group.js'

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
        formServerGroupStatus: {
          visible: false,
          addTitle: '新增服务器组配置',
          updateTitle: '更新服务器组配置',
          operationType: true,
          labelWidth: '100px'
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
          name: '',
          grpType: ''
        },
        grpTypeOptions: [],
        grpTypeDialogOptions: []
      }
    },
    mounted () {
      this.initPageSize()
      this.getGrpType('')
      this.fetchData()
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    components: {
      ServerGroupDialog
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
      getGrpType (name) {
        queryServerGroupTypePage(name, '', 1, 10)
          .then(res => {
            this.grpTypeOptions = res.body.data
          })
      },
      handleClick () {
        this.$emit('input', !this.value)
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
          deleteServerGroupById(row.id).then(res => {
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
        let serverGroup = {
          id: '',
          name: 'group_',
          inWorkorder: 0,
          grpType: '',
          comment: ''
        }
        this.$refs.serverGroupDialog.initData(serverGroup, [])
        this.formServerGroupStatus.operationType = true
        this.formServerGroupStatus.visible = true
      },
      editItem (row) {
        let grpTypeOptions = []
        grpTypeOptions.push(row.serverGroupType)
        let serverGroup = Object.assign({}, row)
        this.$refs.serverGroupDialog.initData(serverGroup, grpTypeOptions)
        this.formServerGroupStatus.operationType = false
        this.formServerGroupStatus.visible = true
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        queryServerGroupPage(this.queryParam.name, this.queryParam.grpType, this.pagination.currentPage, this.pagination.pageSize)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
          })
      }
    }
  }
</script>
