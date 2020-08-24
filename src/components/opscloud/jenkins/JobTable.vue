<template>
  <div>
    <el-row style="margin-bottom: 5px" :gutter="24">
      <el-input v-model.trim="jobTpl.name" disabled placeholder="应用名称" class="input"></el-input>
      <el-button @click="handlerUpgrade" style="margin-left: 5px" :disabled="jobTpl === ''">全部升级</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="任务名称">
        <template slot-scope="props">
          <el-tooltip class="item" effect="light" :content="props.row.jobKey" placement="top-start">
            <span>{{ props.row.name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="引擎模版">
        <template slot-scope="props">
          <div class="tag-group">
              <span v-for="item in props.row.jobEngines" :key="item.id">
                <el-tooltip class="item" effect="light" :content="item.comment" placement="top-start">
                  <el-tag style="margin-left: 5px">{{ item.jenkinsInstance.name }} - {{ item.name }} [version: {{ item.tplVersion }}]</el-tag>
                </el-tooltip>
              </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" v-show="scope.row.needUpgrade"
                     @click="handlerRowTplUpgrade(scope.row)">升级
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange"
                   :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  import { queryCiJobTplPage, upgradeCiJobTplByJobId } from '@api/jenkins/jenkins.tpl.js'

  export default {
    name: 'MyCiJobTable',
    data () {
      return {
        jobTpl: '',
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
    beforeDestroy () {
    },
    components: {},
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
      initData (jobTpl) {
        this.jobTpl = jobTpl
        this.fetchData()
      },
      handlerUpgrade () {

      },
      handlerRowTplUpgrade (row) {
        upgradeCiJobTplByJobId(row.id)
          .then(res => {
            this.$message({
              type: 'success',
              message: '升级成功!'
            })
            this.fetchData()
          })
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        if (this.tableData.length === 0) {
          this.loading = true
        }
        let requestBody = {
          'jobTplId': this.jobTpl.id,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryCiJobTplPage(requestBody)
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
