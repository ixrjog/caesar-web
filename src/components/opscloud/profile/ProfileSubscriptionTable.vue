<template>
  <div>
    <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
      <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"
                class="input"/>
      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      <el-button @click="handlerAdd" style="margin-left: 5px">新建</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="vars">
              <editor v-model="props.row.vars" @init="editorInit" :lang="props.row.scriptLang" theme="kuroir"
                      width="500" height="80" :options="options"></editor>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="任务名称"></el-table-column>
      <el-table-column prop="subscriptionType" label="订阅类型"></el-table-column>
      <el-table-column prop="ansiblePlaybook" label="脚本名称">
        <template slot-scope="props">
          <span>{{ props.row.ansiblePlaybook.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hostPattern" label="主机模式">
        <template slot-scope="props">
          <span>{{ props.row.hostPattern }}</span>
          <div class="tag-group">
            <el-tag style="margin-right: 5px" v-for="item in props.row.servers" :key="item.id">
              {{ item.name}}-{{item.serialNumber}} {{ item.privateIp }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="executionTime" label="执行时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handlerRowPublish(scope.row)">发布</el-button>
          <el-button type="primary" plain size="mini" @click="handlerRowEdit(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handlerRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange"
                   :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <!-- cluster编辑对话框 -->
    <ProfileSubscriptionDialog ref="profileSubscriptionDialog" :formStatus="formStatus"
                               @closeDialog="fetchData"></ProfileSubscriptionDialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  // Component
  import ProfileSubscriptionDialog from '@/components/opscloud/dialog/ProfileSubscriptionDialog'
  // API
  import {
    queryProfileSubscriptionPage,
    delProfileSubscriptionById,
    publishProfileSubscriptionById
  } from '@api/profile/profile.subscription.js'

  export default {
    name: 'ProfileSubscriptionTable',
    data () {
      return {
        formStatus: {
          visible: false,
          operationType: true,
          addTitle: '新增订阅配置',
          updateTitle: '更新订阅配置'
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
      this.fetchData()
    },
    components: {
      editor: require('vue2-ace-editor'),
      ProfileSubscriptionDialog
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
      editorInit: function (ed) {
        // language extension prerequsite...
        require('brace/ext/language_tools')
        // language
        require('brace/mode/yaml')
        require('brace/mode/sh')
        require('brace/theme/chrome')
        require('brace/theme/kuroir')
        // snippet
        require('brace/snippets/yaml')
        ed.setReadOnly(true)
      },
      handlerRowEdit (row) {
        // user
        let profileSubscription = Object.assign({}, row)
        this.formStatus.visible = true
        this.formStatus.operationType = false
        this.$refs.profileSubscriptionDialog.initData(profileSubscription)
      },
      handlerRowDel (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delProfileSubscriptionById(row.id).then(res => {
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
      handlerAdd () {
        let profileSubscription = {
          id: '',
          name: '',
          subscriptionType: '',
          hostPattern: '',
          serverGroupId: 0,
          serverTaskId: 0,
          vars: '',
          comment: ''
        }
        this.$refs.profileSubscriptionDialog.initData(profileSubscription)
        // form
        this.formStatus.visible = true
        this.formStatus.operationType = true
      },
      // publishProfileSubscriptionById
      handlerRowPublish (row) {
        publishProfileSubscriptionById(row.id)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'info',
                message: '任务运行中'
              })
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        let requestBody = {
          'queryName': this.queryParam.queryName,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryProfileSubscriptionPage(requestBody)
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

  .input {
    display: inline-block;
    max-width: 200px;
  }

</style>
