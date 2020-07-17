<template>
  <div>
    <el-dialog :title="title" :visible.sync="formStatus.visible" :before-close="closeDialog">
      <div style="margin-bottom: 5px">
        <el-divider content-position="left" v-if="ticket.ticketPhase === 'CREATED_TICKET'">配置选项</el-divider>
        <el-row :gutter="24" style="margin-bottom: 5px" v-if="ticket.ticketPhase === 'CREATED_TICKET'">
          <el-select v-model="ticketEntry" filterable clearable value-key="name"
                     style="display: inline-block; max-width:200px; margin-left: 10px"
                     remote reserve-keyword placeholder="输入关键词搜索服务器组" :remote-method="queryPreTicketEntry"
                     :loading="searchTicketEntryLoading">
            <el-option
              v-for="item in ticketEntryOptions"
              :key="item.name"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
          <el-button type="success" :disabled="ticketEntry === ''" plain size="mini" @click="addTicketEntry()"
                     style="margin-left: 10px">添加
          </el-button>
        </el-row>
        <el-divider content-position="left">工单详情</el-divider>
        <el-row :gutter="24" style="margin-bottom: 5px">
          <el-table :data="ticketEntries" style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="服务器组名称"></el-table-column>
            <el-table-column prop="comment" label="高级权限">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.ticketEntry.needAdministratorAccount"
                             @change="updateTicketEntry(scope.row)">
                  需要管理员
                </el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="comment" label="描述"></el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
              <template slot-scope="scope">
                <el-button type="danger" plain size="mini" @click="removeTicketEntry(scope.row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row :gutter="24" style="margin-top: 10px">
          <el-input type="textarea" :rows="2" placeholder="申请说明" v-model="ticket.comment">
          </el-input>
        </el-row>
        <el-divider></el-divider>
        <el-row :gutter="24" style="margin-top: 10px" v-if="ticket != '' && ticket.approvalDetail != null">
          <el-steps :active="ticket.approvalDetail.active" align-center>
            <el-step :title="step.title" :description="step.description"
                     v-for="step in ticket.approvalDetail.approvalSteps" :key="step.title"></el-step>
          </el-steps>
        </el-row>
      </div>
      <el-divider></el-divider>
      <div slot="footer" class="dialog-footer">
        <!--        <el-tag style="display: inline-block; max-width:200px; margin-left: 10px">{{ticket.id}}#工单</el-tag>-->
        <span style="margin-right: 10px" v-if="formStatus.operationType != 2">
          <el-button type="primary" v-if="ticket.ticketPhase === 'CREATED_TICKET'" plain size="mini"
                     @click="submitTicket">提交</el-button>
          <el-button type="success" v-if="ticket.isInApproval" plain size="mini" @click="agreeTicket">同意</el-button>
          <el-button type="danger" v-if="ticket.isInApproval" plain size="mini" @click="disagreeTicket">拒绝</el-button>
        </span>
        <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import {
    queryUserTicketServerGroupPage,
    addWorkorderTicketEntry,
    updateWorkorderTicketEntry,
    delWorkorderTicketEntryById,
    queryWorkorderTicket,
    submitWorkorderTicket,
    agreeWorkorderTicket,
    disagreeWorkorderTicket
  } from '@api/workorder/workorder.ticket.js'

  export default {
    data () {
      return {
        title: '',
        ticket: '',
        labelWidth: '100px',
        ticketEntryOptions: [],
        searchTicketEntryLoading: false,
        ticketEntry: '',
        loading: false,
        ticketEntries: []
      }
    },
    components: {},
    name: 'TicketServerGroupDialog',
    props: ['formStatus'],
    methods: {
      closeDialog () {
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      initData (ticket) {
        this.ticket = ticket
        if (ticket.workorder != null) {
          this.title = ticket.workorder.name
        }
        if (ticket.ticketEntries != null) {
          this.ticketEntries = ticket.ticketEntries
        } else {
          this.ticketEntries = []
        }
        this.queryPreTicketEntry('')
      },
      submitTicket () {
        submitWorkorderTicket(this.ticket)
          .then(res => {
            // 返回数据
            if (res.success) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.closeDialog()
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      agreeTicket () {
        agreeWorkorderTicket(this.ticket.id)
          .then(res => {
            // 返回数据
            if (res.success) {
              this.$message({
                message: '审批同意已提交',
                type: 'success'
              })
              this.closeDialog()
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      disagreeTicket () {
        disagreeWorkorderTicket(this.ticket.id)
          .then(res => {
            // 返回数据
            if (res.success) {
              this.$message({
                message: '审批拒绝已提交',
                type: 'success'
              })
              this.closeDialog()
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      addTicketEntry () {
        addWorkorderTicketEntry(this.ticketEntry)
          .then(res => {
            // 返回数据
            if (res.success) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.ticketEntry = ''
            } else {
              this.$message.error(res.msg)
            }
            this.fetchData()
          })
      },
      removeTicketEntry (ticketEntry) {
        delWorkorderTicketEntryById(ticketEntry.id)
          .then(res => {
            // 返回数据
            if (res.success) {
              this.$message({
                message: '移除成功',
                type: 'success'
              })
              this.fetchData()
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      updateTicketEntry (ticketEntry) {
        updateWorkorderTicketEntry(ticketEntry)
          .then(res => {
            // 返回数据
            if (res.success) {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
            } else {
              this.$message.error(res.msg)
            }
            this.fetchData()
          })
      },
      queryPreTicketEntry (queryName) {
        this.searchTicketEntryLoading = true
        let requestBody = {
          'queryName': queryName,
          'workorderTicketId': this.ticket.id,
          'userId': 0,
          'page': 1,
          'length': 20
        }
        queryUserTicketServerGroupPage(requestBody)
          .then(res => {
            this.ticketEntryOptions = res.body
            this.searchTicketEntryLoading = false
          })
      },
      fetchData () {
        this.loading = true
        queryWorkorderTicket(this.ticket.id)
          .then(res => {
            this.initData(res.body)
            this.loading = false
          })
      }
    }
  }
</script>

<style scoped>

</style>
