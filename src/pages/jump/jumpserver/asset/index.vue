<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-col>
        <el-tabs tab-position="top" style="height: 200px;">
          <el-tab-pane label="资产">
            <!--用户搜索-->
            <div style="margin-bottom: 5px">
              <!--            :gutter="24"-->
              <el-row style="margin-bottom: 5px">
                <el-input v-model.trim="queryAssetParam.queryName" clearable placeholder="名称"
                          style="display: inline-block; max-width:200px"/>
                <el-select v-model.trim="queryAssetParam.assetsNodeId" filterable clearable
                           remote reserve-keyword placeholder="搜索资产节点" :remote-method="getAssetsNode">
                  <el-option
                    v-for="item in assetsNodeOptions"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model.trim="queryAssetParam.isActive" clearable placeholder="用户是否有效">
                  <el-option
                    v-for="item in activeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-button @click="fetchData">查询</el-button>
                <el-button @click="syncAsset" :loading="syncAssetLoading">同步</el-button>
              </el-row>
            </div>
            <!--资产table-->
            <el-row style="margin-bottom: 5px">
              <el-table :data="tableData" style="width: 100%" v-loading="assetLoading">
                <el-table-column prop="hostname" label="主机名"></el-table-column>
                <el-table-column prop="publicIp" label="公网ip"></el-table-column>
                <el-table-column prop="ip" label="私网ip"></el-table-column>

                <el-table-column prop="isActive" label="有效">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.isActive ? 'success' : 'info'" size="small">{{scope.row.isActive ? '有效':
                      '无效'}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="comment" label="描述"></el-table-column>
                <el-table-column fixed="right" label="操作" width="280">
                  <template slot-scope="scope">
                    <el-button type="danger" plain size="mini" @click="handlerDelAsset(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!--资产翻页-->
              <el-pagination background @current-change="paginationCurrentChange"  :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                             layout="sizes, prev, pager, next" :total="pagination.total"
                             :current-page="pagination.currentPage"
                             :page-size="pagination.pageSize">
              </el-pagination>
            </el-row>

          </el-tab-pane>
          <el-tab-pane label="帮助">
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </template>
  </d2-container>
</template>

<script>
  // Component
  // import ServerAttributeCard from '@/components/opscloud/card/ServerAttributeCard'
  // Filters
  import { getUserRoleType, getUserRoleText } from '@/filters/jumpserver.js'
  // API
  import {
    fuzzyQueryAssetPage,
    syncAsset,
    queryAssetsNodePage,
    delAssetByAssetId
  } from '@api/jump/jump.jumpserver.asset.js'
  import { mapActions, mapState } from 'vuex'

  const activeOptions = [
    {
      value: 1,
      label: '有效'
    }, {
      value: 0,
      label: '无效'
    }]

  export default {
    data () {
      return {
        assetsNodeOptions: [],
        activeOptions: activeOptions,
        // 资产
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryAssetParam: {
          assetsNodeId: '',
          queryName: '',
          isActive: '',
          extend: 0
        },
        syncAssetLoading: false,
        assetLoading: false,
        tableData: [],
        title: 'Jump资产管理'
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
      this.getAssetsNode('')
    },
    filters: {
      getUserRoleType,
      getUserRoleText
    },
    // components: {
    //   ServerAttributeCard
    // },
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
      getAssetsNode (value) {
        queryAssetsNodePage(value, 1, 20)
          .then(res => {
            this.assetsNodeOptions = res.body.data
          })
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      syncAsset () {
        this.syncAssetLoading = true
        syncAsset()
          .then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '同步完成!'
            })
            this.syncAssetLoading = false
          })
      },
      handlerDelAsset (row) {
        delAssetByAssetId(row.id)
          .then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
      },
      fetchData () {
        this.assetLoading = true
        let requestBody = Object.assign({}, this.queryAssetParam)
        requestBody.page = this.pagination.currentPage
        requestBody.length = this.pagination.pageSize
        fuzzyQueryAssetPage(requestBody)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.assetLoading = false
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

  .el-input {
    display: inline-block;
    max-width: 200px;
  }

  .el-select {
    margin-left: 5px;
    margin-right: 5px;
  }
</style>
