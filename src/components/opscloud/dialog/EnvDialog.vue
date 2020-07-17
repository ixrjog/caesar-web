<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="formData">
      <el-form-item label="名称" :label-width="formStatus.labelWidth" prop="envName" :required="true">
        <el-input v-model="formData.envName" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="formData">
      <el-form-item label="类型值" :label-width="formStatus.labelWidth" prop="envType" :required="true">
        <el-input v-model="formData.envType" placeholder="请输入内容"
                  :disabled="!formStatus.operationType"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="formData">
      <el-form-item label="颜色" :label-width="formStatus.labelWidth">
        <el-color-picker v-model="formData.color"></el-color-picker>
      </el-form-item>
    </el-form>
    <el-form :model="formData">
      <el-form-item label="描述" :label-width="formStatus.labelWidth">
        <el-input v-model="formData.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="saveInfo">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { addEnv, updateEnv } from '@api/env/env.js'

  export default {
    data () {
      return {
      }
    },
    name: 'env-dialog',
    props: ['formStatus', 'formData'],
    mixins: [],
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
            addEnv(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeEnvDialog')
              })
          } else {
            updateEnv(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeEnvDialog')
              })
          }
        }, 600)
      }
    }
  }
</script>
