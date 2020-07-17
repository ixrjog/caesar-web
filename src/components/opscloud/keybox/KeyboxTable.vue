<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px">
      <el-input v-model="queryParam.queryName" placeholder="系统账户查询" class="input-bar"/>
      <el-button @click="fetchData" class="button">查询</el-button>
      <el-button @click="addItem" class="button">新增</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="systemUser" label="系统账户"></el-table-column>
      <el-table-column prop="keyType" label="密钥类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.keyType === 0 ? 'success': 'info'"> {{ scope.row.keyType === 0 ? 'sshKey': 'password'
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="fingerprint" label="指纹"></el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <KeyboxDialog :formStatus="formStatus" ref="keyboxDialog"
                  @closeKeyboxDialog="fetchData"></KeyboxDialog>
  </div>
</template>

<script>

  import { mapState, mapActions } from 'vuex'

  import KeyboxDialog from '@/components/opscloud/keybox/KeyboxDialog.vue'

  // API
  import { queryKeyboxPage, delKeyboxById } from '@api/keybox/keybox.js'

  export default {
    data () {
      return {
        formStatus: {
          visible: false
        },
        tableData: [],
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
    name: 'KeyboxTable',
    props: [],
    mounted () {
      this.initPageSize()
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    components: {
      KeyboxDialog
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
      addItem () {
        this.formStatus.visible = true
        this.$refs.keyboxDialog.initData()
      },
      delItem (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delKeyboxById(row.id).then(res => {
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
        let requestBody = {
          querySystemUser: this.queryParam.queryName,
          page: this.pagination.currentPage,
          length: this.pagination.pageSize
        }
        queryKeyboxPage(requestBody)
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
    margin-left: 10px;
  }

  .button {
    margin-left: 5px;
  }
</style>
