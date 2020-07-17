<template>
  <el-dialog :title="title"
             :before-close="closeDialog"
             :visible.sync="formStatus.visible">
    <el-tabs v-model="activeName">
      <el-tab-pane label="安全组配置" name="securityGroup">
        <el-input v-model.trim="querySecurityGroupParam.queryName" placeholder="关键字查询"
                  style="display: inline-block; max-width:200px"/>
        <el-select v-model="querySecurityGroupParam.isActive" clearable placeholder="有效" style="margin-left: 5px">
          <el-option
            v-for="item in activeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="fetchSecurityGroupData" style="margin-left: 5px">查询</el-button>
        <el-table :data="securityGroupTableData" style="width: 100%" v-loading="securityGroupTableLoading">
          <el-table-column prop="securityGroupId" label="安全组id"></el-table-column>
          <el-table-column prop="securityGroupName" label="安全组名称"></el-table-column>
          <el-table-column prop="regionId" label="地区id"></el-table-column>
          <el-table-column prop="isActive" label="有效">
            <template slot-scope="scope">
              <el-tag class="filters" :type="scope.row.isActive | getActiveType" size="small">
                {{scope.row.isActive | getActiveText}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button :type="scope.row.isActive === 0 ? 'success' : 'info'" plain size="mini"
                         @click="setSecurityGroupActive(scope.row)">{{scope.row.isActive === 0 ? '有效' : '无效'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background @current-change="securityGroupPaginationCurrentChange"
                       layout="prev, pager, next" :total="securityGroupPagination.total"
                       :current-page="securityGroupPagination.currentPage"
                       :page-size="securityGroupPagination.pageSize">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="虚拟交换机配置" name="vswitch">
        <el-input v-model.trim="queryVswitchParam.queryName" placeholder="关键字查询"
                  style="display: inline-block; max-width:200px"/>
        <el-select v-model="queryVswitchParam.isActive" clearable placeholder="有效" style="margin-left: 5px">
          <el-option
            v-for="item in activeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="fetchVswitchData" style="margin-left: 5px">查询</el-button>
        <el-table :data="vswitchTableData" style="width: 100%" v-loading="vswitchTableLoading">
          <el-table-column prop="vswitchId" label="虚拟交换机id"></el-table-column>
          <el-table-column prop="vswitchName" label="虚拟交换机名称"></el-table-column>
          <el-table-column prop="zoneId" label="可用区"></el-table-column>
          <el-table-column prop="isActive" label="有效">
            <template slot-scope="scope">
              <el-tag class="filters" :type="scope.row.isActive | getActiveType" size="small">
                {{scope.row.isActive | getActiveText}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button :type="scope.row.isActive === 0 ? 'success' : 'info'" plain size="mini"
                         @click="setVswitchActive(scope.row)">{{scope.row.isActive === 0 ? '有效' : '无效'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background @current-change="vswitchPaginationCurrentChange"
                       layout="prev, pager, next" :total="vswitchPagination.total"
                       :current-page="vswitchPagination.currentPage"
                       :page-size="vswitchPagination.pageSize">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // Filters
  import { getActiveType, getActiveText } from '@/filters/public.js'
  // api
  import {
    queryCloudVPCSecurityGroupPage,
    setCloudVPCSecurityGroupActiveById,
    queryCloudVPCVSwitchPage,
    setCloudVPCVSwitchActiveById
  } from '@api/cloud/cloud.vpc.js'

  export default {
    name: 'CloudVPCDialog',
    data () {
      return {
        title: 'VPC配置',
        vpcId: '',
        activeName: 'securityGroup',
        securityGroupTableData: [],
        securityGroupTableLoading: false,
        querySecurityGroupParam: {
          queryName: '',
          isActive: -1
        },
        securityGroupPagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        vswitchTableData: [],
        vswitchTableLoading: false,
        queryVswitchParam: {
          queryName: '',
          isActive: -1
        },
        vswitchPagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
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
        }]
      }
    },
    props: ['formStatus'],
    mixins: [],
    components: {},
    mounted () {
    },
    filters: {
      getActiveType,
      getActiveText
    },
    methods: {
      closeDialog () {
        this.cloudType = ''
        // this.templateData = {}
        this.formStatus.visible = false
        this.$emit('closeCloudVPCDialog')
      },
      convertVswitchData () {
        // if (this.vswitchData === null || this.vswitchData.length === 0) return
        this.vswitchTree = []
        for (var i = 0; i < this.vswitchData.length; i++) {
          var vsw = this.vswitchData[i]
          var vswitch = {
            id: vsw.vswitchId,
            label: vsw.vswitchName + ' ( 可用ip: ' + vsw.availableIpAddressCount + ' )'
          }
          this.vswitchTree.push(vswitch)
        }
      },
      setSecurityGroupActive (row) {
        setCloudVPCSecurityGroupActiveById(row.id).then(res => {
          this.fetchSecurityGroupData()
          this.$message({
            type: 'success',
            message: '设置成功!'
          })
        })
      },
      setVswitchActive (row) {
        setCloudVPCVSwitchActiveById(row.id).then(res => {
          this.fetchVswitchData()
          this.$message({
            type: 'success',
            message: '设置成功!'
          })
        })
      },
      initData (cloudType, vpcId) {
        this.cloudType = cloudType
        this.vpcId = vpcId
        this.fetchSecurityGroupData()
        this.fetchVswitchData()
      },
      securityGroupPaginationCurrentChange (currentPage) {
        this.securityGroupPagination.currentPage = currentPage
        this.fetchSecurityGroupData()
      },
      fetchSecurityGroupData () {
        this.securityGroupTableLoading = true
        var securityGroupQueryParam = {
          queryName: this.querySecurityGroupParam.queryName,
          isActive: this.querySecurityGroupParam.isActive,
          extend: 0,
          vpcId: this.vpcId,
          page: this.securityGroupPagination.currentPage,
          length: this.securityGroupPagination.pageSize
        }
        queryCloudVPCSecurityGroupPage(securityGroupQueryParam)
          .then(res => {
            this.securityGroupTableData = res.body.data
            this.securityGroupPagination.total = res.body.totalNum
            this.securityGroupTableLoading = false
          })
      },
      vswitchPaginationCurrentChange (currentPage) {
        this.vswitchPagination.currentPage = currentPage
        this.fetchVswitchData()
      },
      fetchVswitchData () {
        this.vswitchTableLoading = true
        var vswitchQueryParam = {
          queryName: this.queryVswitchParam.queryName,
          isActive: this.queryVswitchParam.isActive,
          vpcId: this.vpcId,
          page: this.vswitchPagination.currentPage,
          length: this.vswitchPagination.pageSize
        }
        queryCloudVPCVSwitchPage(vswitchQueryParam)
          .then(res => {
            this.vswitchTableData = res.body.data
            this.vswitchPagination.total = res.body.totalNum
            this.vswitchTableLoading = false
          })
      }
    }
  }
</script>

<style scoped>

</style>
