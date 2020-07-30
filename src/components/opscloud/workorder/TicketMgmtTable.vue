<template>
  <div>
    <div style="margin-bottom: 5px">
      <el-row :gutter="24" style="margin-bottom: 5px">
        <el-input v-model.trim="queryParam.username" placeholder="输入用户名" class="input"/>
        <el-select v-model="queryParam.ticketPhase" clearable placeholder="阶段" class="select">
          <el-option
            v-for="item in ticketPhaseOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="queryParam.ticketStatus" clearable placeholder="状态" class="select">
          <el-option
            v-for="item in ticketStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="fetchData" class="botton">查询</el-button>
      </el-row>
    </div>
    <el-table :data="tableData" style="width: 100%; margin-left: 10px">
      <el-table-column prop="workorder.name" label="工单"></el-table-column>
      <el-table-column prop="user.displayName" label="申请人"></el-table-column>
      <el-table-column prop="serverStatus" label="当前步骤">
        <template slot-scope="scope">
          <el-tag class="filters" :type="scope.row.ticketPhase | getPhaseType" size="small ">
            {{scope.row.ticketPhase | getPhaseText }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ago" label="申请时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="success" plain size="mini" @click="previewTicket(scope.row)">查看
          </el-button>
          <el-button type="primary" v-if="!scope.row.isInApproval" plain size="mini" @click="editTicket(scope.row)">编辑
          </el-button>
          <el-button type="success" v-if="scope.row.isInApproval" plain size="mini" @click="approvalTicket(scope.row)">
            审批
          </el-button>
          <el-button type="danger" v-if="scope.row.isAllowDelete" plain size="mini" @click="delTicket(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange"
                   layout="prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <TicketServerGroupDialog ref="ticketServerGroupDialog" :formStatus="formServerGroupStatus" @closeDialog="fetchData"></TicketServerGroupDialog>
    <TicketUserGroupDialog ref="ticketUserGroupDialog" :formStatus="formUserGroupStatus" @closeDialog="fetchData"></TicketUserGroupDialog>
    <TicketAuthRoleDialog ref="ticketAuthRoleDialog" :formStatus="formAuthRoleStatus" @closeDialog="fetchData"></TicketAuthRoleDialog>
  </div>
</template>

<script>
  import TicketServerGroupDialog from '@/components/opscloud/workorder/TicketServerGroupDialog'
  import TicketUserGroupDialog from '@/components/opscloud/workorder/TicketUserGroupDialog'
  import TicketAuthRoleDialog from '@/components/opscloud/workorder/TicketAuthRoleDialog'

  // Filters
  import { getPhaseText, getPhaseType } from '@/filters/ticket.js'

  // API
  import { queryWorkorderTicketPage, delWorkorderTicketById } from '@api/workorder/workorder.ticket.js'

  export default {
    name: 'TicketMgmtTable',
    data () {
      return {
        tableData: [],
        role: {},
        formServerGroupStatus: {
          visible: false,
          operationType: 1
        },
        formUserGroupStatus: {
          visible: false,
          operationType: 1
        },
        formAuthRoleStatus: {
          visible: false,
          operationType: 1
        },
        formRAMPolicyStatus: {
          visible: false,
          operationType: 0
        },
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          username: '',
          ticketPhase: '',
          ticketStatus: ''
        },
        ticketPhaseOptions: [{
          value: 'CREATED_TICKET',
          label: '新建'
        }, {
          value: 'APPLIED_TICKET',
          label: '提交申请'
        }, {
          value: 'ORG_APPROVAL',
          label: '上级审批'
        }, {
          value: 'USERGROUP_APPROVAL',
          label: '用户组审批'
        }, {
          value: 'CONFIGURATION',
          label: '运维配置阶段'
        }, {
          value: 'FINALIZED',
          label: '结束'
        }],
        ticketStatusOptions: [{
          value: 0,
          label: '正常'
        }, {
          value: 1,
          label: '结束（成功）'
        }, {
          value: 2,
          label: '结束（失败）'
        }]
      }
    },
    mounted () {
    },
    components: {
      TicketServerGroupDialog,
      TicketUserGroupDialog,
      TicketAuthRoleDialog
    },
    filters: {
      getPhaseText,
      getPhaseType
    },
    methods: {
      delTicket (id) {
        delWorkorderTicketById(id)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.fetchData()
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      previewTicket (ticket) {
        this.operationTicket(ticket, 2)
      },
      editTicket (ticket) {
        this.operationTicket(ticket, 0)
      },
      approvalTicket (ticket) {
        this.operationTicket(ticket, 1)
      },
      operationTicket (ticket, operationType) {
        switch (ticket.workorder.workorderKey) {
          case 'SERVER_GROUP':
            this.formServerGroupStatus.visible = true
            this.formServerGroupStatus.operationType = operationType
            this.$refs.ticketServerGroupDialog.initData(ticket)
            break
          case 'USER_GROUP':
            this.formUserGroupStatus.visible = true
            this.formUserGroupStatus.operationType = operationType
            this.$refs.ticketUserGroupDialog.initData(ticket)
            break
          case 'AUTH_ROLE':
            this.formAuthRoleStatus.visible = true
            this.formAuthRoleStatus.operationType = operationType
            this.$refs.ticketAuthRoleDialog.initData(ticket)
            break
          case 'RAM_POLICY':
            this.formRAMPolicyStatus.visible = true
            this.formRAMPolicyStatus.operationType = 0
            this.$refs.ticketRAMPolicyDialog.initData(ticket)
            break
          default:
            this.$message.error('工单类型错误或未配置!')
        }
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        let requestBody = Object.assign({}, this.queryParam)
        requestBody.page = this.pagination.currentPage
        requestBody.length = this.pagination.pageSize
        queryWorkorderTicketPage(requestBody)
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

  .input {
    display: inline-block;
    max-width: 200px;
    margin-left: 20px;
    margin-right: 5px;
  }

  .select {
    margin-right: 5px;
  }

  button {
    margin-right: 5px;
  }
</style>
