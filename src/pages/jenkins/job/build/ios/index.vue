<template>
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
</template>

<script>

  // Component
  import TagTransferDialog from '@/components/opscloud/dialog/TagTransferDialog'
  import JobTplDialog from '@/components/opscloud/jenkins/JobTplDialog'

  import { queryBusinessTag, queryTagPage } from '@api/tag/tag.js'
  import { queryJobTplPage, delJobTplById } from '@api/jenkins/jenkins.tpl.js'

  export default {
    name: 'IosBuildDetails',
    data () {
      return {
        title: 'iOS构建任务详情',
        buildId: '',
        tableData: [],
        options: {
          stripe: true
        },
        loading: false
      }
    },
    mounted () {
      this.buildId = this.$route.query.buildId
      this.fetchData()
    },
    components: {
    },
    methods: {
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
  }

  .select {
    margin-right: 5px;
  }
</style>
