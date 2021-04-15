<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="60%" @before-close="closeDialog">
    <build-layout :application="application" :buildJob="ciJob" :operationOption="operationOption"
                  :ref="`buildLayout_${uuid}`"
                  :id="`buildLayout_${uuid}`">
      <!--      自定义参数-->
      <template v-slot:customParameters>
        <el-form-item label="构建类型" :label-width="labelWidth">
          <el-select v-model="paramMap.buildType" placeholder="选择类型" @change="setParamBuildType">
            <el-option
              v-for="item in buildTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
    </build-layout>
    <el-divider></el-divider>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import util from '@/libs/util'

  import buildLayout from '@/components/opscloud/build/layout/BuildLayout'

  const buildTypeOptions = [{
    value: 'alpha',
    label: 'alpha'
  }, {
    value: 'release',
    label: 'release'
  }]

  export default {
    name: 'IOSBuildDialog',
    props: ['formStatus'],
    data () {
      return {
        title: 'iOS构建',
        activeName: 'build',
        application: '',
        buildTypeOptions: buildTypeOptions,
        uuid: util.uuid(),
        ciJob: '',
        labelWidth: '150px',
        paramMap: {
          buildType: ''
        },
        operationOption: {
          buildType: 'IOS_BUILD',
          showBuildDetails: true
        }
      }
    },
    components: {
      buildLayout
    },
    methods: {
      initData (application, ciJob) {
        this.application = application
        this.ciJob = ciJob
        this.paramMap.buildType = this.ciJob.parameters.buildType
        this.$nextTick(() => {
          this.$refs[`buildLayout_${this.uuid}`].init()
          this.setParamBuildTypeuildType ()
        })
      },
      setParamBuildType () {
        this.$refs[`buildLayout_${this.uuid}`].setParamMap('buildType', this.paramMap.buildType)
      },
      closeDialog () {
        this.formStatus.visible = false
        this.$emit('closeDialog')
      }
    }
  }
</script>

<style scoped>

</style>
