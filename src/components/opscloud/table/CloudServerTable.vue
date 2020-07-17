<template>
  <div>
    <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="24">
      <el-input v-model="queryParam.serverName" placeholder="服务器名称" class="input"/>
      <el-input v-model="queryParam.queryIp" placeholder="ip" class="input"/>
      <el-select v-model="queryParam.serverStatus" clearable placeholder="状态" class="search">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" class="button">查询</el-button>
      <el-button @click="handleSync" class="button" :loading="syncLoading">同步</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="实例id">
              <span>{{ props.row.instanceId }}</span>
            </el-form-item>
            <el-form-item label="服务器名称">
              <span>{{ props.row.serverName }}</span>
            </el-form-item>
            <el-form-item label="实例类型">
              <span>{{ props.row.instanceType }}</span>
            </el-form-item>
            <el-form-item v-if="props.row.vpcId != null && props.row.vpcId != ''" label="vpcId">
              <span>{{ props.row.vpcId }}</span>
            </el-form-item>
            <el-form-item label="镜像id">
              <span>{{ props.row.imageId }}</span>
            </el-form-item>
            <el-form-item label="系统盘容量(GiB)">
              <span>{{ props.row.systemDiskSize }}</span>
            </el-form-item>
            <el-form-item v-if="props.row.dataDiskSize != null && props.row.dataDiskSize != 0" label="数据盘容量(GiB)">
              <span>{{ props.row.dataDiskSize }}</span>
            </el-form-item>
            <el-form-item label="付费类型">
              <span>{{ props.row.chargeType }}</span>
            </el-form-item>
            <el-form-item label="自动续费状态">
              <span>{{ props.row.renewalStatus }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="instanceName" label="实例名"></el-table-column>
      <el-table-column prop="publicIp" label="公网ip"></el-table-column>
      <el-table-column prop="privateIp" label="私网ip"></el-table-column>
      <el-table-column prop="cpu" label="cpu" width="80" v-if="formStatus.showCpuColumn"></el-table-column>
      <el-table-column prop="memory" label="内存(GiB)" width="100" v-if="formStatus.showCpuColumn">
        <template slot-scope="scope">
          <span>{{scope.row.memory | getMemoryText}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="zone" label="区"></el-table-column>
      <el-table-column prop="serverStatus" label="状态">
        <template slot-scope="scope">
          <el-tag class="filters" :type="scope.row.serverStatus | getStatusTagType" size="small ">
            {{scope.row.serverStatus | getStatusTagText}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <!--            <el-button type="primary" plain size="mini" @click="updateItemNeedAuth(scope.row)">{{scope.row.needAuth ===-->
          <!--              0 ? '鉴权' : '不鉴权'}}-->
          <!--            </el-button>-->
          <el-button type="primary" plain size="mini" @click="handlerRowAdd(scope.row)"
                     v-show="scope.row.serverStatus == 0">
            导入
          </el-button>
          <el-button type="danger" plain size="mini" @click="handlerRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]"
                   @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <!-- server编辑-->
    <ServerDialog :formStatus="formServerStatus" ref="serverDialog" @closeServerDialog="fetchData"></ServerDialog>
  </div>
</template>

<script>
  // Component
  import ServerDialog from '@/components/opscloud/dialog/ServerDialog'
  // Filters
  import { getStatusTagType, getStatusTagText, getMemoryText } from '@/filters/server.js'
  // API
  import { queryCloudServerPage, syncCloudServerByKey, deleteCloudServerById } from '@api/cloud/cloud.server.js'
  import { mapActions, mapState } from 'vuex'

  const statusOptions = [{
    value: 0,
    label: '新建(未录入)'
  }, {
    value: 1,
    label: '已录入'
  }, {
    value: 2,
    label: '标记删除'
  }, {
    value: 3,
    label: '服务器表未删除但云服务器已销毁'
  }]

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
          serverName: '',
          queryIp: '',
          serverStatus: ''
        },
        statusOptions: statusOptions,
        syncLoading: false
      }
    },
    name: 'CloudServerTable',
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
      getStatusTagType,
      getStatusTagText,
      getMemoryText
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
      handlerRowDel (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCloudServerById(row.id).then(res => {
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
      handlerRowAdd (row) {
        this.formServerStatus.operationType = true
        this.formServerStatus.visible = true
        let serverData = {
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
        queryCloudServerPage(
          this.formStatus.serverType, this.queryParam.serverName, this.queryParam.queryIp, this.queryParam.serverStatus, this.pagination.currentPage, this.pagination.pageSize)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
          })
      },
      handleSync () {
        this.syncLoading = true
        setTimeout(() => {
          syncCloudServerByKey(this.formStatus.cloudServerKey)
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

  .input {
    display: inline-block;
    max-width: 200px;
    margin-right: 5px;
  }

  .search {
    margin-right: 5px;
  }

  .button {
    margin-left: 5px;
  }
</style>
