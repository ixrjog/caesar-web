<template>
  <d2-container>
    <h1>{{title}}</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="Playbook" name="playbook">
        <AnsiblePlaybookTable ref="ansiblePlaybookTable"></AnsiblePlaybookTable>
      </el-tab-pane>
      <el-tab-pane label="Script" name="script">
        <AnsibleScriptTable ref="ansibleScriptTable"></AnsibleScriptTable>
      </el-tab-pane>
      <el-tab-pane label="Ansible" name="ansible">
        <el-row :gutter="12">
          <el-col :span="24" style="margin-top: 5px">
            <el-form>
              <el-form-item label="主机配置文件">
                <el-tooltip content="预览ansible主机配置文件" placement="bottom" effect="light">
                  <el-button @click="previewAnsibleHosts">预览</el-button>
                </el-tooltip>
                <el-tooltip content="创建ansible主机配置文件" placement="bottom" effect="light">
                  <el-button @click="createAnsibleHostsCfg" :loading="creating">创建</el-button>
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="24" style="margin-top: 5px" v-if="previewHosts.content != null">
            <el-card shadow="never">
              <div slot="header" class="clearfix">
                <span>主机配置文件</span>
                <el-tag style="float: right">{{ previewHosts.path }}</el-tag>
              </div>
              <d2-highlight :code="previewHosts.content" lang="sh" style="margin-top: 5px"/>
            </el-card>
          </el-col>
          <el-col :span="24" style="margin-top: 5px">
            <el-card shadow="never">
              <div slot="header" class="clearfix">
                <span>Ansible版本详情</span>
              </div>
              <d2-highlight v-if="version.version != ''" :code="version.version" lang="sh" style="margin-top: 5px"/>
            </el-card>
          </el-col>
          <el-col :span="24" style="margin-top: 5px">
            <el-card shadow="never">
              <div slot="header" class="clearfix">
                <span>AnsiblePlaybook版本详情</span>
              </div>
              <d2-highlight v-if="version.playbookVersion != ''" :code="version.playbookVersion" lang="sh"
                            style="margin-top: 5px"/>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

  import AnsiblePlaybookTable from '@/components/opscloud/table/AnsiblePlaybookTable.vue'
  import AnsibleScriptTable from '@/components/opscloud/table/AnsibleScriptTable.vue'

  // API
  import { createAnsibleHosts, queryAnsibleVersion, previewAnsibleHosts } from '@api/server/server.task.js'

  export default {
    data () {
      return {
        activeName: 'playbook',
        title: 'Ansible管理',
        version: {
          version: '',
          playbookVersion: ''
        },
        creating: false,
        previewHosts: {}
      }
    },
    components: {
      AnsiblePlaybookTable,
      AnsibleScriptTable
    },
    mounted () {
      this.$refs.ansiblePlaybookTable.fetchData()
      this.$refs.ansibleScriptTable.fetchData()
      this.getVersion()
    },
    methods: {
      getVersion () {
        queryAnsibleVersion()
          .then(res => {
            if (res.success) {
              this.version = res.body
            }
          })
      },
      createAnsibleHostsCfg () {
        this.creating = true
        createAnsibleHosts().then(res => {
          if (res.success) {
            this.$message({
              message: 'ansible主机配置文件创建成功!',
              type: 'success'
            })
          } else {
            this.$message.error(res.msg)
          }
          this.creating = false
        })
      },
      previewAnsibleHosts () {
        previewAnsibleHosts().then(res => {
          if (res.success) {
            this.previewHosts = res.body
          } else {
            this.$message.error(res.msg)
          }
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
</style>
