<template>
  <div>
    <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
      <el-select v-model="queryParam.accountUid" filterable clearable class="select"
                 remote reserve-keyword placeholder="选择主账户">
        <el-option
          v-for="item in accountOptions"
          :key="item.uid"
          :label="item.name"
          :value="item.uid">
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.uid }}</span>
        </el-option>
      </el-select>
      <el-input v-model="queryParam.queryName" placeholder="关键字查询" class="input"/>
      <el-select v-model="queryParam.inWorkorder" clearable placeholder="工单申请" class="select">
        <el-option
          v-for="item in workorderOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" class="button">查询</el-button>
      <el-button @click="handlerSync" class="button" :loading="syncLoading">同步</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="说明">
              <span>{{ props.row.comment }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="accountUid" label="主账户uid"></el-table-column>
      <el-table-column prop="policyName" label="策略名称"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="policyType" label="类型" width="80">
        <template slot-scope="scope">
          <el-tag class="filters" :type="scope.row.policyType === 'System' ? 'danger':'primary'" size="small">
            {{scope.row.policyType === 'System' ? '系统':'自定义'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="workflow" label="工单申请" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.inWorkorder === 0 ? 'danger' : 'success'" disable-transitions>
            {{scope.row.inWorkorder ===
            0 ? '禁止' : '允许'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handlerRowSet(scope.row)">工单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]"
                   @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  // Filters
  import { getRAMUserType, getRAMUserTypeText } from '@/filters/cloud.js'
  // API
  import { queryAliyunAccount } from '@api/cloud/cloud.js'
  import {
    queryAliyunRAMPolicyPage,
    syncAliyunRAMPolicy,
    setAliyunRAMPolicyWorkorderById
  } from '@api/cloud/aliyun.ram.policy.js'

  const workorderOptions = [
    {
      value: 0,
      label: '禁止'
    }, {
      value: 1,
      label: '允许'
    }]

  export default {
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
        },
        queryParam: {
          accountUid: '',
          inWorkorder: '',
          queryName: ''
        },
        workorderOptions: workorderOptions,
        syncLoading: false,
        accountOptions: []
      }
    },
    name: 'AliyunRAMPolicyTable',
    mounted () {
      this.initPageSize()
      this.fetchData()
      this.getAliyunAccount()
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    components: {},
    filters: {
      getRAMUserType,
      getRAMUserTypeText
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
      getAliyunAccount () {
        queryAliyunAccount()
          .then(res => {
            this.accountOptions = res.body
          })
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      handlerRowSet (row) {
        setAliyunRAMPolicyWorkorderById(row.id)
          .then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '设置成功!'
            })
          })
      },
      handlerSync () {
        this.syncLoading = true
        syncAliyunRAMPolicy()
          .then(res => {
            this.syncLoading = false
            this.fetchData()
            this.$message({
              type: 'success',
              message: '同步完成!'
            })
          })
      },
      fetchData () {
        this.loading = true
        let requestBody = Object.assign({}, this.queryParam)
        requestBody.page = this.pagination.currentPage
        requestBody.length = this.pagination.pageSize
        queryAliyunRAMPolicyPage(requestBody)
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

  .input {
    display: inline-block;
    max-width: 200px;
    margin-right: 5px;
  }

  .select {
    margin-right: 5px;
  }

  .button {
    margin-right: 5px;
  }
</style>
