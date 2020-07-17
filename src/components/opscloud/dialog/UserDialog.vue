<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" :before-close="closeDialog">
    <el-form :model="user">
      <el-form-item label="用户名" :label-width="formStatus.labelWidth" :required="true">
        <el-input v-model="user.username" placeholder="请输入内容" :disabled="!formStatus.operationType"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="user">
      <el-form-item label="密码" :label-width="formStatus.labelWidth" :required="formStatus.operationType">
        <el-input v-model="password" clearable placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-key" @click="getUserRandomPassword"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <el-form :model="user">
      <el-form-item label="显示名" :label-width="formStatus.labelWidth" :required="true">
        <el-input v-model="user.displayName" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="user">
      <el-form-item label="姓名" :label-width="formStatus.labelWidth">
        <el-input v-model="user.name" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="user">
      <el-form-item label="电话" :label-width="formStatus.labelWidth">
        <el-input v-model="user.phone" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="user">
      <el-form-item label="邮箱" :label-width="formStatus.labelWidth" :required="true">
        <el-input v-model="user.email" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="user">
      <el-form-item label="微信" :label-width="formStatus.labelWidth">
        <el-input v-model="user.wechat" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="user">
      <el-form-item label="留言" :label-width="formStatus.labelWidth">
        <el-input v-model="user.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="saveInfo">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

  // API
  import { getRandomPassword, updateUser, createUser } from '@api/user/user.js'

  export default {
    data () {
      return {
        user: '',
        password: ''
      }
    },
    name: 'UserDialog',
    props: ['formStatus'],
    mounted () {
    },
    methods: {
      closeDialog () {
        this.password = ''
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      initData (user) {
        this.user = user
      },
      getUserRandomPassword () {
        getRandomPassword()
          .then(res => {
            this.password = res.body
          })
      },
      saveInfo () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.user)
          requestBody.password = this.password
          if (this.formStatus.operationType) {
            createUser(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.closeDialog()
              })
          } else {
            updateUser(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.closeDialog()
              })
          }
        }, 600)
      }
    }
  }
</script>
