<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="roleData">
      <el-form-item label="名称" :label-width="formStatus.labelWidth">
        <el-input v-model="roleData.roleName" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="roleData">
      <el-form-item label="访问级别" :label-width="formStatus.labelWidth">
        <el-input v-model="roleData.accessLevel" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="roleData">
      <el-form-item label="资源路径" :label-width="formStatus.labelWidth">
        <el-input v-model="roleData.resourceName" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="roleData">
      <el-form-item label="工单申请" :label-width="formStatus.labelWidth">
        <el-select v-model="roleData.inWorkorder" placeholder="选择类型">
          <el-option
            v-for="item in workorderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="roleData">
      <el-form-item label="描述" :label-width="formStatus.labelWidth">
        <el-input v-model="roleData.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="saveInfo">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { addRole, updateRole } from '@api/auth/auth.role.js'

  export default {
    data () {
      return {
        roleData: '',
        workorderOptions: [{
          value: 0,
          label: '禁止'
        }, {
          value: 1,
          label: '允许'
        }]
      }
    },
    name: 'RoleDialog',
    props: ['formStatus'],
    mixins: [],
    mounted () {
    },
    methods: {
      initData (roleData) {
        this.roleData = roleData
      },
      saveInfo () {
        setTimeout(() => {
          var requestBody = {}
          requestBody = Object.assign({}, this.roleData)
          if (this.formStatus.operationType) {
            addRole(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeRoleDialog')
              })
          } else {
            updateRole(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeRoleDialog')
              })
          }
        }, 600)
      }
    }
  }
</script>
