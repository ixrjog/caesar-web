<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="50%">
    <el-row :gutter="24" style="margin-bottom: 5px;margin-left: 5px">
      <el-table :data="engines" v-loading="engineLoading">
        <el-table-column prop="jenkinsInstance" label="工作引擎实例名称">
          <template slot-scope="scope">
            <span>{{scope.row.jenkinsInstance.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="任务名称">
          <template slot-scope="scope">
            <a :href="scope.row.jobUrl" target="_blank"><el-tag>{{scope.row.name}}</el-tag> </a>
          </template>
        </el-table-column>
        <el-table-column prop="lastBuildNumber" label="最后构建">
          <template slot-scope="scope">
            <a :href="scope.row.lastBuildUrl" target="_blank"><el-tag>{{scope.row.lastBuildNumber}}</el-tag> </a>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" v-if="false">
          <template slot-scope="scope">
            <el-button type="danger" plain size="mini" @click="handlerEngineRowRemove(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
<!--    <el-divider></el-divider>-->
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="handlerEngineCreate" :loading="creatingEngine">创建工作引擎</el-button>
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import { createCiJobEngine, queryCiJobEngine } from '@api/application/ci.job.js'

  export default {
    data () {
      return {
        title: '工作引擎配置详情',
        ciJob: '',
        labelWidth: '150px',
        options: {
          stripe: true
        },
        engines: [],
        engineLoading: false,
        creatingEngine: false
      }
    },
    name: 'CiJobEngineDialog',
    props: ['formStatus'],
    components: {},
    mounted () {
    },
    methods: {
      closeDialog () {
        this.engines = []
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      initData (ciJob) {
        this.ciJob = ciJob
        this.fetchData()
      },
      handlerEngineCreate () {
        this.creatingEngine = true
        createCiJobEngine(this.ciJob.id)
          .then(res => {
            this.creatingEngine = false
            this.fetchData()
          })
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      fetchData () {
        this.engineLoading = true
        queryCiJobEngine(this.ciJob.id)
          .then(res => {
            this.engines = res.body
            this.engineLoading = false
          })
      }
    }
  }
</script>
