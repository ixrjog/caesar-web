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
        <el-table-column prop="name" label="应用名称">
          <template slot-scope="props">
            <div>{{ props.row.name }}</div>
            <div>{{ props.row.comment }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="serverGroupId" label="服务器组">
          <template slot-scope="props">
            <span v-if="props.row.serverGroup !== null">{{ props.row.serverGroup.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="instances" label="应用实例" width="700">
          <template slot-scope="props">
            <div v-for="item in props.row.instances" :key="item.id">
              <el-tag type="primary" :style="{ color: item.env.color }">{{ item.instanceName }}
                <el-button type="text" style="margin-left: 10px; padding: 3px 0"
                           @click="handlerRowInstanceEdit(props.row, item)">编辑
                </el-button>
                <el-button type="text" style="padding: 3px 0" @click="handlerRowInstanceDel(item)">删除</el-button>
              </el-tag>
              <el-tag type="success" effect="dark" style="margin-left: 5px" v-if="item.deployment !== null">{{
                item.deployment.name}}
                <el-button type="text" style="padding: 3px 0" @click="handlerDeploymentDel(item.deployment.id)">删除
                </el-button>
              </el-tag>
              <el-tag type="warning" effect="dark" style="margin-left: 5px" v-if="item.service !== null">{{
                item.service.name}}
                <el-button type="text" style="padding: 3px 0" @click="handlerServiceDel(item.service.id)">删除
                </el-button>
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handlerRowInstanceAdd(scope.row)">新建</el-button>
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
      <KubernetesApplicationInstanceDialog ref="kubernetesApplicationInstanceDialog" :formStatus="formInstanceStatus"
                                           @closeDialog="fetchData"></KubernetesApplicationInstanceDialog>
      <KubernetesApplicationDialog ref="kubernetesApplicationDialog" :formStatus="formApplicationStatus"
                                   @closeDialog="fetchData"></KubernetesApplicationDialog>
    </template>
  </d2-container>
</template>

<script>
  import KubernetesApplicationInstanceDialog from '@/components/opscloud/kubernetes/KubernetesApplicationInstanceDialog'
  import KubernetesApplicationDialog from '@/components/opscloud/kubernetes/KubernetesApplicationDialog'

  // API
  import {
    delKubernetesApplicationInstanceById,
    delKubernetesDeploymentById,
    delKubernetesServiceById
  } from '@api/kubernetes/kubernetes.application.instance.js'
  import {
    queryKubernetesApplicationPage,
    delKubernetesApplicationById
  } from '@api/kubernetes/kubernetes.application.js'
  import { mapActions, mapState } from 'vuex'

  export default {
    data () {
      return {
        title: 'Kubernetes应用管理',
        formInstanceStatus: {
          visible: false,
          operationType: true,
          addTitle: '新增实例配置',
          updateTitle: '更新实例配置'
        },
        formApplicationStatus: {
          visible: false,
          operationType: true,
          addTitle: '新增应用配置',
          updateTitle: '更新应用配置'
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
          serverGroupId: '',
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
      KubernetesApplicationInstanceDialog,
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
        this.formApplicationStatus.visible = true
        this.formApplicationStatus.operationType = true
      },
      handlerRowEdit (row) {
        this.formApplicationStatus.visible = true
        this.formApplicationStatus.operationType = false
        let application = Object.assign({}, row)
        this.$refs.kubernetesApplicationDialog.initData(application)
      },
      handlerRowDel (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delKubernetesApplicationById(row.id).then(res => {
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
      handlerRowInstanceDel (applicationInstance) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delKubernetesApplicationInstanceById(applicationInstance.id).then(res => {
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
      handlerRowInstanceEdit (application, applicationInstance) {
        let _application = Object.assign({}, application)
        let _applicationInstance = Object.assign({}, applicationInstance)
        this.$refs.kubernetesApplicationInstanceDialog.initData(_application, _applicationInstance)
        this.formInstanceStatus.visible = true
        this.formInstanceStatus.operationType = false
      },
      handlerRowInstanceAdd (row) {
        let applicationInstance = {
          id: '',
          applicationId: row.id,
          envType: 0,
          envLabel: '',
          templateVariable: ''
        }
        this.$refs.kubernetesApplicationInstanceDialog.initData(row, applicationInstance)
        this.formInstanceStatus.visible = true
        this.formInstanceStatus.operationType = true
      },
      handlerDeploymentDel (id) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delKubernetesDeploymentById(id).then(res => {
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
      handlerServiceDel (id) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delKubernetesServiceById(id).then(res => {
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
        queryKubernetesApplicationPage(requestBody)
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
