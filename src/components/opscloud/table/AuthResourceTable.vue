<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px">
      <el-select v-model="queryParam.groupId" filterable clearable
                 remote reserve-keyword placeholder="输入关键词搜索资源组" :remote-method="getGroup" :loading="loading"
                 style="display: inline-block; max-width:200px">
        <el-option
          v-for="item in groupOptions"
          :key="item.id"
          :label="item.groupCode"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="queryParam.resourceName" placeholder="资源路径"
                style="display: inline-block; max-width:200px; margin-left: 5px"/>
      <el-select v-model="queryParam.needAuth" clearable placeholder="鉴权" style="margin-left: 5px">
        <el-option
          v-for="item in authOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" style="margin-left: 5px">查询</el-button>
      <el-button @click="addItem" style="margin-left: 5px">新增</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="groupCode" label="资源组"></el-table-column>
      <el-table-column prop="resourceName" label="资源路径"></el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column prop="needAuth" label="鉴权">
        <template slot-scope="scope">
          <el-tag :type="scope.row.needAuth === 0 ? 'success' : 'danger'" disable-transitions>{{scope.row.needAuth ===
            0 ? '开放' : '鉴权'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button :type="scope.row.needAuth === 0 ? 'primary' : 'success'" plain size="mini"
                     @click="updateItemNeedAuth(scope.row)">{{scope.row.needAuth ===
            0 ? '鉴权' : '开放'}}
          </el-button>
          <el-button type="warning" plain size="mini" @click="editItem(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <ResourceDialog :formStatus="formResourceStatus" ref="resourceDialog"
                    @closeResourceDialog="fetchData"></ResourceDialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import ResourceDialog from '@/components/opscloud/dialog/ResourceDialog'
  // API
  import { queryGroupPage } from '@api/auth/auth.group.js'
  import { queryResourcePage, deleteResourceById, updateResourceNeedAuth } from '@api/auth/auth.resource.js'

 const authOptions = [{
    value: -1,
    label: '全部'
  }, {
    value: 0,
    label: '开放'
  }, {
    value: 1,
    label: '鉴权'
  }]
 const needAuthOptions = [{
    value: 0,
    label: '不鉴权'
  }, {
    value: 1,
    label: '鉴权'
  }]

  export default {
    name: 'AuthGroupTable',
    data () {
      return {
        formResourceStatus: {
          visible: false,
          addTitle: '新增资源配置',
          updateTitle: '更新资源配置',
          labelWidth: '100px',
          operationType: true
        },
        tableData: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          groupId: '',
          groupCode: '',
          resourceName: '',
          needAuth: ''
        },
        authOptions: authOptions,
        needAuthOptions: needAuthOptions,
        groupOptions: []
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
      this.getGroup('')
    },
    components: {
      ResourceDialog
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
      getGroup (groupCode) {
        queryGroupPage(groupCode, 1, 10)
          .then(res => {
            this.groupOptions = res.body.data
          })
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      handleDialogCancel (done) {
        this.$message({
          message: '取消保存',
          type: 'warning'
        })
        done()
      },
      delItem (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteResourceById(row.id).then(res => {
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
      updateItemNeedAuth (row) {
        let requestBody = {
          'id': row.id,
          'needAuth': row.needAuth === 0 ? 1 : 0
        }
        updateResourceNeedAuth(requestBody)
          .then(res => {
            // 返回数据
            this.$message({
              message: '成功',
              type: 'success'
            })
            this.fetchData()
          })
      },
      addItem () {
        this.formResourceStatus.operationType = true
        this.formResourceStatus.visible = true
        let resource = {
          id: '',
          groupId: '',
          resourceName: '',
          comment: '',
          needAuth: 1
        }
        this.$refs.resourceDialog.initData(resource, [])
      },
      editItem (row) {
        let resource = Object.assign({}, row)
        let groupOptions = []
        groupOptions.push(resource.group)
        this.formResourceStatus.operationType = false
        this.formResourceStatus.visible = true
        this.$refs.resourceDialog.initData(resource, groupOptions)
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        queryResourcePage(this.queryParam.groupId, this.queryParam.resourceName, this.queryParam.needAuth, this.pagination.currentPage, this.pagination.pageSize)
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

</style>
