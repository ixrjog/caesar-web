<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="50%">
    <el-form>
      <el-form-item label="任务名称" :label-width="labelWidth">
        <span>DDDDDDDDDDDDDDDDDDDDDDDDDDDD</span>
      </el-form-item>
      <el-form-item label="仓库" :label-width="labelWidth">
        <!--            :disabled="!formStatus.operationType"-->
        <el-select v-model.trim="ciJob.scmMemberId" style="width: 500px" disabled>
          <el-option
            v-for="item in application.scmMembers"
            :key="item.id"
            :label="item.scmSshUrl"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分支" :label-width="labelWidth" required>
        <el-select v-model.trim="ciJob.branch" filterable style="width: 500px">
          <el-option-group
            v-for="group in branchOptions"
            :key="group.label"
            :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-option-group>
        </el-select>
        <el-button size="mini" type="primary" style="margin-left: 5px" @click="getBranches"
                   :loading="branchesLoading"><i class="fa fa-refresh" aria-hidden="true"></i></el-button>
        <el-button size="mini" type="primary" style="margin-left: 5px" @click="getCommit"
                   :loading="commitLoading"><i class="fa fa-info" aria-hidden="true"></i></el-button>
        <execute-commit style="margin-top: 10px" v-if="commit !== ''" :commit="commit"></execute-commit>
      </el-form-item>
      <el-form-item label="版本名称" :label-width="labelWidth">
        <el-input v-model="buildParam.versionName" placeholder="留空自动生成版本号"></el-input>
      </el-form-item>
      <el-form-item label="版本说明" :label-width="labelWidth">
        <el-input v-model="buildParam.versionDesc"></el-input>
      </el-form-item>
      <el-form-item label="通知静默" :label-width="labelWidth">
        <el-checkbox v-model="buildParam.isSilence">不发送本次构建钉钉通知</el-checkbox>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="closeDialog">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import util from '@/libs/util.js'

  export default {
    data () {
      return {
        title: 'Java构建',
        activeName: 'build',
      }
    },
    name: 'SonarQubeDialog',
    props: ['formStatus'],
    components: {},
    filters: {},
    computed: {},
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {}
  }
</script>

<style>
  .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 10px 0;
  }

</style>

