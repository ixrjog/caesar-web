<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
        <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"
                  class="input"/>
        <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
        <el-button @click="handlerAdd" style="margin-left: 5px">新增</el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="comment" label="描述"></el-table-column>
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
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handlerRowTagEdit(scope.row)">标签</el-button>
            <el-button type="primary" plain size="mini" @click="handlerRowTest(scope.row)">测试</el-button>
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
      <!-- tag编辑-->
      <TagTransferDialog :formStatus="formTagTransferStatus" ref="tagTransferDialog"
                         @closeDialog="fetchData"></TagTransferDialog>
      <DingtalkDialog ref="dingtalkDialog" :formStatus="formStatus"
                      @closeDialog="fetchData"></DingtalkDialog>
    </template>
  </d2-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  // Component
  import TagTransferDialog from '@/components/opscloud/dialog/TagTransferDialog'
  import DingtalkDialog from '@/components/opscloud/dingtalk/DingtalkDialog'

  // API
  import { queryBusinessTag, queryTagPage } from '@api/tag/tag.js'
  import { queryDingtalkPage, delDingtalkById, testDingtalkById } from '@api/dingtalk/dingtalk.js'

  export default {
    name: 'DingtalkTable',
    data () {
      return {
        title: '钉钉通知管理',
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
        },
        businessType: 11,
        formTagTransferStatus: {
          visible: false,
          title: '编辑钉钉标签'
        },
        formStatus: {
          visible: false,
          operationType: true,
          addTitle: '新增钉钉配置',
          updateTitle: '更新钉钉配置'
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
      TagTransferDialog,
      DingtalkDialog
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
      handlerRowTagEdit (row) {
        this.formTagTransferStatus.visible = true
        let tagTransfer = {
          businessId: row.id,
          businessType: this.businessType,
          tagIds: [],
          tagOptions: []
        }
        queryTagPage('', 1, 100)
          .then(res => {
            tagTransfer.tagOptions = res.body.data
          })
        queryBusinessTag(this.businessType, tagTransfer.businessId, '')
          .then(res => {
            for (let index in res.body) {
              tagTransfer.tagIds.push(res.body[index].id)
            }
          })
        this.formTagTransferStatus.visible = true
        this.$refs.tagTransferDialog.initData(tagTransfer)
      },
      handlerRowTest (row) {
        testDingtalkById(row.id).then(res => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '已发送测试消息!'
          })
        })
      },
      handlerRowDel (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delDingtalkById(row.id).then(res => {
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
        let dingtalk = {
          id: '',
          name: '',
          dingtalkToken: '',
          comment: ''
        }
        this.formStatus.operationType = true
        this.formStatus.visible = true
        this.$refs.dingtalkDialog.initData(dingtalk)
      },
      handlerRowEdit (row) {
        this.formStatus.operationType = false
        this.formStatus.visible = true
        this.$refs.dingtalkDialog.initData(Object.assign({}, row))
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
        queryDingtalkPage(requestBody)
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
  }

  .select {
    margin-right: 5px;
  }
</style>
