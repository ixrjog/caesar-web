<template>
  <d2-container>
    <template>
      <div>
        <h1>标签配置</h1>
      </div>
      <el-row :gutter="24" style="margin-bottom: 5px">
        <el-input v-model.trim="queryParam.tagKey" placeholder="标签key" class="input-bar"/>
        <el-button @click="fetchData" class="button">查询</el-button>
        <el-button @click="addItem" class="button">新增</el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="tagKey" label="名称">
          <template slot-scope="scope">
            <el-tag disable-transitions :style="{ color: scope.row.color }">{{scope.row.tagKey}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="描述"></el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="warning" plain size="mini" @click="updateItem(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                     :page-size="pagination.pageSize">
      </el-pagination>
      <TagDialog :formStatus="formTagStatus" :formData="tag" @closeTagDialog="fetchData"></TagDialog>
    </template>
  </d2-container>
</template>

<script>

  import { mapState, mapActions } from 'vuex'

  import TagDialog from '@/components/opscloud/dialog/TagDialog'
  // API
  import { queryTagPage, deleteTagById } from '@api/tag/tag.js'

  export default {
    data () {
      return {
        tag: {},
        formTagStatus: {
          visible: false,
          labelWidth: '100px',
          addTitle: '新增标签配置',
          updateTitle: '更新标签配置',
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
          tagKey: ''
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
      TagDialog
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
      delItem (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTagById(row.id).then(res => {
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
        this.formTagStatus.operationType = true
        this.formTagStatus.visible = true
        this.tag = {
          id: '',
          tagKey: '',
          color: '',
          comment: ''
        }
      },
      updateItem (row) {
        this.tag = Object.assign({}, row)
        this.formTagStatus.operationType = false
        this.formTagStatus.visible = true
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        queryTagPage(this.queryParam.tagKey, this.pagination.currentPage, this.pagination.pageSize)
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
  .input-bar {
    display: inline-block;
    max-width: 200px;
    margin-left: 10px;
  }

  .button {
    margin-left: 5px;
  }
</style>
