<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-row style="margin-bottom: 5px" :gutter="24">
        <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"
                  class="input"/>
        <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
        <el-button @click="handlerAdd" style="margin-left: 5px">新增</el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="tplName" label="模版名称"></el-table-column>
        <el-table-column prop="tplType" label="模版类型" width="180">
          <template slot-scope="props">
            <el-tag disable-transitions type="primary" plain size="mini">{{props.row.tplType}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tplVersion" label="模版版本"></el-table-column>
        <el-table-column prop="comment" label="描述"></el-table-column>
        <el-table-column prop="tags" label="标签">
          <template slot-scope="props">
            <business-tags :tags="props.row.tags"></business-tags>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handlerRowTagEdit(scope.row)">标签</el-button>
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
      <TagTransferDialog :formStatus="formTagTransferStatus" ref="tagTransferDialog"
                         @closeDialog="fetchData"></TagTransferDialog>
      <JobTplDialog ref="jobTplDialog" :formStatus="formStatus"
                    @closeDialog="fetchData"></JobTplDialog>
    </template>
  </d2-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  // Component
  import TagTransferDialog from '@/components/opscloud/dialog/TagTransferDialog'
  import JobTplDialog from '@/components/opscloud/jenkins/JobTplDialog'

  import { queryBusinessTag, queryTagPage } from '@api/tag/tag.js'
  import { queryJobTplPage, delJobTplById } from '@api/jenkins/jenkins.tpl.js'
  import BusinessTags from '../../../../components/opscloud/common/BusinessTags'

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
    components: {
      BusinessTags,
      TagTransferDialog,
      JobTplDialog
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
      handlerAdd () {
        let jobTpl = {
          id: '',
          name: '',
          jenkinsInstanceId: '',
          tplName: '',
          tplType: '',
          tplVersion: 1,
          tplHash: '',
          parameterYaml: '',
          comment: ''
        }
        this.formStatus.operationType = true
        this.formStatus.visible = true
        this.$refs.jobTplDialog.initData(Object.assign({}, jobTpl))
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
      handlerRowEdit (row) {
        this.formStatus.operationType = false
        this.formStatus.visible = true
        this.$refs.jobTplDialog.initData(Object.assign({}, row))
      },
      handlerRowDel (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delJobTplById(row.id).then(res => {
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
