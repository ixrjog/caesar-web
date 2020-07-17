<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
        <el-select v-model="queryParam.clusterId" filterable clearable class="select"
                   remote reserve-keyword placeholder="搜索集群" :remote-method="getCluster" @change="handlerSelCluster">
          <el-option
            v-for="item in clusterOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="queryParam.namespaceId" filterable clearable class="select"
                   remote placeholder="选择命名空间" :remote-method="getNamespace" :disabled="queryParam.clusterId === ''">
          <el-option
            v-for="item in namespaceOptions"
            :key="item.id"
            :label="item.namespace"
            :value="item.id">
          </el-option>
        </el-select>
        <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"
                  class="input"/>
        <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
        <el-button @click="handlerSync" style="margin-left: 5px" :disabled="queryParam.namespaceId === ''">同步
        </el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="namespace" label="集群/命名空间" width="120">
          <template slot-scope="props">
            <span>{{props.row.cluster.name}} / {{props.row.namespace}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="labelApp" label="标签"></el-table-column>
        <el-table-column prop="application" label="应用">
          <template slot-scope="props">
            <span v-if="props.row.application != null">{{props.row.application.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="instance" label="实例">
          <template slot-scope="props">
            <span v-if="props.row.instance != null">{{props.row.instance.instanceName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deployment" label="镜像" width="700">
          <template slot-scope="props">
            <div class="tag-group">
              <span v-for="item in props.row.deployment.spec.template.spec.containers" :key="item.name">
                <el-tooltip class="item" effect="light" :content="item.name" placement="top-start">
                  <el-tag style="margin-left: 5px" :style="{ color: item.color }">{{ item.image }}</el-tag>
                </el-tooltip>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button plain size="mini" @click="handlerRowYAMLEdit(scope.row)">YAML</el-button>
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
  import {
    queryKubernetesClusterPage,
    queryKubernetesClusterNamespacePage
  } from '@api/kubernetes/kubernetes.cluster.js'
  import {
    queryKubernetesDeploymentPage,
    delKubernetesDeploymentById,
    syncKubernetesDeployment
  } from '@api/kubernetes/kubernetes.deployment.js'
  import { mapActions, mapState } from 'vuex'

  export default {
    data () {
      return {
        title: 'Kubernetes无状态管理',
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
          namespaceId: '',
          clusterId: ''
        },
        clusterOptions: [],
        namespaceOptions: []
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
      KubernetesEditYAMLDialog
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
      handlerRowYAMLEdit (row) {
        this.$refs.kubernetesEditYAMLDialog.initData(row.deploymentYAML)
        this.formStatus.visible = true
        this.formStatus.operationType = false
      },
      handlerSelCluster () {
        this.queryParam.namespaceId = ''
        this.getNamespace()
      },
      getNamespace () {
        let requestBody = {
          'queryName': '',
          'clusterId': this.queryParam.clusterId,
          'extend': 0,
          'page': 1,
          'length': 10
        }
        queryKubernetesClusterNamespacePage(requestBody)
          .then(res => {
            this.namespaceOptions = res.body.data
          })
      },
      handlerSync () {
        syncKubernetesDeployment(this.queryParam.namespaceId)
          .then(res => {
            this.$message({
              type: 'success',
              message: '后台同步中!'
            })
          })
      },
      handlerRowDel (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delKubernetesDeploymentById(row.id).then(res => {
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
          'namespaceId': this.queryParam.namespaceId,
          'extend': 1,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryKubernetesDeploymentPage(requestBody)
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
