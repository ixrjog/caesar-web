<template>
  <el-dialog :title="formStatus.title" :visible.sync="formStatus.visible" :before-close="closeDialog">
    <div style="margin-bottom: 5px">
      <el-row :gutter="24" style="margin-bottom: 5px">
        <el-select v-model="serverGroupId" filterable clearable
                   style="display: inline-block; max-width:200px; margin-left: 10px"
                   remote reserve-keyword placeholder="输入关键词搜索服务器组" :remote-method="getServerGroup" :loading="loading">
          <el-option
            v-for="item in serverGroupOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button type="success" :disabled="serverGroupId == ''" plain size="mini" @click="grantServerGroup()"
                   style="margin-left: 10px">授权
        </el-button>
      </el-row>
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="已授权服务器组名称"></el-table-column>
      <el-table-column prop="serverGroupType" label="组类型">
        <template slot-scope="scope">
          <el-tag disable-transitions :style="{ color: scope.row.serverGroupType.color }">
            {{scope.row.serverGroupType.name}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="danger" plain size="mini" @click="revokeServerGroup(scope.row)">解除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange"
                   layout="prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { grantUserServerGroup, revokeUserServerGroup, queryUserIncludeServerGroupPage, queryUserExcludeServerGroupPage } from '@api/server/server.group.js'

  export default {
    data () {
      return {
        serverGroupId: '',
        user: {},
        tableData: [],
        serverGroupOptions: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    name: 'user-servergroup-dialog',
    props: ['formStatus'],
    mixins: [],
    mounted () {
    },
    methods: {
      initData (user) {
        // 初始化数据
        this.user = user
        this.serverGroupId = ''
        this.pagination.currentPage = 1
        this.getServerGroup('')
        this.fetchData()
      },
      getServerGroup (queryName) {
        queryUserExcludeServerGroupPage(this.user.id, queryName, 1, 20)
          .then(res => {
            this.serverGroupOptions = res.body.data
          })
      },
      closeDialog () {
        this.formStatus.visible = false
        this.$emit('closeUserServerGroupDialog')
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      grantServerGroup () {
        setTimeout(() => {
          grantUserServerGroup(this.user.id, this.serverGroupId)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.serverGroupId = ''
              this.getServerGroup('')
              this.fetchData()
            })
        }, 30)
      },
      revokeServerGroup (row) {
        setTimeout(() => {
          revokeUserServerGroup(this.user.id, row.id)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.getServerGroup('')
              this.fetchData()
            })
        }, 30)
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        queryUserIncludeServerGroupPage(this.user.id, this.pagination.currentPage, this.pagination.pageSize)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
          })
      }
    }
  }
</script>
