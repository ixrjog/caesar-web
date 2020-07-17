<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-col>
        <el-tabs tab-position="top" style="height: 200px;">
          <el-tab-pane label="用户管理">
            <!--用户搜索-->
            <div style="margin-bottom: 5px">
              <el-row style="margin-bottom: 5px">
                <el-input v-model.trim="queryUserParam.queryName"  clearable placeholder="名称"
                          style="display: inline-block; max-width:200px"/>
                <el-select v-model.trim="queryUserParam.isActive" clearable placeholder="用户是否有效">
                  <el-option
                    v-for="item in activeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-button @click="fetchData">查询</el-button>
                <el-button @click="syncUser" :loading="syncUserLoading">同步</el-button>
              </el-row>
            </div>
            <!--用户table-->
            <el-row style="margin-bottom: 5px">
              <el-table :data="tableData" style="width: 100%" v-loading="userLoading">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="table-expand">
                      <el-form-item label="邮箱">
                        <span>{{ props.row.email }}</span>
                      </el-form-item>
                      <el-form-item label="名称" v-if="props.row.name != null && props.row.name != ''">
                        <span>{{ props.row.name }}</span>
                      </el-form-item>
                      <el-form-item label="电话" v-if="props.row.phone != null && props.row.phone != ''">
                        <span>{{ props.row.phone }}</span>
                      </el-form-item>
                      <el-form-item label="微信" v-if="props.row.wechat != null && props.row.wechat != ''">
                        <span>{{ props.row.wechat }}</span>
                      </el-form-item>
                      <el-form-item label="有效期">
                        <span>{{ props.row.dateExpired }}</span>
                      </el-form-item>
                      <el-form-item label="数据源">
                        <span>{{ props.row.source }}</span>
                      </el-form-item>
                      <el-form-item label="描述" v-if="props.row.comment != null && props.row.comment != ''">
                        <span>{{ props.row.comment }}</span>
                      </el-form-item>
                      <el-form-item label="用户组">
                        <div class="tag-group">
                          <el-tag style="margin-left: 5px"
                                  v-for="item in props.row.usersUsergroups"
                                  :key="item.id">{{ item.name }}
                          </el-tag>
                        </div>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="name" label="显示名"></el-table-column>
                <el-table-column prop="role" label="角色">
                  <template slot-scope="scope">
                    <el-tag class="filters" :type="scope.row.role | getUserRoleType" size="small ">
                      {{scope.row.role | getUserRoleText}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="usersUsergroups.length" label="授权用户组"></el-table-column>
                <el-table-column prop="publicKey" label="公钥">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.publicKey === '' ? 'info': 'success' " size="small ">
                      {{scope.row.publicKey === '' ? '未录入' : '已录入'}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="isActive" label="有效">
                  <template slot-scope="scope">
                    <el-tag class="filters" :type="scope.row.isActive | getActiveType" size="small ">
                      {{scope.row.isActive | getActiveText}}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="280">
                  <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="handlerSyncUser(scope.row.id)">同步</el-button>
                    <el-button type="primary" plain size="mini" @click="setItemActive(scope.row.id)">
                      {{!scope.row.isActive | getActiveText}}
                    </el-button>
                    <el-button type="danger" plain size="mini" @click="handlerDelUser(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!--用户翻页-->
              <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]"
                             @size-change="handleSizeChange"
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
  import { mapState, mapActions } from 'vuex'
  // Filters
  import { getUserRoleType, getUserRoleText } from '@/filters/jumpserver.js'
  import { getActiveType, getActiveText } from '@/filters/public.js'
  // API
  import {
    fuzzyQueryUserPage,
    syncUser,
    setUserActive,
    syncUserById,
    delUserByUsername
  } from '@api/jump/jump.jumpserver.user.js'

  const activeOptions = [{
    value: -1,
    label: '全部'
  }, {
    value: 1,
    label: '有效'
  }, {
    value: 0,
    label: '无效'
  }]

  export default {
    data () {
      return {
        tableData: [],
        userLoading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryUserParam: {
          queryName: '',
          isActive: -1
        },
        syncUserLoading: false,
        activeOptions: activeOptions,
        title: 'Jump用户管理'
      }
    },
    mounted () {
      this.initPageSize()
      this.fetchData()
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    filters: {
      getUserRoleType,
      getUserRoleText,
      getActiveType,
      getActiveText
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
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      syncUser () {
        this.syncUserLoading = true
        syncUser()
          .then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '同步完成!'
            })
            this.syncUserLoading = false
          })
      },
      handlerSyncUser (id) {
        syncUserById(id)
          .then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '同步完成!'
            })
          })
      },
      setItemActive (id) {
        setUserActive(id)
          .then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '设置成功!'
            })
          })
      },
      handlerDelUser (row) {
        delUserByUsername(row.username)
          .then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
      },
      fetchData () {
        this.userLoading = true
        let requestBody = {
          'queryName': this.queryUserParam.queryName,
          'extend': 1,
          'isActive': this.queryUserParam.isActive,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        fuzzyQueryUserPage(requestBody)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.userLoading = false
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
