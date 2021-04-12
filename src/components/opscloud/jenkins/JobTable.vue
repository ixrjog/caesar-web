<template>
  <div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="任务名称">
        <template slot-scope="props">
          <el-tooltip class="item" effect="light" :content="props.row.jobKey" placement="top-start">
            <span>{{ props.row.name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="引擎模版" width="550px">
        <template slot-scope="props">
          <div class="tag-group">
              <span v-for="item in props.row.jobEngines" :key="item.id">
                  <el-tag effect="dark" :type="item.needUpgrade ? 'warning' : 'success'">{{ item.jenkinsInstance.name }} - {{ item.name }} [version: {{ item.tplVersion }}]
                   <el-button type="text" style="margin-left: 10px; padding: 3px 0"
                              @click="handlerOpenJob(item)"><span
                     style="color: #535353">打开任务</span></el-button></el-tag>
              </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" v-show="scope.row.needUpgrade"
                     @click="handlerRowTplUpgrade(scope.row)">升级
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange"
                   :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total"
                   :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  import {
    queryCiJobTplPage,
    queryCdJobTplPage,
    upgradeCiJobTplByJobId,
    upgradeCdJobTplByJobId,
    upgradeJobTplByTplId
  } from '@api/jenkins/jenkins.tpl.js'

  export default {
    name: 'MyCiJobTable',
    props: ['queryType', 'jobTpl'], // true ciJob ; false cdJob
    data () {
      return {
        tableData: [],
        options: {
          stripe: true
        },
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
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
      handlerOpenJob (jobEngine) {
        window.open(jobEngine.jobUrl)
      },
      handlerUpgrade () {
        if (this.jobTpl == null) return
        upgradeJobTplByTplId(this.jobTpl.id)
          .then(res => {
            this.$message({
              type: 'success',
              message: '升级成功!'
            })
            this.fetchData()
          })
      },
      handlerRowTplUpgrade (row) {
        if (this.queryType) {
          upgradeCiJobTplByJobId(row.id)
            .then(res => {
              this.$message({
                type: 'success',
                message: '升级成功!'
              })
              this.fetchData()
            })
        } else {
          upgradeCdJobTplByJobId(row.id)
            .then(res => {
              this.$message({
                type: 'success',
                message: '升级成功!'
              })
              this.fetchData()
            })
        }
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData (queryName) {
        this.loading = true
        let requestBody = {
          'jobTplId': this.jobTpl.id,
          'queryName': queryName,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        if (this.queryType) {
          queryCiJobTplPage(requestBody)
            .then(res => {
              this.tableData = res.body.data
              this.pagination.total = res.body.totalNum
              this.loading = false
            })
        } else {
          queryCdJobTplPage(requestBody)
            .then(res => {
              this.tableData = res.body.data
              this.pagination.total = res.body.totalNum
              this.loading = false
            })
        }
      }
    }
  }
</script>

<style scoped>

  .el-dropdown {
    vertical-align: top;
  }

  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

</style>
