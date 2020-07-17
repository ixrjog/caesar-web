<template>
  <el-dialog title="新增全局密钥配置" :visible.sync="formStatus.visible" :before-close="closeDialog">
    <el-form :model="keyboxData">
      <el-form-item label="标题" :label-width="labelWidth">
        <el-input v-model="keyboxData.title"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="keyboxData">
      <el-form-item label="系统账户" :label-width="labelWidth">
        <el-input v-model="keyboxData.systemUser"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="keyboxData">
      <el-form-item label="密钥类型" :label-width="labelWidth">
        <el-select v-model="keyboxData.keyType" placeholder="密钥类型">
          <el-option
            v-for="item in keyTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="keyboxData">
      <el-form-item label="首选密钥" :label-width="labelWidth">
        <el-select v-model="keyboxData.defaultKey" placeholder="首选密钥">
          <el-option
            v-for="item in defaultKeyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="keyboxData" v-show="keyboxData.keyType === 0">
      <el-form-item label="公钥" :label-width="labelWidth" :required="true">
        <el-input v-model="keyboxData.publicKey"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="keyboxData" v-show="keyboxData.keyType === 0">
      <el-form-item label="私钥" :label-width="labelWidth" :required="true">
        <el-input v-model="keyboxData.privateKey" type="textarea"
                  :autosize="{ minRows: 4, maxRows: 16}" clearable placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="keyboxData">
      <el-form-item label="密码" :label-width="labelWidth">
        <el-input v-model="keyboxData.passphrase"></el-input>
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
  import { addKeybox } from '@api/keybox/keybox.js'

  export default {
    data () {
      return {
        keyboxData: {},
        labelWidth: '100px',
        keyTypeOptions: [{
          value: 0,
          label: 'SSH密钥对'
        }, {
          value: 1,
          label: '密码'
        }],
        defaultKeyOptions: [{
          value: 0,
          label: '非首选密钥'
        }, {
          value: 1,
          label: '是首选密钥'
        }]
      }
    },
    name: 'KeyboxDialog',
    props: ['formStatus'],
    mixins: [],
    mounted () {
    },
    mutation () {
    },
    methods: {
      initData () {
        this.keyboxData = {
          id: '',
          systemUser: '',
          title: '',
          publicKey: '',
          privateKey: '',
          passphrase: '',
          keyType: 0,
          defaultKey: 0
        }
      },
      closeDialog () {
        this.formStatus.visible = false
        this.$emit('closeKeyboxDialog')
      },
      saveInfo () {
        setTimeout(() => {
          addKeybox(this.keyboxData)
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
