<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="60%" @before-close="closeDialog">
    <deployment-layout :application="application" :deploymentJob="cdJob" :operationOption="operationOption"
                       :ref="`deploymentLayout_${uuid}`" :id="`deploymentLayout_${uuid}`">
      <!--      自定义参数-->
      <template v-slot:customParameters>
        <el-form-item label="主机分组" :label-width="labelWidth" required>
          <el-select v-model.trim="hostPattern" placeholder="选择类型" @change="handlerSelHostPattern">
            <el-option
              v-for="item in hostPatternOptions"
              :key="item.hostPattern"
              :label="item.hostPattern"
              :value="item.hostPattern">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机详情" :label-width="labelWidth">
          <el-card shadow="never">
            <div v-for="server in servers" :key="server.id">
              <el-tag style="margin-left: 5px" type="primary">{{ server.name }}-{{ server.serialNumber}} - {{
                server.privateIp}}
              </el-tag>
              <el-tag style="margin-left: 2px" type="success" effect="dark">{{ server.deployVersion === null ? '首次发布':
                server.deployVersion.versionName}}
              </el-tag>
            </div>
          </el-card>
        </el-form-item>
        <el-form-item label="并发控制" :label-width="labelWidth">
          <el-slider style="margin-left: 10px; width: 50%;" v-model="concurrent" mini :min="1" :max="8" :step="1"
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

  import deploymentLayout from './layout/DeploymentLayout'

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
        concurrent: 1, // 并发
        hostPatternOptions: [],
        servers: [],
        paramMap: {
          hostPattern: ''
        },
        operationOption: {
          buildType: '',
          showBuildDetails: false
        }
      }
    },
    components: {
      deploymentLayout
    },
    methods: {
      initData (application, cdJob) {
        this.activeName = 'deploy'
        this.buildId = ''
        this.application = application
        this.cdJob = cdJob
        this.hostPatternOptions = []
        this.servers = []
        this.server = ''
        this.hostPattern = ''
        // 初始化参数
        if (cdJob.parameters.hostPattern !== null) {
          this.paramMap.hostPattern = cdJob.parameters.hostPattern
        }
        this.getHostPattern()
        this.$nextTick(() => {
          this.$refs[`deploymentLayout_${this.uuid}`].init()
        })
      },
      closeDialog () {
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      handlerSelHostPattern () {
        this.servers = []
        for (let hostPattern of this.hostPatternOptions) {
          if (hostPattern.hostPattern === this.hostPattern) {
            this.servers = hostPattern.servers
            break
          }
        }
      },
      getHostPattern () {
        queryCdJobHostPatternByJobId(this.cdJob.id)
          .then(res => {
            if (res.success) {
              this.hostPatternOptions = res.body
              this.handlerSelHostPattern()
            }
          })
      }
    }
  }
</script>

<style scoped>

</style>
