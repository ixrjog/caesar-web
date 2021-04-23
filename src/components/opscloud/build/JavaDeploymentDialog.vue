<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="60%" @before-close="closeDialog">
    <deployment-layout :application="application" :deploymentJob="cdJob" :operationOption="operationOption"
                       :ref="`deploymentLayout_${uuid}`" :id="`deploymentLayout_${uuid}`" @checkParam="checkParam">
      <!--      自定义参数-->
      <template v-slot:customParameters>
        <el-form-item label="主机分组" :label-width="labelWidth" required>
          <el-select v-model.trim="paramMap.hostPattern" placeholder="选择类型" @change="setParamHostPattern">
            <el-option
              v-for="item in hostPatternOptions"
              :key="item.hostPattern"
              :label="item.hostPattern"
              :value="item.hostPattern">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机详情" :label-width="labelWidth">
          <server-version :servers="servers"></server-version>
        </el-form-item>
        <el-form-item label="并发控制" :label-width="labelWidth">
          <el-slider style="margin-left: 10px; width: 50%;" v-model="paramMap.concurrent" mini :min="1" :max="8"
                     :step="1"
                     show-stops></el-slider>
        </el-form-item>
      </template>
    </deployment-layout>
    <el-divider></el-divider>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import util from '@/libs/util'

  import ServerVersion from './child/ServerVersion'
  import DeploymentLayout from './layout/DeploymentLayout'

  import { queryCdJobHostPatternByJobId } from '@api/build/job.build.js'


  export default {
    name: 'JavaDeploymentDialog',
    props: ['formStatus'],
    data () {
      return {
        title: 'Java部署',
        activeName: 'deploy',
        application: '',
        uuid: util.uuid(),
        cdJob: '',
        labelWidth: '150px',
        hostPatternOptions: [],
        servers: [],
        paramMap: {
          hostPattern: '',
          concurrent: 1 // 并发
        },
        operationOption: {
          buildType: '',
          showBuildDetails: false
        }
      }
    },
    components: {
      DeploymentLayout,
      ServerVersion
    },
    methods: {
      initData (application, cdJob) {
        this.activeName = 'deploy'
        this.buildId = ''
        this.application = application
        this.cdJob = cdJob
        this.paramMap = {
          hostPattern: '',
          concurrent: 1 // 并发
        }
        this.hostPatternOptions = []
        this.servers = []
        this.hostPattern = ''
        // 初始化参数
        if (cdJob.parameters.hostPattern !== null) {
          this.paramMap.hostPattern = cdJob.parameters.hostPattern
        }
        this.getHostPattern()
        this.$nextTick(() => {
          this.$refs[`deploymentLayout_${this.uuid}`].init()
          this.setParamHostPattern()
          this.setParamConcurrent()
        })
      },
      setParamConcurrent () {
        this.$refs[`deploymentLayout_${this.uuid}`].setParamMap('concurrent', this.paramMap.concurrent)
      },
      setParamHostPattern () {
        this.$refs[`deploymentLayout_${this.uuid}`].setParamMap('hostPattern', this.paramMap.hostPattern)
        this.selHostPattern()
      },
      // 子组件回调函数
      checkParam (paramMap, callback) {
        let result = {
          success: paramMap.hostPattern !== '',
          message: '未选中主机分组！',
          type: 'warning'
        }
        callback(result)
      },
      selHostPattern () {
        for (let hostPattern of this.hostPatternOptions) {
          if (hostPattern.hostPattern === this.paramMap.hostPattern) {
            this.servers = hostPattern.servers
            break
          }
        }
      },
      closeDialog () {
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      getHostPattern () {
        queryCdJobHostPatternByJobId(this.cdJob.id)
          .then(res => {
            if (res.success) {
              this.hostPatternOptions = res.body
              this.selHostPattern()
            }
          })
      }
    }
  }
</script>

<style scoped>

  .el-select {
    width: 500px;
  }

</style>
