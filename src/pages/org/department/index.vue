<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <el-select v-model.trim="treeDepartmentId" filterable clearable :style="searchBarStyle"
                         remote reserve-keyword placeholder="搜索部门" :remote-method="getDepartment"
                         :loading="getDepartmentLoading">
                <el-option
                  v-for="item in departmentOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button @click="fetchDeptTreeData" style="margin-left: 5px" :loading="searching">
                查询
              </el-button>
              <el-button @click="addDepartment">新增</el-button>
              <span style="float: right">组织架构</span>
            </div>
            <el-tree draggable default-expand-all highlight-current node-key="id"
                     :data="deptTree.tree" @node-drop="handleDrop" @node-click="handleNodeClick">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-button type="text" size="mini" @click="() => editDepartment(node, data)">编辑</el-button>
                  <el-button type="text" size="mini" @click="() => delDepartment(node, data)">删除</el-button>
                </span>
              </span>
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="16">
          <!--  部门成员-->
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span>部门成员</span>
              <el-tag style="float: right" v-if="pagination != null && pagination.total != null" disable-transitions>
                SIZE: {{ pagination.total }}
              </el-tag>
            </div>
            <!--用户搜索-->
            <div style="margin-bottom: 5px">
              <!--            :gutter="24"-->
              <el-row style="margin-bottom: 5px">
                <el-select v-model="userId" filterable clearable :style="searchBarStyle"
                           remote reserve-keyword placeholder="搜索用户" :remote-method="getUser" :loading="getUserLoading">
                  <el-option v-for="item in userOptions" :key="item.id" :label="item.displayName" :value="item.id">
                  </el-option>
                </el-select>
                <el-button @click="addDeptMember" style="margin-left: 5px"
                           :disabled="departmentId == '' || userId == ''">添加
                </el-button>
                <el-tooltip class="item" effect="light" content="加入部门，成为此部门成员" placement="top">
                  <el-button @click="joinDeptMember" style="margin-left: 5px">加入</el-button>
                </el-tooltip>
              </el-row>
            </div>
            <el-table :data="tableData" style="width: 100%" v-loading="memberLoading">
              <el-table-column prop="username" label="用户名">
              </el-table-column>
              <el-table-column prop="displayName" label="显示名">
                <template slot-scope="scope">
                  <i class="fa fa-gg-circle" v-if="scope.row.memberType === 1" aria-hidden="true"></i>
                  <span v-if="scope.row.memberType === 1" style="color: #2f74ff">{{scope.row.displayName}}</span>
                  <span v-if="scope.row.memberType === 0">{{scope.row.displayName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="email" label="邮箱"></el-table-column>
              <el-table-column prop="isLeader" label="经理" width="80">
                <template slot-scope="scope">
                  <el-tag type="success" v-if="scope.row.isLeader === 1" size="small">是</el-tag>
                  <el-tag type="info" v-if="scope.row.isLeader === 0" size="small">否</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="isApprovalAuthority" label="审批权" width="80">
                <template slot-scope="scope">
                  <el-tag type="success" v-if="scope.row.isApprovalAuthority === 1" size="small">是</el-tag>
                  <el-tag type="info" v-if="scope.row.isApprovalAuthority === 0" size="small">否</el-tag>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="280">
                <template slot-scope="scope">
                  <el-button type="primary" plain size="mini" @click="setDeptMemberLeader(scope.row)">经理</el-button>
                  <el-button type="primary" plain size="mini" @click="setDeptMemberApproval(scope.row)">审批</el-button>
                  <el-button type="danger" plain size="mini" @click="removeDeptMember(scope.row)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--用户翻页-->
            <el-pagination background @current-change="paginationCurrentChange"
                           layout="prev, pager, next" :total="pagination.total"
                           :current-page="pagination.currentPage"
                           :page-size="pagination.pageSize">
            </el-pagination>
          </el-card>
        </el-col>
      </el-row>
      <DepartmentDialog ref="departmentDialog" :formStatus="formDepartmentStatus"
                        @closeDepartmentDialog="fetchDeptTreeData"></DepartmentDialog>
    </template>
  </d2-container>
</template>

<script>

  import DepartmentDialog from '@/components/opscloud/dialog/DepartmentDialog'

  // API
  import {
    queryDepartmentTree, dropDepartmentTree, queryDepartmentMemberPage,
    addDepartmentMember, joinDepartmentMember, removeDepartmentMemberById, updateDepartmentMemberLeader,
    updateDepartmentMemberApproval, queryDepartmentById, queryDepartmentPage
  } from '@api/org/org.js'
  import { fuzzyQueryUserPage } from '@api/user/user.js'

  export default {
    data () {
      return {
        searchBarHeadStyle: {
          display: 'inline-block',
          maxWidth: '200px'
        },
        searchBarStyle: {
          marginLeft: '5px'
        },
        title: '部门管理',
        departmentName: '',
        rootParentId: 0,
        departmentId: '',
        deptTree: '',
        searching: false,
        loading: false,
        // member
        tableData: [],
        memberLoading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryMemberParam: {
          queryName: ''
        },
        //
        treeDepartmentId: '',
        departmentOptions: [],
        getDepartmentLoading: false,
        // user
        userId: '',
        getUserLoading: false,
        userOptions: [],
        // form
        formDepartmentStatus: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          addTitle: '新增部门信息',
          updateTitle: '更新部门信息'
        }
      }
    },
    mounted () {
      this.fetchDeptTreeData()
    },
    components: {
      DepartmentDialog
    },
    methods: {
      getDepartment (queryName) {
        this.getDepartmentLoading = true
        var requestBody = {
          'queryName': queryName,
          'page': 1,
          'length': 20
        }
        queryDepartmentPage(requestBody)
          .then(res => {
            this.departmentOptions = res.body.data
            this.getDepartmentLoading = false
          })
      },
      getUser (queryName) {
        this.getUserLoading = true
        var requestBody = {
          'queryName': queryName,
          'extend': 0,
          'page': 1,
          'length': 20
        }
        fuzzyQueryUserPage(requestBody)
          .then(res => {
            this.userOptions = res.body.data
            this.getUserLoading = false
          })
      },
      addDeptMember () {
        if (this.departmentId === '' || this.userId === '') return
        addDepartmentMember(this.departmentId, this.userId)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '添加部门成员成功!'
              })
              this.fetchDeptMemberData()
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      joinDeptMember () {
        if (this.departmentId === '') return
        joinDepartmentMember(this.departmentId)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '加入部门成功!'
              })
              this.fetchDeptMemberData()
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      // 编辑部门
      addDepartment () {
        let departmentData = {
          id: 0,
          name: '',
          comment: '',
          parentId: this.treeDepartmentId !== '' ? this.treeDepartmentId : 1,
          deptType: 0
        }
        this.formDepartmentStatus.visible = true
        this.formDepartmentStatus.operationType = true
        this.$refs.departmentDialog.initData(departmentData)
      },
      // 编辑部门
      editDepartment (node, data) {
        queryDepartmentById(node.key)
          .then(res => {
            if (res.success) {
              let departmentData = res.body
              this.formDepartmentStatus.visible = true
              this.formDepartmentStatus.operationType = false
              this.$refs.departmentDialog.initData(departmentData)
            }
          })
      },
      // 删除部门
      delDepartment (node, data) {
       // console.log(node.key)
      },
      setDeptMemberLeader (row) {
        updateDepartmentMemberLeader(row.id)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '设置部门成员经理属性成功!'
              })
              this.fetchDeptMemberData()
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      setDeptMemberApproval (row) {
        updateDepartmentMemberApproval(row.id)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '设置部门成员审批权属性成功!'
              })
              this.fetchDeptMemberData()
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      removeDeptMember (row) {
        removeDepartmentMemberById(row.id)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '移除部门成员成功!'
              })
              this.fetchDeptMemberData()
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      handleDrop (draggingNode, dropNode, dropType, ev) {
        // console.log('tree drop: ', draggingNode.label, dropNode.label, dropType)
        // console.log('tree drop: ', draggingNode.key, dropNode.key, dropType)
        dropDepartmentTree(draggingNode.key, dropNode.key, dropType)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '设置成功!'
              })
              this.fetchDeptTreeData()
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      handleNodeClick (data, node) {
        try {
          this.departmentId = node.key
          this.departmentName = node.label
          this.fetchDeptMemberData()
        } catch (e) {
        }
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchDeptMemberData()
      },
      fetchDeptTreeData () {
        this.searching = true
        let parentId = this.treeDepartmentId === '' ? this.rootParentId : this.treeDepartmentId
        queryDepartmentTree(parentId)
          .then(res => {
            this.deptTree = res.body
            this.searching = false
          })
      },
      fetchDeptMemberData () {
        if (this.departmentId === null || this.departmentId === '') return
        this.memberLoading = true
        let requestBody = {
          'departmentId': this.departmentId,
          'queryName': this.queryMemberParam.queryName,
          'memberType': -1,
          'isLeader': -1,
          'isApprovalAuthority': -1,
          'page': this.pagination.currentPage,
          'length': this.pagination.pageSize
        }
        queryDepartmentMemberPage(requestBody)
          .then(res => {
            // console.log(JSON.stringify(res))
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.memberLoading = false
          })
      }
    }
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
