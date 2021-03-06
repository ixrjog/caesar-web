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
        <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"
                  class="input"/>
        <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
        <el-button @click="handlerSync" :disabled="queryParam.instanceId === ''" style="margin-left: 5px">同步</el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="instance" label="实例名称" width="180">
          <template slot-scope="props">
            <span>{{props.row.instance.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="群组名称"></el-table-column>
        <el-table-column prop="applicationKey" label="绑定应用key">
          <template slot-scope="props">
            <el-tag disable-transitions type="primary" plain size="mini" v-show="props.row.applicationKey !== null">
              {{props.row.applicationKey}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="groupVisibility" label="访问" width="180">
          <template slot-scope="props">
            <el-tag disable-transitions type="primary" plain size="mini">{{props.row.groupVisibility}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="webUrl" label="webUrl" width="400"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="tags" label="标签">
          <template slot-scope="props">
            <business-tags :tags="props.row.tags"></business-tags>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handlerRowTagEdit(scope.row)">标签</el-button>
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
      <TagTransferDialog :formStatus="formStatus.tagTransfer" ref="tagTransferDialog"
                         @closeDialog="fetchData"></TagTransferDialog>
    </template>
  </d2-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  // Component
  import TagTransferDialog from '@/components/opscloud/dialog/TagTransferDialog'

  // API
  import { queryBusinessTag, queryTagPage } from '@api/tag/tag.js'
  import { queryGitlabInstancePage } from '@api/gitlab/gitlab.instance.js'

  import { queryGitlabGroupPage, delGitlabGroupById, syncGitlabGroup } from '@api/gitlab/gitlab.group.js'
  import BusinessTags from '../../../components/opscloud/common/BusinessTags'

  export default {
    name: 'GitlabGroupTable',
    data () {
      return {
        title: 'Gitlab群组管理',
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
        instanceOptions: [],
        businessType: 15, // GitlabGroup
        formStatus: {
          tagTransfer: {
            visible: false,
            title: '编辑服务器标签'
          }
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
      this.getInstance()
    },
    components: {
      TagTransferDialog,
      BusinessTags
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
      handlerSync () {
        syncGitlabGroup(this.queryParam.instanceId)
          .then(res => {
            this.$message({
              type: 'success',
              message: '任务后台执行中!'
            })
          })
      },
      handlerRowTagEdit (row) {
        this.formStatus.tagTransfer.visible = true
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
        this.formStatus.tagTransfer.visible = true
        this.$refs.tagTransferDialog.initData(tagTransfer)
      },
      handlerRowDel (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delGitlabGroupById(row.id).then(res => {
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
          'instanceId': this.queryParam.instanceId,
          'queryName': this.queryParam.queryName,
          'extend': 1,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryGitlabGroupPage(requestBody)
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
