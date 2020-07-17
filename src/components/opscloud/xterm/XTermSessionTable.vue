<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px">
      <el-input v-model.trim="queryParam.username" placeholder="用户名查询" class="input-bar"/>
      <el-select v-model.trim="queryParam.isClosed" clearable placeholder="会话" class="select-bar">
        <el-option
          v-for="item in closeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" class="buuton">查询</el-button>
    </el-row>

    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="会话id">
              <span>{{ props.row.sessionId }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="sessionInstances" label="会话实例">
        <template slot-scope="prop">
          <el-tag :type="prop.row.sessionInstances.length === 0 ? 'info': ''">{{ prop.row.sessionInstances ===
            null ? 0 : prop.row.sessionInstances.length }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isClosed" label="会话状态">
        <template slot-scope="prop">
          <el-tag :type="prop.row.isClosed ? 'info': 'success'">{{ prop.row.isClosed ? '已关闭' : '活跃' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="closeTime" label="关闭时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handlerSetSessionInstances(scope.row)">查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]"
                   @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total"
                   :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
  </div>
</template>

<script>

  import { mapState, mapActions } from 'vuex'

  // API
  import { querySessionPage } from '@api/term/term.session.js'

  const closeOptions = [{
    value: false,
    label: '活跃会话'
  }, {
    value: true,
    label: '已关闭会话'
  }]

  export default {
    name: 'XTermSessionTable',
    data () {
      return {
        formStatus: {
          visible: false
        },
        tableData: [],
       // sessionInstances: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          uername: '',
          isClosed: null,
          extend: 1
        },
        title: '终端会话管理',
        closeOptions: closeOptions
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
      handlerPreviewAuditLog (row) {
        this.$refs.previewTermAuditLogDialog.initData(row.id)
        this.formStatus.visible = true
      },
      handlerSetSessionInstances (row) {
        this.$emit('handlerSelSession', row.sessionInstances)
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
        querySessionPage(requestBody)
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

  .select-bar {
    margin-left: 5px;
  }

  .buuton {
    margin-left: 5px;
  }
</style>
