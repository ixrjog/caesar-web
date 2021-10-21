<template>
  <d2-container>
    <template>
      <div>
        <h1>{{ title }}</h1>
      </div>
      <el-row style="margin-bottom: 5px" :gutter="24">
        <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"
                  class="input"/>
        <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
        <el-button @click="handlerSync" style="margin-left: 5px">同步</el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="regionId" label="regionId"></el-table-column>
        <el-table-column prop="instanceId" label="实例Id"></el-table-column>
        <el-table-column prop="instanceName" label="实例名称"></el-table-column>
        <el-table-column label="接入点" width="400">
          <template slot-scope="scope">
            <el-row style="margin-bottom: 5px">
              <el-tag size="small" style="margin-right: 5px">公网</el-tag>
              <span>{{ scope.row.internetEndpoint }}</span>
            </el-row>
            <el-row style="margin-bottom: 5px">
              <el-tag size="small" style="margin-right: 5px">私网</el-tag>
              <span>{{ scope.row.intranetEndpoint }}</span>
            </el-row>
            <el-row style="margin-bottom: 5px">
              <el-tag size="small" style="margin-right: 5px">VPC</el-tag>
              <span>{{ scope.row.vpcEndpoint }}</span>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="serverStatus" label="有效">
          <template slot-scope="scope">
            <el-tag class="filters" :type="scope.row.isActive | getActiveType" size="small">
              {{ scope.row.isActive | getActiveText }}
            </el-tag>
          </template>
        </el-table-column>
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
            <el-button :type="!scope.row.isActive ? 'success' : 'info'" plain size="mini"
                       @click="handlerRowSetActive(scope.row)">{{ !scope.row.isActive ? '有效' : '无效' }}
            </el-button>
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
      <TagTransferDialog :formStatus="formTagTransferStatus" ref="tagTransferDialog"
                         @closeDialog="fetchData"></TagTransferDialog>
    </template>
  </d2-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

// Component
import TagTransferDialog from '@/components/opscloud/dialog/TagTransferDialog'
// Filters
import { getActiveType, getActiveText } from '@/filters/public.js'
// API
import { queryBusinessTag, queryTagPage } from '@api/tag/tag.js'
import {
  deleteInstanceById,
  queryCRInstancePage,
  setInstanceActive,
  syncCRInstance
} from '@api/aliyun/aliyun.cr.instance'

export default {
  name: 'AliyunCRTable',
  data () {
    return {
      title: '阿里云镜像管理',
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
      businessType: 15,
      formTagTransferStatus: {
        visible: false,
        title: '编辑对象存储标签'
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
  filters: {
    getActiveType,
    getActiveText
  },
  components: {
    TagTransferDialog
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
    handlerSync () {
      syncCRInstance()
        .then(res => {
          this.$message({
            type: 'success',
            message: '任务后台执行中!'
          })
        })
    },
    handlerRowSetActive (row) {
      setInstanceActive(row.id).then(res => {
        this.fetchData()
        this.$message({
          type: 'success',
          message: '设置成功!'
        })
      })
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
    handlerRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteInstanceById(row.id).then(res => {
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
      queryCRInstancePage(requestBody)
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
