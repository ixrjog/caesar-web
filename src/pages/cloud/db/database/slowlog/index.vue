<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <div style="margin-bottom: 5px" v-show="this.database === null">
        <el-input v-model.trim="queryParam.queryName" clearable placeholder="关键字查询" style="display: inline-block;max-width:200px"/>
        <el-select v-model.trim="queryParam.cloudDbType" clearable placeholder="云数据库类型" style="margin-left: 5px">
          <el-option
            v-for="item in cloudDbTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model.trim="queryParam.envType" clearable placeholder="环境" style="margin-left: 5px">
          <el-option
            v-for="item in envTypeOptions"
            :key="item.id"
            :label="item.envName"
            :value="item.envType">
          </el-option>
        </el-select>
        <el-select
          v-model.trim="queryParam.tagId" filterable clearable remote reserve-keyword
          placeholder="搜索标签" :remote-method="getTag" :loading="loading" style="margin-left: 5px">
          <el-option
            v-for="item in tagOptions"
            :key="item.id"
            :label="item.tagKey"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" v-show="this.database === null" v-loading="loading">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="描述" v-show="props.row.dbDescription != null && props.row.dbDescription != ''">
                <span>{{ props.row.dbDescription }}</span>
              </el-form-item>
              <el-form-item label="备注" v-show="props.row.comment != null && props.row.comment != ''">
                <span>{{ props.row.comment }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <span>{{ props.row.dbStatus }}</span>
              </el-form-item>
              <el-form-item label="字符集">
                <span>{{ props.row.characterSetName }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="dbInstanceId" label="实例id"></el-table-column>
        <el-table-column prop="dbName" label="数据库名称"></el-table-column>
        <el-table-column prop="name" label="环境" width="120">
          <template slot-scope="scope">
            <el-tag disable-transitions :style="{ color: scope.row.env.color }">{{scope.row.env.envName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="engine" label="engine" width="120">
          <template slot-scope="scope">
            <el-tag class="filters" size="small ">{{scope.row.engine}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签">
          <template slot-scope="scope">
            <div class="tag-group">
              <el-tag style="margin-left: 5px"
                      v-for="item in scope.row.tags"
                      :key="item.id"
                      :style="{ color: item.color }">
                {{ item.tagKey }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="selectItem(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @current-change="paginationCurrentChange" v-show="this.database === null"
                     layout="prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                     :page-size="pagination.pageSize">
      </el-pagination>

      <div style="margin-bottom: 5px" v-show="this.database !== null">
        <el-date-picker
          v-model="picker"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-ddZ"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-button @click="fetchSlowLogData" style="margin-left: 5px">查询</el-button>
        <el-button @click="goBack" style="margin-left: 5px">返回</el-button>
      </div>
      <el-table :data="slowLogTableData" style="width: 100%" v-show="this.database !== null" v-loading="slowLogTableLoading">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="平均执行时间(秒)" v-show="props.row.avgExecutionTime != null && props.row.avgExecutionTime != ''">
                <span>{{ props.row.avgExecutionTime }}</span>
              </el-form-item>
              <el-form-item label="最大执行时长(秒)" v-show="props.row.maxExecutionTime != null && props.row.maxExecutionTime != ''">
                <span>{{ props.row.maxExecutionTime }}</span>
              </el-form-item>
              <el-form-item label="最大锁定时长(秒)"  v-show="props.row.maxLockTime != null">
                <span>{{ props.row.maxLockTime }}</span>
              </el-form-item>
              <el-form-item label="MySQL总执行次数" v-show="props.row.mySQLTotalExecutionCounts != null">
                <span>{{ props.row.mySQLTotalExecutionCounts }}</span>
              </el-form-item>
              <el-form-item label="MySQL总执行时间(秒)" v-show="props.row.mySQLTotalExecutionTimes != null">
                <span>{{ props.row.mySQLTotalExecutionTimes }}</span>
              </el-form-item>
              <el-form-item label="解析SQL最大行数" v-show="props.row.parseMaxRowCount != null">
                <span>{{ props.row.parseMaxRowCount }}</span>
              </el-form-item>
              <el-form-item label="解析SQL总行数" v-show="props.row.parseTotalRowCounts != null">
                <span>{{ props.row.parseTotalRowCounts }}</span>
              </el-form-item>
              <el-form-item label="返回SQL最大行数" v-show="props.row.returnMaxRowCount != null">
                <span>{{ props.row.returnMaxRowCount }}</span>
              </el-form-item>
              <el-form-item label="返回SQL总行数" v-show="props.row.returnTotalRowCounts != null">
              <span>{{ props.row.returnTotalRowCounts }}</span>
              </el-form-item>
              <el-form-item label="锁定总时长(秒)" v-show="props.row.totalLockTimes != null">
                <span>{{ props.row.totalLockTimes }}</span>
              </el-form-item>
              <el-form-item label="数据报表生成日期" v-show="props.row.reportTime != null">
                <span>{{ props.row.reportTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="sqltext" label="sql">
          <template slot-scope="scope">
            <d2-highlight :code="scope.row.sqltext" lang="sql"/>
          </template>
        </el-table-column>
        <el-table-column prop="mySQLTotalExecutionTimes" label="总执行时间" width="100"></el-table-column>
      </el-table>
      <el-pagination background @current-change="slowLogPaginationCurrentChange" v-show="this.database !== null"  :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next" :total="slowLogPagination.total" :current-page="slowLogPagination.currentPage"
                     :page-size="slowLogPagination.pageSize">
      </el-pagination>
    </template>
  </d2-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  // Filters
  import { getCloudDBTypeTagType, getCloudDBTypeTagText } from '@/filters/cloud.js'
  // API
  import { queryEnvPage } from '@api/env/env.js'
  import { queryTagPage } from '@api/tag/tag.js'
  import { fuzzyQueryCloudDBDatabasePage, queryCloudDBDatabaseSlowLogPage } from '@api/cloud/cloud.db.database.js'

  export default {
    data () {
      return {
        database: null,
        tableData: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        slowLogTableData: [],
        slowLogTableLoading: false,
        queryParam: {
          cloudDbType: '',
          queryName: '',
          envType: '',
          tagId: '',
          uid: ''
        },
        querySlowLogParam: {
          startTime: '',
          endTime: ''
        },
        slowLogPagination: {
          currentPage: 1,
          pageSize: 30,
          total: 0
        },
        cloudDbTypeOptions: [{
          value: 2,
          label: 'Aliyun-RDS-Mysql'
        }, {
          value: 3,
          label: 'AWS-RDS-Mysql'
        }],
        envTypeOptions: [],
        tagOptions: [],
        businessType: 5,
        title: '云数据库慢日志查询',
        picker: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近二周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }]
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
      this.getEnvType()
      this.getTag('')
    },
    components: {},
    filters: {
      getCloudDBTypeTagType,
      getCloudDBTypeTagText
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
      getTag (tagKey) {
        queryTagPage(tagKey, 1, 100)
          .then(res => {
            this.tagOptions = res.body.data
          })
      },
      getEnvType () {
        queryEnvPage('', '', 1, 20)
          .then(res => {
            this.envTypeOptions = res.body.data
          })
      },
      selectItem (item) {
        this.database = item
      },
      goBack () {
        this.database = null
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
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      slowLogPaginationCurrentChange (currentPage) {
        this.slowLogPagination.currentPage = currentPage
        this.fetchSlowLogData()
      },
      fetchSlowLogData () {
        var requestBody = {
          'cloudDbType': this.database.cloudDbType,
          'dbName': this.database.dbName,
          'dbInstanceId': this.database.dbInstanceId,
          'startTime': this.picker[0],
          'endTime': this.picker[1],
          'page': this.slowLogPagination.currentPage,
          'length': this.slowLogPagination.pageSize
        }

        this.slowLogTableLoading = true
        queryCloudDBDatabaseSlowLogPage(requestBody)
          .then(res => {
            this.slowLogTableData = res.body.data
            this.slowLogPagination.total = res.body.totalNum
            this.slowLogTableLoading = false
          })
      },
      fetchData () {
        this.loading = true
        var requestBody = {
          'queryName': this.queryParam.queryName,
          'cloudDbType': this.queryParam.cloudDbType,
          'uid': this.queryParam.uid,
          'extend': 1,
          'envType': this.queryParam.envType,
          'tagId': this.queryParam.tagId,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        fuzzyQueryCloudDBDatabasePage(requestBody)
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
</style>
