<template>
  <div>
    <el-card shadow="hover">
      <el-row style="margin-bottom: 5px" :gutter="24">
        <el-input v-model="queryParam.queryName" placeholder="输入关键字模糊查询"
                  class="input"/>
        <el-tooltip class="item" effect="light" content="管理员可查看所有应用" placement="top-start">
          <el-checkbox v-model="queryParam.isAll" @change="handlerChangeAll">显示全部</el-checkbox>
        </el-tooltip>
        <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="expand" v-if="false">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="key">
                <el-tag disable-transitions type="primary" plain size="mini">{{props.row.applicationKey}}</el-tag>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="应用名称">
          <template slot-scope="props">
            <el-tooltip class="item" effect="light" :content="props.row.comment" placement="top-start">
              <span>{{ props.row.name }}</span>
            </el-tooltip>
            <business-tags :tags="props.row.tags"></business-tags>
            <el-rate v-model="props.row.userPermission.rate" @change="handlerSetApplicationRate(props.row)"
                     v-if="!queryParam.isAll"></el-rate>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-dropdown split-button type="primary" plain @click="handlerRowSel(scope.row)">
              <i class="el-icon-search"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="fa fa-user"><span @click="handlerRowPermissionEdit(scope.row)">权限配置</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination background @current-change="paginationCurrentChange"
                     @size-change="handleSizeChange" :pager-count="5"
                     layout="prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                     :page-size="pagination.pageSize">
      </el-pagination>
      <!-- application编辑对话框 -->
      <ApplicationDialog ref="applicationDialog" :formStatus="formStatus"
                         @closeDialog="fetchData"></ApplicationDialog>
      <ApplicationPermissionDialog ref="applicationPermissionDialog" :formStatus="formPermissionStatus"
                                   @closeDialog="fetchData"></ApplicationPermissionDialog>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

// Component
import ApplicationDialog from '@/components/opscloud/application/ApplicationDialog'
import ApplicationPermissionDialog from '@/components/opscloud/application/ApplicationPermissionDialog'

import { queryMyApplicationPage, updateMyApplicationRate } from '@api/application/application.js'
import BusinessTags from '../common/BusinessTags'

export default {
  name: 'MyApplicationTable',
  data () {
    return {
      title: '应用管理',
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
        instanceId: '',
        queryName: '',
        isAll: false
      },
      formStatus: {
        visible: false,
        operationType: true,
        addTitle: '新增应用配置',
        updateTitle: '更新应用配置'
      },
      formPermissionStatus: {
        visible: false
      },
      isSelected: false
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
    ApplicationDialog,
    ApplicationPermissionDialog,
    BusinessTags
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
    handlerRowSel (row) {
      this.isSelected = true
      this.$emit('handlerSelApplication', row)
    },
    handlerRowEdit (row) {
      this.formStatus.operationType = false
      this.formStatus.visible = true
      this.$refs.applicationDialog.initData(Object.assign({}, row))
    },
    handlerRowPermissionEdit (row) {
      this.formPermissionStatus.visible = true
      this.$refs.applicationPermissionDialog.initData(Object.assign({}, row))
    },
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.fetchData()
    },
    handlerSetApplicationRate (row) {
      let requestBody = {
        'userPermissionId': row.userPermission.id,
        'rate': row.userPermission.rate
      }
      updateMyApplicationRate(requestBody)
        .then(res => {
          if (res.success) {
            this.fetchData()
          }
        })
    },
    handlerChangeAll () {
      if (!this.queryParam.isAll) this.queryParam.queryName = ''
      this.fetchData()
    },
    fetchData () {
      this.loading = true
      let requestBody = {
        'queryName': this.queryParam.queryName,
        'extend': 1,
        'isAll': this.queryParam.isAll,
        'page': this.pagination.currentPage,
        'length': this.pagination.pageSize
      }
      queryMyApplicationPage(requestBody)
        .then(res => {
          this.tableData = res.body.data
          this.pagination.total = res.body.totalNum
          this.loading = false
          if (!this.isSelected) {
            if (this.tableData.length !== 0) {
              this.handlerRowSel(this.tableData[0])
            }
          }
        })
    }
  }
}
</script>

<style scoped>

  .el-checkbox {
    margin-left: 10px;
  }

</style>
