<template>
  <div>
    <el-table :data="sessionInstances" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="会话id">
              <span>{{ props.row.sessionId }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="instanceId" label="实例id"></el-table-column>
      <el-table-column prop="hostIp" label="主机">
      </el-table-column>
      <el-table-column prop="isClosed" label="会话状态" width="80px">
        <template slot-scope="props">
          <el-tag :type="props.row.isClosed ? 'info': 'success'">{{ props.row.isClosed ? '已关闭' : '活跃' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="outputFileSize" label="日志" width="80px"></el-table-column>
      <el-table-column prop="closeTime" label="关闭时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" v-if="!scope.row.auditLog.isEmpty"
                     @click="handlerPreviewAuditLog(scope.row)">日志
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <PreviewTermAuditLogDialog ref="previewTermAuditLogDialog" :formStatus="formStatus"></PreviewTermAuditLogDialog>
  </div>
</template>

<script>

  import PreviewTermAuditLogDialog from '@/components/opscloud/dialog/PreviewTermAuditLogDialog'

  const closeOptions = [{
    value: false,
    label: '活跃会话'
  }, {
    value: true,
    label: '已关闭会话'
  }]

  export default {
    name: 'XTermInstanceTable',
    data () {
      return {
        formStatus: {
          visible: false
        },
        sessionInstances: [],
        loading: false,
        title: '终端会话管理',
        closeOptions: closeOptions
      }
    },
    components: {
      PreviewTermAuditLogDialog
    },
    methods: {
      initData (sessionInstances) {
        this.sessionInstances = sessionInstances
      },
      handlerPreviewAuditLog (row) {
        this.$refs.previewTermAuditLogDialog.initData(row.id)
        this.formStatus.visible = true
      }
    }
  }
</script>

<style scoped>

</style>
