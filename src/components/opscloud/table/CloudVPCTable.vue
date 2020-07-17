<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px">
      <el-input v-model="queryParam.queryName" placeholder="关键字查询" style="display: inline-block; max-width:200px"/>
      <el-select v-model="queryParam.isActive" clearable placeholder="有效" style="margin-left: 5px">
        <el-option
          v-for="item in activeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      <el-button @click="handleSync" style="margin-left: 5px" :loading="syncLoading">同步</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="账户uid">
              <span>{{ props.row.uid }}</span>
            </el-form-item>
            <el-form-item label="cidrBlock">
              <span>{{ props.row.cidrBlock }}</span>
            </el-form-item>
            <el-form-item label="描述">
              <span>{{ props.row.description }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.creationTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="vpcName" label="专有网络名称" width="120"></el-table-column>
      <el-table-column prop="regionId" label="regionId" width="120"></el-table-column>
      <el-table-column prop="securityGroups" label="安全组" width="400">
        <template slot-scope="scope">
          <el-col :span="12" v-for="item in scope.row.securityGroups" :key="item.id">
            <el-tooltip :content="item.securityGroupId" placement="top" effect="light">
              <el-tag :type="item.isActive === 1? 'success' : 'info'" style="margin-left: 5px">
                {{item.securityGroupName}}
              </el-tag>
            </el-tooltip>
          </el-col>
        </template>
      </el-table-column>
      <el-table-column label="虚拟交换机" width="400">
        <template slot-scope="scope">
          <el-tree :data="scope.row.vswitchData"></el-tree>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="有效">
        <template slot-scope="scope">
          <el-tag class="filters" :type="scope.row.isActive | getActiveType" size="small">
            {{scope.row.isActive | getActiveText}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button :type="scope.row.isActive === 0 ? 'success' : 'info'" plain size="mini"
                     @click="setItemActive(scope.row)">{{scope.row.isActive === 0 ? '有效' : '无效'}}
          </el-button>
          <el-button type="primary" plain size="mini" @click="editItem(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <!-- vpc编辑-->
    <CloudVPCDialog :formStatus="formCloudVPCStatus" ref="cloudVPCDialog"
                    @closeCloudVPCDialog="fetchData"></CloudVPCDialog>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  // Component
  import CloudVPCDialog from '@/components/opscloud/dialog/CloudVPCDialog'
  // Filters
  import { getActiveType, getActiveText } from '@/filters/public.js'
  // API
  import {
    fuzzyQueryCloudVPCPage,
    syncCloudVPCByKey,
    deleteCloudVPCById,
    setCloudVPCActiveById
  } from '@api/cloud/cloud.vpc.js'

  const activeOptions = [{
    value: -1,
    label: '全部'
  }, {
    value: 0,
    label: '无效'
  }, {
    value: 1,
    label: '有效'
  }]

  export default {
    data () {
      return {
        formCloudVPCStatus: {
          visible: false,
          labelWidth: '150px'
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
          extend: 1,
          queryName: '',
          regionId: '',
          isActive: -1,
          isDeleted: -1
        },
        activeOptions: activeOptions,
        syncLoading: false
      }
    },
    name: 'CloudVPCTable',
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
      CloudVPCDialog
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
      setItemActive (row) {
        setCloudVPCActiveById(row.id).then(res => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '设置成功!'
          })
        })
      },
      editItem (row) {
        // form
        this.formCloudVPCStatus.visible = true
        // var vpcData = Object.assign({}, row)
        this.$refs.cloudVPCDialog.initData(this.cloudType, row.vpcId)
      },
      delItem (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCloudVPCById(row.id).then(res => {
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
      convertVswitchData () {
        if (this.tableData === null || this.tableData.length === 0) return
        for (var i = 0; i < this.tableData.length; i++) {
          var vswitchData = []
          var row = this.tableData[i]
          for (var key in row.vswitchMap) {
            var children = []
            var vswList = row.vswitchMap[key]
            for (var index in vswList) {
              var vsw = vswList[index]
              var vswChildren = {
                label: vsw.vswitchName + ' (' + vsw.cidrBlock + ' : ' + vsw.availableIpAddressCount + ')'
              }
              children.push(vswChildren)
            }
            var zone = {
              label: key + ' (' + children.length + ')',
              children: children
            }
            vswitchData.push(zone)
          }
          row.vswitchData = vswitchData
        }
      },
      fetchData () {
        this.loading = true
        var requestBody = Object.assign({}, this.queryParam)
        requestBody.cloudType = this.formStatus.cloudType
        requestBody.page = this.pagination.currentPage
        requestBody.length = this.pagination.pageSize
        fuzzyQueryCloudVPCPage(requestBody)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
            this.convertVswitchData()
          })
      },
      handleSync () {
        this.syncLoading = true
        setTimeout(() => {
          syncCloudVPCByKey(this.formStatus.cloudVPCKey)
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
</style>
