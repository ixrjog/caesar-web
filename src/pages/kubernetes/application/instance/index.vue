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
        <el-button style="margin-left: 5px" @click="handlerAdd">新增</el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="application" label="应用名称">
          <template slot-scope="props">
            <span>{{props.row.application.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="instanceName" label="实例名称"></el-table-column>
        <el-table-column prop="env" label="环境" width="80">
          <template slot-scope="props">
            <el-tag disable-transitions :style="{ color: props.row.env.color }">{{props.row.env.envName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deployment" label="无状态">
          <template slot-scope="props">
            <div v-if="props.row.deployment !== null">
              <el-tag type="success" effect="dark" style="margin-left: 5px">{{props.row.deployment.name}}</el-tag>
              <el-tooltip class="item" effect="dark" content="容器组数量" placement="top-start">
                <el-tag type="primary" style="margin-left: 5px">{{props.row.deployment.availableReplicas}}/{{props.row.deployment.replicas}}</el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="service" label="服务">
          <template slot-scope="props">
            <div v-if="props.row.service !== null">
              <el-tag type="warning" effect="dark" style="margin-left: 5px">{{props.row.service.name}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
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
      <KubernetesApplicationDialog ref="kubernetesApplicationDialog" :formStatus="formStatus"
                                   @closeDialog="fetchData"></KubernetesApplicationDialog>
    </template>
  </d2-container>
</template>

<script>
  import KubernetesApplicationDialog from '@/components/opscloud/kubernetes/KubernetesApplicationDialog'

  // API
  import {
    queryKubernetesApplicationInstancePage,
    delKubernetesApplicationInstanceById
  } from '@api/kubernetes/kubernetes.application.instance.js'
  import { mapActions, mapState } from 'vuex'

  export default {
    data () {
      return {
        title: 'Kubernetes应用实例管理',
        formStatus: {
          visible: false,
          operationType: true,
          addTitle: '新增集群配置',
          updateTitle: '更新集群配置'
        },
        tableData: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          queryName: '',
          applicationId: '',
          extend: 1
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
      KubernetesApplicationDialog
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
      handlerAdd (row) {
        let application = {
          id: '',
          name: '',
          serverGroupId: '',
          businessId: '',
          comment: ''
        }
        this.$refs.kubernetesApplicationDialog.initData(application)
        this.formStatus.visible = true
        this.formStatus.operationType = true
      },
      handlerRowEdit (row) {
        this.$refs.kubernetesApplicationDialog.initData(row)
        this.formStatus.visible = true
        this.formStatus.operationType = false
      },
      handlerRowDel (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delKubernetesApplicationInstanceById(row.id).then(res => {
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
        queryKubernetesApplicationInstancePage(requestBody)
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
