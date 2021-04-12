<template>
  <div>
    <div v-if="jobTpl !== null">
      <el-row style="margin-bottom: 5px;margin-left: 10px" :gutter="24">
        <span>{{ tplName }}</span>
        <el-input v-model.trim="queryParam.queryName" :disabled="jobTpl === ''" placeholder="关键字查询"></el-input>
        <el-button @click="fetchData" style="margin-left: 5px" :disabled="jobTpl === ''">查询</el-button>
        <el-button @click="handlerUpgrade" style="margin-left: 5px" :disabled="jobTpl === ''">全部升级</el-button>
      </el-row>
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane name="build">
          <span slot="label"><span class="title">Build Job</span></span>
          <job-table :queryType="true" :jobTpl="jobTpl" ref="buildJobTable"></job-table>
        </el-tab-pane>
        <el-tab-pane name="deployment">
          <span slot="label"><span class="title">Deployment Job</span></span>
          <job-table :queryType="false" :jobTpl="jobTpl" ref="deploymentJobTable"></job-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>

  // Component
  import jobTable from '@/components/opscloud/jenkins/JobTable.vue'

  import {
    upgradeJobTplByTplId
  } from '@api/jenkins/jenkins.tpl.js'

  export default {
    name: 'JobTplCard',
    data () {
      return {
        activeName: 'build',
        jobTpl: null,
        tplName: '',
        queryParam: {
          queryName: ''
        }
      }
    },
    computed: {},
    mounted () {
    },
    components: {
      jobTable
    },
    methods: {
      handlerUpgrade () {
        if (this.jobTpl == null) return
        upgradeJobTplByTplId(this.jobTpl.id)
          .then(res => {
            this.$message({
              type: 'success',
              message: '后台升级中!'
            })
          })
      },
      fetchData () {
        if (this.activeName === 'build') {
          this.$refs.buildJobTable.fetchData()
        } else {
          this.$refs.deploymentJobTable.fetchData()
        }
      },
      initData (jobTpl) {
        this.jobTpl = jobTpl
        this.tplName = jobTpl.name
        this.$nextTick(() => {
          this.$refs.buildJobTable.fetchData()
        })
      }
    }
  }
</script>

<style scoped>

  .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .el-input {
    display: inline-block;
    max-width: 200px;
    margin-left: 20px;
  }

</style>
