<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="formData">
    </el-form>
    <el-form :model="formData">
      <el-form-item label="资源组名称" :label-width="formStatus.labelWidth">
        <el-input v-model="formData.groupCode" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="formData">
      <el-form-item label="描述" :label-width="formStatus.labelWidth">
        <el-input v-model="formData.comment" placeholder="请输入内容"></el-input>
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
  import { addGroup, updateGroup } from '@api/auth/auth.group.js'

  export default {
    data () {
      return {
        loading: false,
        // groupOptions: this.formData.groupOptions,
        // group: this.formData.group,
        needAuthOptions: [{
          value: 0,
          label: '不鉴权'
        }, {
          value: 1,
          label: '鉴权'
        }]
      }
    },
    name: 'resource-group-dialog',
    props: ['formStatus', 'formData'],
    mounted () {
    },
    methods: {
      handleClick () {
        this.$emit('input', !this.value)
      },
      saveInfo () {
        setTimeout(() => {
          var requestBody = Object.assign({}, this.formData)
          if (this.formStatus.operationType) {
            addGroup(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeResourceGroupDialog')
              })
          } else {
            updateGroup(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeResourceGroupDialog')
              })
          }
        }, 600)
      }
    }
  }
</script>
