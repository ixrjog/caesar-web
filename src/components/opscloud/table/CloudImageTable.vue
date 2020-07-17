<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px">
      <el-input v-model="queryParam.queryName" placeholder="关键字查询" class="input-search-bar"/>
      <el-select v-model="queryParam.isActive" clearable placeholder="有效" class="search-bar">
        <el-option
          v-for="item in activeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" class="search-bar">查询</el-button>
      <el-button @click="handleSync" class="search-bar" :loading="syncLoading">同步</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="账户uid">
              <span>{{ props.row.uid }}</span>
            </el-form-item>
            <el-form-item label="账户名称">
              <span>{{ props.row.accountName }}</span>
            </el-form-item>
            <el-form-item label="系统类型">
              <span>{{ props.row.osType }}</span>
            </el-form-item>
            <el-form-item label="平台">
              <span>{{ props.row.platform }}</span>
            </el-form-item>
            <el-form-item label="镜像id">
              <span>{{ props.row.imageId }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="imageName" label="镜像名称"></el-table-column>
      <el-table-column prop="regionId" label="地区id"></el-table-column>
      <el-table-column prop="imageSize" label="容量(GiB)"></el-table-column>
      <el-table-column prop="osNameEn" label="系统"></el-table-column>
      <el-table-column prop="creationTime" label="创建时间"></el-table-column>
      <el-table-column prop="serverStatus" label="有效">
        <template slot-scope="scope">
          <el-tag class="filters" :type="scope.row.isActive | getActiveType" size="small">
            {{scope.row.isActive | getActiveText}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isDeleted" label="被删除" v-if="false">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.isDeleted == 1" size="small" type="danger">已删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button :type="scope.row.isActive === 0 ? 'success' : 'info'" plain size="mini"
                     @click="setItemActive(scope.row)">{{scope.row.isActive === 0 ? '有效' : '无效'}}
          </el-button>
          <el-button type="primary" plain size="mini" @click="addItem(scope.row)" v-show="scope.row.serverStatus == 0">
            导入
          </el-button>
          <el-button type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <!-- server编辑-->
    <ServerDialog :formStatus="formServerStatus" ref="serverDialog" @closeServerDialog="fetchData"></ServerDialog>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  // Component
  import ServerDialog from '@/components/opscloud/dialog/ServerDialog'
  // Filters
  import { getActiveType, getActiveText } from '@/filters/public.js'
  // API
  import {
    fuzzyQueryCloudImagePage,
    syncCloudImageByKey,
    deleteCloudImageById,
    setCloudImageActiveById
  } from '@api/cloud/cloud.image.js'

  export default {
    data () {
      return {
        formServerStatus: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          addTitle: '新增服务器配置',
          updateTitle: '更新服务器配置'
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
          regionId: '',
          isActive: -1,
          isDeleted: -1
        },
        activeOptions: [{
          value: -1,
          label: '全部'
        }, {
          value: 0,
          label: '无效'
        }, {
          value: 1,
          label: '有效'
        }],
        syncLoading: false
      }
    },
    name: 'cloud-image-table',
    props: ['formStatus'],
    mounted () {
      this.initPageSize()
      this.fetchData()
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    components: {
      ServerDialog
    },
    filters: {
      getActiveType,
      getActiveText
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
      delItem (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCloudImageById(row.id).then(res => {
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
      setItemActive (row) {
        setCloudImageActiveById(row.id).then(res => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '设置成功!'
          })
        })
      },
      addItem (row) {
        this.formServerStatus.operationType = true
        this.formServerStatus.visible = true
        var serverData = {
          serverGroup: {},
          id: '',
          name: (row.serverName != null ? row.serverName : row.instanceName),
          serverGroupId: '',
          loginType: 0,
          loginUser: 'root',
          envType: 4,
          publicIp: row.publicIp,
          privateIp: row.privateIp,
          serverType: this.formStatus.serverType,
          area: row.zone,
          serialNumber: 0,
          monitorStatus: -1,
          comment: row.comment,
          cloudServerId: row.id
        }
        this.$refs.serverDialog.initData(serverData, [])
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        var requestBody = Object.assign({}, this.queryParam)
        requestBody.cloudType = this.formStatus.cloudType
        requestBody.page = this.pagination.currentPage
        requestBody.length = this.pagination.pageSize
        fuzzyQueryCloudImagePage(requestBody)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
          })
      },
      handleSync () {
        this.syncLoading = true
        setTimeout(() => {
          syncCloudImageByKey(this.formStatus.cloudImageKey)
            .then(res => {
              this.$message({
                message: '后台同步数据中',
                type: 'success'
              })
              this.fetchData()
              this.syncLoading = false
            })
        }, 300)
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

  .input-search-bar {
    display: inline-block;
    max-width: 200px;
    margin-right: 5px;
  }

  .search-bar {
    margin-right: 5px;
  }
</style>
