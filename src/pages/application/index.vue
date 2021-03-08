<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-row style="margin-bottom: 5px" :gutter="24">
        <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"
                  class="input"/>
        <el-select v-model="queryParam.tagId" filterable clearable remote reserve-keyword class="select"
          placeholder="请输入关键词搜索标签" :remote-method="getTag" :loading="loading">
          <el-option
            v-for="item in tagOptions"
            :key="item.id"
            :label="item.tagKey"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
        <el-button style="margin-left: 5px" @click="handlerAdd">新增</el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="应用名称"></el-table-column>
        <el-table-column prop="applicationKey" label="key">
          <template slot-scope="props">
            <el-tag disable-transitions type="primary" plain size="mini">{{props.row.applicationKey}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="描述"></el-table-column>
        <el-table-column prop="tags" label="标签" width="300">
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
            <el-button type="primary" plain size="mini" @click="handlerRowPermissionEdit(scope.row)">权限</el-button>
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
      <!-- application编辑对话框 -->
      <ApplicationDialog ref="applicationDialog" :formStatus="formStatus"
                         @closeDialog="fetchData"></ApplicationDialog>
      <ApplicationPermissionDialog ref="applicationPermissionDialog" :formStatus="formPermissionStatus"
                                   @closeDialog="fetchData"></ApplicationPermissionDialog>
    </template>
  </d2-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  // Component
  import ApplicationPermissionDialog from '@/components/opscloud/application/ApplicationPermissionDialog'
  import ApplicationDialog from '@/components/opscloud/application/ApplicationDialog'
  import { queryTagPage } from '@api/tag/tag.js'

  import { queryApplicationPage, delApplicationById } from '@api/application/application.js'

  export default {
    name: 'ApplicationTable',
    data () {
      return {
        title: '应用管理',
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
          tagId: ''
        },
        tagOptions: [],
        formStatus: {
          visible: false,
          operationType: true,
          addTitle: '新增应用配置',
          updateTitle: '更新应用配置'
        },
        formPermissionStatus: {
          visible: false
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
      this.getTag('')
      this.fetchData()
    },
    components: {
      ApplicationDialog,
      ApplicationPermissionDialog
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
      handlerAdd () {
        this.formStatus.operationType = true
        let application = {
          id: '',
          name: '',
          applicationKey: '',
          kubernetesApplicationId: '',
          enableGitflow: false,
          engineType: 0,
          comment: ''
        }
        this.$refs.applicationDialog.initData(application)
        this.formStatus.visible = true
      },
      handlerRowEdit (row) {
        this.formStatus.operationType = false
        this.formStatus.visible = true
        this.$refs.applicationDialog.initData(Object.assign({}, row))
      },
      handlerRowDel (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delApplicationById(row.id).then(res => {
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
      handlerRowPermissionEdit (row) {
        this.formPermissionStatus.visible = true
        this.$refs.applicationPermissionDialog.initData(Object.assign({}, row))
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        let requestBody = {
          'queryName': this.queryParam.queryName,
          'tagId': this.queryParam.tagId,
          'extend': 1,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryApplicationPage(requestBody)
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
