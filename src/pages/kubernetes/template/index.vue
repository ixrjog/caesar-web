<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
        <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"
                  class="input"/>
        <el-select v-model="queryParam.templateType" filterable clearable class="select" placeholder="选择模版类型">
          <el-option
            v-for="item in tplTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="queryParam.envType" clearable placeholder="环境" class="select">
          <el-option
            v-for="item in envTypeOptions"
            :key="item.id"
            :label="item.envName"
            :value="item.envType">
          </el-option>
        </el-select>
        <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
        <el-button style="margin-left: 5px" @click="handlerYAMLAdd">新增</el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="模版">
                <editor v-model="props.row.templateYaml" @init="editorInit" lang="yaml" theme="kuroir"
                        width="1000" height="400" :options="options"></editor>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="templateType" label="模版类型"></el-table-column>
        <el-table-column prop="env" label="环境">
          <template slot-scope="scope">
            <el-tag disable-transitions :style="{color: scope.row.env.color}">{{scope.row.env.envName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="描述"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handlerRowYAMLEdit(scope.row)">YAML</el-button>
            <el-button type="danger" plain size="mini" @click="handlerRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @current-change="paginationCurrentChange"
                     :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                     :page-size="pagination.pageSize">
      </el-pagination>
      <!-- namespace编辑对话框 -->
      <KubernetesEditYAMLDialog ref="kubernetesEditYAMLDialog" :formStatus="formStatus"
                                @closeDialog="fetchData"></KubernetesEditYAMLDialog>
    </template>
  </d2-container>
</template>

<script>
  import KubernetesEditYAMLDialog from '@/components/opscloud/kubernetes/KubernetesEditYAMLDialog'

  // API
  import { queryEnvPage } from '@api/env/env.js'
  import { queryKubernetesTemplatePage, delKubernetesTemplateById } from '@api/kubernetes/kubernetes.template.js'
  import { mapActions, mapState } from 'vuex'

  const tplTypeOptions = [{
    value: 'DEPLOYMENT',
    label: '无状态模版'
  }, {
    value: 'SERVICE',
    label: '服务模版'
  }]

  export default {
    data () {
      return {
        title: 'Kubernetes模版管理',
        formStatus: {
          visible: false,
          operationType: true,
          addTitle: '新增YAML模版',
          updateTitle: '更新YAML模版'
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
          queryName: '',
          envType: '',
          templateType: ''
        },
        tplTypeOptions: tplTypeOptions,
        envTypeOptions: []
      }
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    mounted () {
      this.initPageSize()
      this.getEnvType()
      this.fetchData()
    },
    components: {
      KubernetesEditYAMLDialog,
      editor: require('vue2-ace-editor')
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
        require('brace/theme/chrome')
        require('brace/theme/kuroir')
        // snippet
        require('brace/snippets/yaml')
        ed.setReadOnly(true)
      },
      getEnvType () {
        queryEnvPage('', '', 1, 20)
          .then(res => {
            this.envTypeOptions = res.body.data
          })
      },
      handlerYAMLAdd (row) {
        let template = {
          id: '',
          name: '',
          templateType: '',
          templateYaml: '',
          envType: 0,
          comment: ''
        }
        this.$refs.kubernetesEditYAMLDialog.initData(template, tplTypeOptions, this.envTypeOptions)
        this.formStatus.visible = true
        this.formStatus.operationType = true
      },
      handlerRowYAMLEdit (row) {
        this.$refs.kubernetesEditYAMLDialog.initData(row, tplTypeOptions, this.envTypeOptions)
        this.formStatus.visible = true
        this.formStatus.operationType = false
      },
      handlerSelCluster () {
        this.queryParam.namespaceId = ''
        this.getNamespace()
      },
      handlerRowDel (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delKubernetesTemplateById(row.id).then(res => {
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
        let requestBody = Object.assign({}, this.queryParam)
        requestBody.page = this.pagination.currentPage
        requestBody.length = this.pagination.pageSize
        queryKubernetesTemplatePage(requestBody)
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
  .input {
    display: inline-block;
    max-width: 200px;
    margin-right: 5px;
  }

  .select {
    margin-right: 5px;
  }

</style>
