<template>
  <div>
    <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
      <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"
                class="input"/>
      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      <el-button @click="handlerAdd" style="margin-left: 5px">新建</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="实例名称">
        <template slot-scope="props">
          <span>{{ props.row.name }}</span>
          <el-tag v-if="props.row.version != ''" style="margin-left: 5px" disable-transitions type="primary">{{ props.row.version.version }} {{props.row.version.revision}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="管理url"></el-table-column>
      <el-table-column prop="projectSize" label="项目">
        <template slot-scope="props">
          <el-tag disable-transitions type="primary">{{props.row.projectSize }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="有效">
        <template slot-scope="props">
          <el-tag disable-transitions :type="props.row.isActive ? 'success' : 'info'">{{props.row.isActive ?
            '有效':'无效'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column fixed="right" label="操作" width="380">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handlerRowEdit(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handlerRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange"
                   :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <!-- instance编辑对话框 -->
    <GitlabInstanceDialog ref="gitlabInstanceDialog" :formStatus="formStatus"
                           @closeDialog="fetchData"></GitlabInstanceDialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  // Component
  import GitlabInstanceDialog from '@/components/opscloud/gitlab/GitlabInstanceDialog'
  // API
  import { queryGitlabInstancePage, delGitlabInstanceById } from '@api/gitlab/gitlab.instance.js'

  export default {
    name: 'GitlabInstanceTable',
    data () {
      return {
        formStatus: {
          visible: false,
          operationType: true,
          addTitle: '新增Gitlab实例配置',
          updateTitle: '更新Gitlab实例配置'
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
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    mounted () {
      this.initPageSize()
      this.fetchData()
    },
    components: {
      GitlabInstanceDialog
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
      handlerRowEdit (row) {
        let instance = Object.assign({}, row)
        this.$refs.gitlabInstanceDialog.initData(instance)
        this.formStatus.visible = true
        this.formStatus.operationType = false
      },
      handlerRowDel (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delGitlabInstanceById(row.id).then(res => {
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
      handlerAdd () {
        let instance = {
          id: '',
          name: '',
          url: '',
          username: '',
          token: '',
          serverId: '',
          isActive: true,
          comment: ''
        }
        this.$refs.gitlabInstanceDialog.initData(instance)
        this.formStatus.visible = true
        this.formStatus.operationType = true
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        let requestBody = {
          'queryName': this.queryParam.queryName,
          'extend': 1,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryGitlabInstancePage(requestBody)
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

  .input {
    display: inline-block;
    max-width: 200px;
  }

</style>
