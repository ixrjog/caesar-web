<template>
  <d2-container>
    <template>
      <div>
        <h1>批量命令</h1>
      </div>
      <el-row :gutter="10">
        <el-col :span="8">
          <ServerTree ref="serverTree"></ServerTree>
        </el-col>
        <el-col :span="16">
          <el-tooltip content="系统命令输入框" placement="bottom" effect="light">
            <editor v-model="executorCommandParam.command" @init="editorInit" lang="sh" theme="chrome"
                    width="800"
                    height="80" :options="options"></editor>
          </el-tooltip>
          <el-row style="margin-top: 5px" :gutter="10">
            <el-col :span="6">
              <el-tooltip content="并发线程数" placement="bottom" effect="light">
                <el-slider v-model="executorCommandParam.concurrent"
                           :min="2" :max="10" :step="2" show-stops>
                </el-slider>
              </el-tooltip>
            </el-col>
            <el-col :span="2">
              <el-tooltip content="批量命令执行" placement="bottom" effect="light">
                <el-button @click="executorCommand" :style="searchBarStyle">执行</el-button>
              </el-tooltip>
            </el-col>
          </el-row>
          <AnsibleResult ref="ansibleResult"></AnsibleResult>
        </el-col>
      </el-row>
    </template>
  </d2-container>
</template>

<script>
  import ServerTree from '@/components/opscloud/tree/ServerTree'
  import AnsibleResult from '@/components/opscloud/ansible/AnsibleResult'
  // API
  import { executorCommand } from '@api/server/server.task.js'

  export default {
    data () {
      return {
        taskId: '',
        searchBarHeadStyle: {
          display: 'inline-block',
          maxWidth: '200px'
        },
        searchBarStyle: {
          marginLeft: '5px'
        },
        serverGroup: {},
        uuid: '',
        options: {
          stripe: true
        },
        executorCommandParam: {
          command: '',
          concurrent: 4,
          becomeUser: '',
          hostPatterns: [],
          uuid: '',
          taskType: 0
        }
      }
    },
    mounted () {
      // this.getGrpType('')
      // this.fetchData()
    },
    components: {
      ServerTree,
      AnsibleResult,
      editor: require('vue2-ace-editor')
    },
    methods: {
      editorInit: function () {
        // language extension prerequsite...
        require('brace/ext/language_tools')
        // require('brace/mode/html')
        // language
        // require('brace/mode/yaml')
        // require('brace/mode/less')
        require('brace/mode/sh')
        require('brace/theme/chrome')
        // snippet
        require('brace/snippets/yaml')
      },
      executorCommand () {
        try {
          var requestBody = Object.assign({}, this.executorCommandParam)
          requestBody.uuid = this.$refs.serverTree.getUuid()
          requestBody.hostPatterns = this.$refs.serverTree.getCheckedKeys(true)
          // 重置定时器
          executorCommand(requestBody).then(res => {
            if (res.success) {
              this.$message({
                message: '任务执行中!',
                type: 'success'
              })
              // taskId
              this.$refs.ansibleResult.initData(res.body.id)
            } else {
              this.$message.error(res.msg)
            }
          })
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>
