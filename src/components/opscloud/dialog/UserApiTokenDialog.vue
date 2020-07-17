<template>
  <el-dialog :title="formStatus.title" :visible.sync="formStatus.visible" :before-close="closeDialog">
    <el-form :model="userApiToken">
      <el-form-item label="id" :label-width="formStatus.labelWidth">
        <el-input v-model="tokenId" placeholder="自动生成无需输入" readonly></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="userApiToken">
      <el-form-item label="api-token" :label-width="formStatus.labelWidth">
        <el-input v-model="apiToken" clearable placeholder="自动生成无需输入" readonly>
        </el-input>
      </el-form-item>
    </el-form>
    <el-form :model="userApiToken">
      <el-form-item label="过期时间" :label-width="formStatus.labelWidth" :required="true">
        <el-date-picker
          v-model="userApiToken.expiredTime" value-format="yyyy-MM-dd HH:mm:ss"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <el-form :model="userApiToken">
      <el-form-item label="描述" :label-width="formStatus.labelWidth" :required="true">
        <el-input v-model="userApiToken.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">关闭</el-button>
      <el-button type="primary" @click="saveItem" v-show="tokenId == null || tokenId ==''">申请
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { applyApiToken } from '@api/user/user.js'

  export default {
    data () {
      return {
        userApiToken: {},
        tokenId: '',
        apiToken: '',
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > new Date('2030-12-12 00:00:00')
          },
          shortcuts: [{
            text: '30天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            }
          }, {
            text: '90天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', date)
            }
          }, {
            text: '180天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 180)
              picker.$emit('pick', date)
            }
          },
            {
              text: '1年',
              onClick (picker) {
                const date = new Date()
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 365)
                picker.$emit('pick', date)
              }
            },
            {
              text: '2年',
              onClick (picker) {
                const date = new Date()
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 365 * 2)
                picker.$emit('pick', date)
              }
            },
            {
              text: '3年',
              onClick (picker) {
                const date = new Date()
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 365 * 3)
                picker.$emit('pick', date)
              }
            }]
        }
      }
    },
    name: 'UserApiTokenDialog',
    props: ['formStatus'],
    mixins: [],
    mounted () {
    },
    mutation () {
    },
    methods: {
      closeDialog () {
        this.userApiToken = {}
        this.tokenId = ''
        this.apiToken = ''
        this.formStatus.visible = false
        this.$emit('closeDialog')
      },
      initData (userApiToken) {
        this.userApiToken = userApiToken
      },
      saveItem () {
        setTimeout(() => {
          applyApiToken(this.userApiToken)
            .then(res => {
              // 返回数据
              if (res.success) {
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.tokenId = res.body.tokenId
                this.apiToken = res.body.token
              } else {
                this.$message.error('错误:' + res.msg)
              }
            })
        }, 30)
      }
    }
  }
</script>
