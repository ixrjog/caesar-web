<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="60%" @before-close="closeDialog">
    <build-layout :application="application" :buildJob="ciJob"
                  :operationOption="operationOption" :ref="`buildLayout_${uuid}`"
                  :id="`buildLayout_${uuid}`">
      <!--      自定义参数-->
      <template v-slot:customParameters>
        <el-form-item label="构建类型" :label-width="labelWidth">
          <el-select v-model="paramMap.BUILD_TYPE" placeholder="选择类型" @change="changeBuildType">
            <el-option
              v-for="item in buildTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布类型" :label-width="labelWidth">
          <el-select v-model="paramMap.PRODUCT_FLAVOR" placeholder="选择类型" @change="changeProductFlavor">
            <el-option
              v-for="item in buildProductFlavorOptions"
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

  const buildTypeOptions = [
    {
      value: 'release',
      label: 'release'
    },
    {
      value: 'debug',
      label: 'debug'
    }
  ]

  const buildProductFlavorOptions = [
    {
      value: 'alpha',
      label: 'alpha'
    },
    {
      value: 'publish',
      label: 'publish'
    }
  ]

  export default {
    name: 'AndroidBuildDialog',
    props: ['formStatus'],
    data () {
      return {
        title: 'Android构建',
        activeName: 'build',
        application: '',
        buildTypeOptions: buildTypeOptions,
        uuid: util.uuid(),
        ciJob: '',
        labelWidth: '150px',
        buildTypeOptions: buildTypeOptions,
        buildProductFlavorOptions: buildProductFlavorOptions,
        paramMap: {
          BUILD_TYPE: '',
          PRODUCT_FLAVOR: ''
        },
        operationOption: {
          buildType: 'ANDROID_BUILD',
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
        // 初始化参数
        this.paramMap.BUILD_TYPE = ciJob.parameters['BUILD_TYPE']
        this.paramMap.PRODUCT_FLAVOR = ciJob.parameters['PRODUCT_FLAVOR']
        this.$nextTick(() => {
          this.$refs[`buildLayout_${this.uuid}`].init()
          this.changeBuildType()
          this.changeProductFlavor()
        })
      },
      changeBuildType () {
        this.$refs[`buildLayout_${this.uuid}`].setParamMap('BUILD_TYPE', this.paramMap.BUILD_TYPE)
      },
      changeProductFlavor () {
        this.$refs[`buildLayout_${this.uuid}`].setParamMap('PRODUCT_FLAVOR', this.paramMap.PRODUCT_FLAVOR)
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
