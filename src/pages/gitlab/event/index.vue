<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-row style="margin-bottom: 5px" :gutter="24">
        <el-select v-model="queryParam.instanceId" filterable clearable class="select"
                   remote reserve-keyword placeholder="搜索实例" :remote-method="getInstance">
          <el-option
            v-for="item in instanceOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="queryParam.kind" clearable placeholder="事件分类" class="select">
          <el-option
            v-for="item in kindOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"
                  class="input"/>
        <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="instance" label="实例名称" width="180">
          <template slot-scope="props">
            <span>{{props.row.instance.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="objectKind" label="事件分类"></el-table-column>
        <el-table-column prop="ref" label="ref" width="300"></el-table-column>
        <el-table-column prop="sshUrl" label="sshUrl" width="300"></el-table-column>
        <el-table-column prop="isConsumed" label="消费">
          <template slot-scope="scope">
            <el-tag disable-transitions :type="scope.row.isConsumed | convertBooleanType">{{
              scope.row.isConsumed | convertBoolenText}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="事件事件"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="danger" plain size="mini" @click="handlerRowDel(scope.row)">消费</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @current-change="paginationCurrentChange"
                     :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                     :page-size="pagination.pageSize">
      </el-pagination>
    </template>
  </d2-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  // API
  import { queryGitlabInstancePage } from '@api/gitlab/gitlab.instance.js'
  import { queryGitlabEventPage } from '@api/gitlab/gitlab.event.js'

  import { convertBooleanType, convertBoolenText } from '@/filters/public.js'

  const kindOptions = [{
    value: 'push',
    label: 'PUSH'
  }, {
    value: 'tag_push',
    label: 'TAG_PUSH'
  }]

  export default {
    name: 'GitlabEvent',
    data () {
      return {
        title: 'Gitlab事件管理',
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
          queryName: '',
          kind: ''
        },
        instanceOptions: [],
        kindOptions: kindOptions
      }
    },
    filters: {
      convertBooleanType,
      convertBoolenText
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    mounted () {
      this.fetchData()
      this.getInstance()
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
      getInstance (queryName) {
        let requestBody = {
          'queryName': queryName,
          'extend': 0,
          'page': 1,
          'length': 10
        }
        queryGitlabInstancePage(requestBody)
          .then(res => {
            this.instanceOptions = res.body.data
          })
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        let requestBody = {
          'instanceId': this.queryParam.instanceId,
          'queryName': this.queryParam.queryName,
          'kind': this.queryParam.kind,
          'extend': 1,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryGitlabEventPage(requestBody)
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
    margin-left: 5px;
  }

  .select {
    margin-left: 10px;
  }
</style>
