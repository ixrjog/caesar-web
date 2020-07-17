<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px">
      <el-input v-model="queryParam.queryName" placeholder="关键字查询" style="display: inline-block; max-width:200px"/>
      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      <el-button @click="addItem" style="margin-left: 5px">新建</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="tags">
              <editor v-model="props.row.tags" @init="editorInit" lang="yaml" theme="kuroir"
                      width="400" height="100" :options="options"></editor>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="200px"></el-table-column>
      <el-table-column prop="playbook" label="playbook" width="600px">
        <template slot-scope="scope">
          <editor v-model="scope.row.playbook" @init="editorInit" lang="yaml" theme="kuroir"
                  height="200" :options="options"></editor>
        </template>
      </el-table-column>
      <el-table-column prop="vars" label="vars" width="400px">
        <template slot-scope="scope">
          <editor v-model="scope.row.extraVars" @init="editorInit" lang="yaml" theme="kuroir"
                  height="200" :options="options"></editor>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="editItem(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange"
                   layout="prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <PlaybookDialog :formStatus="formStatus" ref="playbookDialog" @closePlaybookDialog="fetchData"></PlaybookDialog>
  </div>
</template>

<script>
  // Component
  import PlaybookDialog from '@/components/opscloud/dialog/PlaybookDialog'

  // API
  import { queryPlaybookPage, delPlaybookById } from '@api/server/server.task.js'

  export default {
    data () {
      return {
        formStatus: {
          visible: false,
          addTitle: '新增playbook配置',
          updateTitle: '更新playbook配置',
          labelWidth: '100px',
          operationType: true
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
    name: 'AnsiblePlaybookTable',
    props: [],
    mounted () {
      this.fetchData()
    },
    components: {
      PlaybookDialog,
      editor: require('vue2-ace-editor')
    },
    methods: {
      editorInit: function (ed) {
        // language extension prerequsite...
        require('brace/ext/language_tools')
        // language
        require('brace/mode/yaml')
        require('brace/theme/chrome')
        require('brace/theme/kuroir')
        // snippet
        require('brace/snippets/yaml')
        ed.setReadOnly(true)
      },
      addItem () {
        let playbook = {
          id: '',
          name: '',
          tags: '',
          extraVars: '',
          playbook: ''
        }
        this.formStatus.operationType = true
        this.formStatus.visible = true
        this.$refs.scriptDialog.initData(playbook)
      },
      editItem (row) {
        let playbook = Object.assign({}, row)
        this.formStatus.operationType = false
        this.formStatus.visible = true
        this.$refs.playbookDialog.initData(playbook)
      },
      delItem (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delPlaybookById(row.id).then(res => {
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
        var requestBody = Object.assign({}, this.queryParam)
        requestBody.page = this.pagination.currentPage
        requestBody.length = this.pagination.pageSize
        queryPlaybookPage(requestBody)
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
</style>
