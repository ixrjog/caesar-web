<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px">
      <el-select v-model.trim="queryParam.taskType" clearable placeholder="类型">
        <el-option
          v-for="item in taskTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="user" label="用户">
        <template slot-scope="props">
          <span v-if="props.row.user !== null && props.row.user.displayName !== null">{{ props.row.user.displayName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taskType" label="类型">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{scope.row.taskType | getServerTaskText}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="taskSize" label="机器数量">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{scope.row.taskSize}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="finalized" label="完成">
        <template slot-scope="scope">
          <el-tag :type="scope.row.finalized === 1 ? 'success' : 'danger'" disable-transitions>{{scope.row.finalized === 1 ? '完成' : '进行'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ago" label="时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handlerPreview(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  // Filters
  import { getServerTaskText } from '@/filters/task.js'

  // API
  import { queryServerTaskHistoryPage } from '@api/server/server.task.js'

  const taskTypeOptions = [{
    value: 0,
    label: '批量命令'
  }, {
    value: 1,
    label: '批量脚本'
  }, {
    value: 2,
    label: 'Playbook'
  }]

  export default {
    name: 'ServerTaskTable',
    data () {
      return {
        tableData: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          userId: '',
          taskType: ''
        },
        taskTypeOptions: taskTypeOptions,
        title: '历史任务查询'
      }
    },
    filters: {
      getServerTaskText
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
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      handlerPreview (row) {
        this.$emit('previewTask', row.id)
      },
      fetchData () {
        this.loading = true
        let requestBody = Object.assign({}, this.queryParam)
        requestBody.page = this.pagination.currentPage
        requestBody.length = this.pagination.pageSize
        queryServerTaskHistoryPage(requestBody)
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

  .select {
    margin-right: 5px;
  }
</style>
