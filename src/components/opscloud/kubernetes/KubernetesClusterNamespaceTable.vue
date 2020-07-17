<template>
  <div>
    <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
      <el-select v-model="queryParam.clusterId" filterable clearable class="select"
                 remote reserve-keyword placeholder="搜索集群" :remote-method="getCluster">
        <el-option
          v-for="item in clusterOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"
                class="input"/>
      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      <el-button @click="handlerAdd" style="margin-left: 5px">新建</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="cluster" label="集群">
        <template slot-scope="scope">
          <span>{{ scope.row.cluster.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="namespace" label="命名空间"></el-table-column>
      <el-table-column prop="env" label="环境" width="80">
        <template slot-scope="scope">
          <el-tag disable-transitions :style="{ color: scope.row.env.color }">{{scope.row.env.envName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column fixed="right" label="操作" width="380">
        <template slot-scope="scope">
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
    <!-- namespace编辑对话框 -->
    <KubernetesClusterNamespaceDialog ref="kubernetesClusterNamespaceDialog" :formStatus="formStatus"
                                      @closeDialog="fetchData"></KubernetesClusterNamespaceDialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  // Component
  import KubernetesClusterNamespaceDialog from '@/components/opscloud/kubernetes/KubernetesClusterNamespaceDialog'
  // API
  import {
    queryKubernetesClusterNamespacePage,
    delKubernetesClusterNamespaceById, queryKubernetesClusterPage
  } from '@api/kubernetes/kubernetes.cluster.js'

  export default {
    name: 'KubernetesClusterNamespaceTable',
    data () {
      return {
        formStatus: {
          visible: false,
          operationType: true,
          addTitle: '新增集群配置',
          updateTitle: '更新集群配置'
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
          clusterId: ''
        },
        clusterOptions: [],
        title: 'Kubernetes集群管理'
      }
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    mounted () {
      this.initPageSize()
      this.getCluster('')
      this.fetchData()
    },
    components: {
      KubernetesClusterNamespaceDialog
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
      getCluster (queryName) {
        let requestBody = {
          'queryName': queryName,
          'extend': 0,
          'page': 1,
          'length': 10
        }
        queryKubernetesClusterPage(requestBody)
          .then(res => {
            this.clusterOptions = res.body.data
          })
      },
      handlerRowEdit (row) {
        // user
        let namespace = Object.assign({}, row)
        this.$refs.kubernetesClusterNamespaceDialog.initData(namespace)
        this.formStatus.visible = true
        this.formStatus.operationType = false
      },
      handlerRowDel (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delKubernetesClusterNamespaceById(row.id).then(res => {
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
        let namespace = {
          id: '',
          clusterId: '',
          namespace: '',
          envType: 0,
          comment: ''
        }
        this.$refs.kubernetesClusterNamespaceDialog.initData(namespace)
        // form
        this.formStatus.visible = true
        this.formStatus.operationType = true
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        let requestBody = {
          'queryName': this.queryParam.queryName,
          'clusterId': this.queryParam.clusterId,
          'extend': 1,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryKubernetesClusterNamespacePage(requestBody)
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
