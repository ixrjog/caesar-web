<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="50%">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>构建引擎</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handlerBuildEngineCreate"
                   :loading="creatingBuildEngine">创建工作引擎
        </el-button>
      </div>
      <el-row :gutter="24" style="margin-bottom: 5px;margin-left: 5px">
        <el-table :data="buildEngines" v-loading="buildEngineLoading">
          <el-table-column prop="jenkinsInstance" label="工作引擎实例名称" width="200px">
            <template slot-scope="scope">
              <span>{{scope.row.jenkinsInstance.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lastBuildNumber" label="最后构建" width="100px">
            <template slot-scope="scope">
              <a :href="scope.row.lastBuildUrl" target="_blank">
                <el-tag>{{scope.row.lastBuildNumber}}</el-tag>
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="任务名称">
            <template slot-scope="scope">
              <a :href="scope.row.jobUrl" target="_blank">
                <el-tag>{{scope.row.name}}</el-tag>
              </a>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" v-if="false">
            <template slot-scope="scope">
              <el-button type="danger" plain size="mini" @click="handlerEngineRowRemove(scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <el-card class="box-card" shadow="never" style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>部署引擎</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handlerDeploymentEngineCreate"
                   :loading="creatingDeploymentEngine">创建工作引擎
        </el-button>
      </div>
      <el-row :gutter="24" style="margin-bottom: 5px;margin-left: 5px">
        <el-table :data="deploymentEngines" v-loading="deploymentEngineLoading">
          <el-table-column prop="jenkinsInstance" label="工作引擎实例名称" width="200px">
            <template slot-scope="scope">
              <span>{{scope.row.jenkinsInstance.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lastBuildNumber" label="最后构建" width="100px">
            <template slot-scope="scope">
              <a :href="scope.row.lastBuildUrl" target="_blank">
                <el-tag>{{scope.row.lastBuildNumber}}</el-tag>
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="任务名称">
            <template slot-scope="scope">
              <a :href="scope.row.jobUrl" target="_blank">
                <el-tag>{{scope.row.name}}</el-tag>
              </a>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" v-if="false">
            <template slot-scope="scope">
              <el-button type="danger" plain size="mini" @click="handlerEngineRowRemove(scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!--    <el-divider></el-divider>-->
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { createCiJobEngine, queryCiJobEngine } from '@api/application/ci.job.js'
  import { createCdJobEngine, queryCdJobEngine } from '@api/application/cd.job.js'

  export default {
    data () {
      return {
        title: '工作引擎配置详情',
        job: '',
        labelWidth: '150px',
        options: {
          stripe: true
        },
        buildEngines: [],
        buildEngineLoading: false,
        creatingBuildEngine: false,
        deploymentEngines: [],
        deploymentEngineLoading: false,
        creatingDeploymentEngine: false
      }
    },
    name: 'JobEngineDialog',
    props: ['formStatus'],
    components: {},
    mounted () {
    },
    methods: {
      closeDialog () {
        this.buildEngines = []
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      initData (data) {
        this.job = {
          ciJobId: data.ciJobId,
          cdJobId: data.cdJobId
        }
        this.fetchBuildEngineData()
        if (this.job.cdJobId !== null) {
          this.fetchDeploymentEngineData()
        }
      },
      handlerBuildEngineCreate () {
        this.creatingBuildEngine = true
        createCiJobEngine(this.job.ciJobid)
          .then(res => {
            this.creatingBuildEngine = false
            this.fetchBuildEngineData()
          })
      },
      handlerDeploymentEngineCreate () {
        this.creatingDeploymentEngine = true
        createCdJobEngine(this.job.cdJobId)
          .then(res => {
            this.creatingDeploymentEngine = false
            this.fetchDeploymentEngineData()
          })
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      fetchBuildEngineData () {
        this.buildEngineLoading = true
        queryCiJobEngine(this.job.ciJobId)
          .then(res => {
            this.buildEngines = res.body
            this.buildEngineLoading = false
          })
      },
      fetchDeploymentEngineData () {
        this.deploymentEngineLoading = true
        queryCdJobEngine(this.job.cdJobId)
          .then(res => {
            this.deploymentEngines = res.body
            this.deploymentEngineLoading = false
          })
      }
    }
  }
</script>

<style>
  .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
