<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" :before-close="closeDialog">
    <el-tabs v-model="activeName">
      <el-tab-pane label="执行构建" name="build">
<!--        <el-divider></el-divider>-->
        <el-form :model="ciJob">
          <el-form-item label="任务名称" :label-width="labelWidth">
            <el-input v-model="ciJob.name" disabled></el-input>
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
            <el-select v-model.trim="ciJob.branch" style="width: 500px">
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
            <el-button size="mini" type="primary" style="margin-left: 5px" @click="getBranches" :loading="branchesLoading"><i class="fa fa-refresh" aria-hidden="true"></i></el-button>
          </el-form-item>
        </el-form>
        <div style="width:100%;text-align:center">
          <el-button size="mini" type="primary" @click="handlerBuild" icon="fa fa-play">执行任务</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-divider></el-divider>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
<!--      <el-button size="mini" type="primary" @click="handlerBuild">确定</el-button>-->
    </div>
  </el-dialog>
</template>

<script>

  import { queryApplicationSCMMemberBranch } from '@api/application/application.js'
  import { addCiJob, updateCiJob } from '@api/application/ci.job.js'

  export default {
    data () {
      return {
        title:'HTML5构建',
        activeName: 'build',
        application: '',
        ciJob: '',
        labelWidth: '150px',
        options: {
          stripe: true
        },
        queryParam: {
          instanceId: '',
          queryName: ''
        },
        branchOptions: [],
        branchesLoading: false
      }
    },
    name: 'JobH5BuildDialog',
    props: ['formStatus'],
    components: {},
    mounted () {
    },
    methods: {
      closeDialog () {
        this.$emit('closeDialog')
      },
      initData (application, ciJob) {
        this.activeName = 'build'
        this.application = application
        this.ciJob = ciJob
        this.getBranches()
      },
      getBranches () {
        this.branchesLoading = true
        let requestBody = {
          'scmMemberId': this.ciJob.scmMemberId,
          'enableTag': this.ciJob.enableTag
        }
        queryApplicationSCMMemberBranch(requestBody)
          .then(res => {
            this.branchOptions = res.body.options
            this.branchesLoading = false
          })
      },
      handlerBuild(){

      }
    }
  }
</script>
