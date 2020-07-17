<template>
  <el-dialog :title="formStatus.title"
             :visible.sync="formStatus.visible">
    <el-form :model="formData">
      <el-form-item label="用户" :label-width="formStatus.labelWidth">
        <el-select v-model="formData.username" filterable clearable
                   remote reserve-keyword placeholder="输入关键词搜索用户" :remote-method="getUser" :loading="loading">
          <el-option
            v-for="item in userOptions"
            :key="item.id"
            :label="item.username"
            :value="item.username">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="formData">
      <el-form-item label="角色" :label-width="formStatus.labelWidth">
        <el-select v-model="formData.roleId" filterable clearable
                   remote reserve-keyword placeholder="输入关键词搜索角色" :remote-method="getRole" :loading="loading">
          <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
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
  import { queryRolePage } from '@api/auth/auth.role.js'
  import { queryUserPage } from '@api/user/user.js'
  import { addUserRole } from '@api/auth/auth.user.role.js'

  export default {
    data () {
      return {
        loading: false,
        userOptions: [],
        roleOptions: []
      }
    },
    name: 'user-dialog',
    props: ['formStatus', 'formData'],
    mounted () {
      this.getRole('')
      this.getUser('')
    },
    methods: {
      getRole (roleName) {
        queryRolePage(roleName, '', 1, 10)
          .then(res => {
            this.roleOptions = res.body.data
          })
      },
      getUser (username) {
        queryUserPage(username, '', 1, 20)
          .then(res => {
            this.userOptions = res.body.data
          })
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      saveInfo () {
        setTimeout(() => {
          var requestBody = Object.assign({}, this.formData)
          addUserRole(requestBody)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.formStatus.visible = false
              this.$emit('closeUserRoleDialog')
            })
        }, 600)
      }
    }
  }
</script>
