<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="dingtalk">
      <el-form-item label="名称" :label-width="labelWidth" :required="true">
        <el-input v-model="dingtalk.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="token" :label-width="labelWidth">
        <el-input v-model="dingtalk.dingtalkToken" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="dingtalk.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API

  import { addDingtalk, updateDingtalk } from '@api/dingtalk/dingtalk.js'

  export default {
    data () {
      return {
        dingtalk: {},
        labelWidth: '150px',
        options: {
          stripe: true
        }
      }
    },
    name: 'DingtalkDialog',
    props: ['formStatus'],
    components: {},
    mounted () {
    },
    methods: {
      initData (dingtalk) {
        this.dingtalk = dingtalk
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      handlerSave () {
        setTimeout(() => {
          let requestBody = Object.assign({}, this.dingtalk)
          if (this.formStatus.operationType) {
            addDingtalk(requestBody)
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
            updateDingtalk(requestBody)
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
