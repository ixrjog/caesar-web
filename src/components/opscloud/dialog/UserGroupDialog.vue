<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="userGroup">
      <el-form-item label="用户组名称" :label-width="formStatus.labelWidth">
        <el-input v-model="userGroup.name" placeholder="请输入内容" :disabled="!formStatus.operationType"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="userGroup">
      <el-form-item label="工单申请" :label-width="formStatus.labelWidth" :required="true">
        <el-select v-model="userGroup.inWorkorder" placeholder="选择类型">
          <el-option
            v-for="item in workorderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="userGroup">
      <el-form-item label="描述" :label-width="formStatus.labelWidth">
        <el-input v-model="userGroup.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="saveInfo">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>

  // API
  import { updateUserGroup, addUserGroup } from '@api/user/user.group.js'

  const workorderOptions = [{
    value: 0,
    label: '禁止工单申请'
  }, {
    value: 1,
    label: '允许工单申请'
  }]

  export default {
    data () {
      return {
        userGroup: '',
        workorderOptions: workorderOptions
      }
    },
    name: 'UserGroupDialog',
    props: ['formStatus'],
    mounted () {
    },
    methods: {
      initData (userGroup) {
        this.userGroup = userGroup
      },
      saveInfo () {
        setTimeout(() => {
          var requestBody = Object.assign({}, this.userGroup)
          if (this.formStatus.operationType) {
            addUserGroup(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeDialog')
              })
          } else {
            updateUserGroup(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeDialog')
              })
          }
        }, 600)
      }
    }
  }
</script>
