<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="60%" @before-close="closeDialog">
    <build-layout :application="application" :buildJob="ciJob" :ref="`buildLayout_${uuid}`"
                  :id="`buildLayout_${uuid}`">
      <!--      自定义参数-->
      <template v-slot:customParameters>
        <el-form-item label="质量管理" :label-width="labelWidth" v-show="ciJob.enableSonar">
          <el-checkbox v-model="buildParam.isSonar">本次构建启用Sonar扫描</el-checkbox>
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

  export default {
    name: 'JavaBuildDialog',
    props: ['formStatus'],
    data () {
      return {
        title: 'Java构建',
        activeName: 'build',
        application: '',
        uuid: util.uuid(),
        ciJob: '',
        labelWidth: '150px',
        operationOption: {}
      }
    },
    components: {
      buildLayout
    },
    methods: {
      initData (application, ciJob) {
        this.application = application
        this.ciJob = ciJob
        this.$nextTick(() => {
          this.$refs[`buildLayout_${this.uuid}`].init()
        })
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
