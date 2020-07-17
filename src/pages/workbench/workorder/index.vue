<template>
  <d2-container>
    <template>
      <h1>{{title}}</h1>
      <el-tabs v-model="tabActiveName">
        <el-tab-pane label="工单" name="workorder">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-alert title="您尚未加入部门" type="warning" show-icon style="margin-bottom: 5px"
                        description="前往 用户管理-部门管理，选中部门后点加入" :closable="false" v-if="userDeptWarning">
              </el-alert>
              <el-card shadow="never">
                <el-collapse accordion v-model="activeNames">
                  <div v-for="(workorderGroup,index) in workorderGroups" :key="workorderGroup.id">
                    <el-collapse-item :title="workorderGroup.name" :name="index">
                      <el-table :data="workorderGroup.workorders" stripe :show-header=false style="width: 100%">
                        <el-table-column prop="name" label="工单名称"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="160">
                          <template slot-scope="scope">
                            <el-button type="success" plain size="mini" @click="handlerPreviewDoc(scope.row)">帮助
                            </el-button>
                            <el-button type="primary" plain size="mini" @click="createTicket(scope.row)"
                                       :loading="ticketCreateing">新建
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-collapse-item>
                  </div>
                </el-collapse>
              </el-card>
            </el-col>
            <el-col :span="16">
              <el-card shadow="never">
                <TicketTable ref="ticketTable"></TicketTable>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="工单管理" name="workorderMgmt">
            <TicketMgmtTable ref="ticketTable"></TicketMgmtTable>
        </el-tab-pane>
      </el-tabs>
      <DocDialog ref="docDialog" :formStatus="formDocStatus"></DocDialog>
      <TicketServerGroupDialog ref="ticketServerGroupDialog" :formStatus="formServerGroupStatus" @closeDialog="fetchData"></TicketServerGroupDialog>
      <TicketUserGroupDialog ref="ticketUserGroupDialog" :formStatus="formUserGroupStatus" @closeDialog="fetchData"></TicketUserGroupDialog>
      <TicketAuthRoleDialog ref="ticketAuthRoleDialog" :formStatus="formAuthRoleStatus" @closeDialog="fetchData"></TicketAuthRoleDialog>
      <TicketRAMPolicyDialog ref="ticketRAMPolicyDialog" :formStatus="formRAMPolicyStatus" @closeDialog="fetchData"></TicketRAMPolicyDialog>
    </template>
  </d2-container>
</template>

<script>
  // Component
  import TicketTable from '@/components/opscloud/workorder/TicketTable.vue'
  import TicketMgmtTable from '@/components/opscloud/workorder/TicketMgmtTable.vue'
  import TicketServerGroupDialog from '@/components/opscloud/workorder/TicketServerGroupDialog'
  import TicketUserGroupDialog from '@/components/opscloud/workorder/TicketUserGroupDialog'
  import TicketAuthRoleDialog from '@/components/opscloud/workorder/TicketAuthRoleDialog'
  import TicketRAMPolicyDialog from '@/components/opscloud/workorder/TicketRAMPolicyDialog'
  // doc
  import DocDialog from '@/components/opscloud/doc/DocDialog.vue'

  import { queryWorkbenchWorkorderGroup } from '@api/workorder/workorder.group.js'
  import { createWorkorderTicket } from '@api/workorder/workorder.ticket.js'
  import { checkUserInTheDepartment } from '@api/org/org.js'

  import { queryDocById } from '@api/doc/doc.js'

  export default {
    data () {
      return {
        userDeptWarning: false,
        formDocStatus: {
          readMode: true, // 阅读模式
          visible: false
        },
        activeNames: [0],
        tabActiveName: 'workorder',
        title: '我的工单',
        workorderGroups: [],
        // operationType  0 编辑模式  1 审批模式  2 完成模式
        formServerGroupStatus: {
          visible: false,
          operationType: 0
        },
        formUserGroupStatus: {
          visible: false,
          operationType: 0
        },
        formAuthRoleStatus: {
          visible: false,
          operationType: 0
        },
        formRAMPolicyStatus: {
          visible: false,
          operationType: 0
        },
        ticketCreateing: false,
        ticketTableData: []
      }
    },
    components: {
      DocDialog,
      TicketTable,
      TicketMgmtTable,
      TicketServerGroupDialog,
      TicketUserGroupDialog,
      TicketAuthRoleDialog,
      TicketRAMPolicyDialog
    },
    mounted () {
      this.getWorkbenchWorkorderGroup()
      this.setUserInTheDepartment()
    },
    methods: {
      setUserInTheDepartment () {
        checkUserInTheDepartment()
          .then(res => {
            if (!res.success) {
              this.userDeptWarning = true
            }
          })
      },
      getWorkbenchWorkorderGroup () {
        queryWorkbenchWorkorderGroup()
          .then(res => {
            this.workorderGroups = res.body
          })
      },
      handlerPreviewDoc (workorder) {
        queryDocById(workorder.readmeId)
          .then(res => {
            // 返回数据
            let doc = {
              docContent: res.body.previewDoc
            }
            this.$refs.docDialog.initData(doc)
            this.formDocStatus.visible = true
          })
      },
      /**
       * 创建工单票据
       * @param workorder
       */
      createTicket (workorder) {
        this.ticketCreateing = true
        let requestParam = {
          workorderKey: workorder.workorderKey
        }
        createWorkorderTicket(requestParam)
          .then(res => {
            let ticket = res.body
            ticket.workorder = workorder
            switch (workorder.workorderKey) {
              case 'SERVER_GROUP':
                this.formServerGroupStatus.visible = true
                this.formServerGroupStatus.operationType = 0
                this.$refs.ticketServerGroupDialog.initData(ticket)
                break
              case 'USER_GROUP':
                this.formUserGroupStatus.visible = true
                this.formUserGroupStatus.operationType = 0
                this.$refs.ticketUserGroupDialog.initData(ticket)
                break
              case 'AUTH_ROLE':
                this.formAuthRoleStatus.visible = true
                this.formAuthRoleStatus.operationType = 0
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
            this.ticketCreateing = false
          })
      },
      fetchData () {
        console.log('// TODO')
        this.$refs.ticketTable.fetchData()
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
