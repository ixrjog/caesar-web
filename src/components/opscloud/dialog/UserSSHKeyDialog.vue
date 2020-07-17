<template>
  <el-dialog :title="formStatus.title" :visible.sync="formStatus.visible" :before-close="closeDialog">
    <el-form :model="sshPubKey">
      <el-form-item label="标题" :label-width="formStatus.labelWidth">
        <el-input v-model="sshPubKey.title" placeholder="自动识别" readonly></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="sshPubKey">
      <el-form-item label="md5指纹" :label-width="formStatus.labelWidth">
        <el-input v-model="sshPubKey.fingerprint" placeholder="自动识别" readonly></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="sshPubKey">
      <el-form-item label="ssh公钥" :label-width="formStatus.labelWidth" :required="true">
        <el-input v-model="sshPubKey.credential" type="textarea"
                  :autosize="{ minRows: 4, maxRows: 16}" clearable placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">关闭</el-button>
      <el-button type="primary" @click="saveInfo">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { saveUserCredential } from '@api/user/user.js'

  export default {
    data () {
      return {
        sshPubKey: {}
        // keyTitle: '',
        // keyCredential: '',
        // keyFingerprint: ''
      }
    },
    name: 'user-ssh-key-dialog',
    props: ['formStatus'],
    mixins: [],
    mounted () {
    },
    mutation () {
    },
    methods: {
      initData (sshPubKey) {
        this.sshPubKey = sshPubKey
      },
      closeDialog () {
        this.formStatus.visible = false
        this.$emit('closeUserSSHKeyDialog')
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      saveInfo () {
        setTimeout(() => {
          saveUserCredential(this.sshPubKey)
            .then(res => {
              // 返回数据
              if (res.success) {
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.sshPubKey = res.body
              } else {
                this.$message.error('错误:' + res.msg)
              }
            })
        }, 30)
      }
    }
  }
</script>
