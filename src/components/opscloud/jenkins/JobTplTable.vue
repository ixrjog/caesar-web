<template>
  <div>
    <el-row style="margin-bottom: 5px" :gutter="24">
      <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"
                class="input"/>
      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="tplType" label="模版类型">
        <template slot-scope="props">
          <el-tag disable-transitions type="primary" plain size="mini">{{props.row.tplType}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tplVersion" label="模版版本"></el-table-column>
      <el-table-column prop="tags" label="标签">
        <template slot-scope="props">
          <div class="tag-group">
              <span v-for="item in props.row.tags" :key="item.id">
                <el-tooltip class="item" effect="light" :content="item.comment" placement="top-start">
                  <el-tag style="margin-left: 5px" :style="{ color: item.color }">{{ item.tagKey }}</el-tag>
                </el-tooltip>
              </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handlerRowSel(scope.row)">详情</el-button>
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

  // Component
  import { queryJobTplPage } from '@api/jenkins/jenkins.tpl.js'

  export default {
    name: 'JobTplTable',
    data () {
      return {
        title: '任务模版管理',
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
        },
        formStatus: {
          visible: false,
          operationType: true,
          addTitle: '新增任务模版配置',
          updateTitle: '更新任务模版配置'
        },
        businessType: 10,
        formTagTransferStatus: {
          visible: false,
          title: '编辑任务模版标签'
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
      handlerRowSel (row) {
        this.$emit('handlerSelTemplate', row)
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
        queryJobTplPage(requestBody)
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
    margin-left: 10px;
  }

  .select {
    margin-right: 5px;
  }
</style>
