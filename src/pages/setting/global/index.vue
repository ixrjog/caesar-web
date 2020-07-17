<template>
  <d2-container>
    <h1>{{title}}</h1>
    <div>
      <el-row :gutter="20">
        <el-input placeholder="请输入内容" v-model.trim="settingMap.SERVER_ACCOUNT" class="input">
          <template slot="prepend">SERVER_ACCOUNT(服务器默认登录账户)</template>
        </el-input>
        <el-button type="primary" plain size="mini"
                   @click="handlerSettingSave('SERVER_ACCOUNT',settingMap.SERVER_ACCOUNT)" class="button">保存
        </el-button>
      </el-row>
      <el-row :gutter="20">
        <el-input placeholder="请输入内容" v-model.trim="settingMap.SERVER_HIGH_AUTHORITY_ACCOUNT" class="input">
          <template slot="prepend">SERVER_HIGH_AUTHORITY_ACCOUNT(服务器高权限账户)</template>
        </el-input>
        <el-button type="primary" plain size="mini"
                   @click="handlerSettingSave('SERVER_HIGH_AUTHORITY_ACCOUNT',settingMap.SERVER_HIGH_AUTHORITY_ACCOUNT)"
                   class="button">保存
        </el-button>
      </el-row>
      <el-row :gutter="20">
        <el-input placeholder="请输入内容" v-model.trim="settingMap.ORG_DEPT_ID" class="input">
          <template slot="prepend">ORG_DEPT_ID(组织架构拓扑根id)</template>
        </el-input>
        <el-button type="primary" plain size="mini" @click="handlerSettingSave('ORG_DEPT_ID',settingMap.ORG_DEPT_ID)"
                   class="button">保存
        </el-button>
      </el-row>
    </div>
  </d2-container>
</template>

<script>

  import { querySettingMap, updateSetting } from '@api/setting/setting.js'

  export default {
    data () {
      return {
        title: '系统参数配置',
        settingMap: {}
      }
    },
    components: {},
    mounted () {
      this.getSettingMap()
    },
    methods: {
      getSettingMap () {
        querySettingMap()
          .then(res => {
            this.settingMap = res.body
          })
      },
      handlerSettingSave (name, value) {
        let requestBody = {
          name: name,
          settingValue: value
        }
        updateSetting(requestBody)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.getSettingMap()
            } else {
              this.$message.error(res.msg)
            }
          })
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;

  &
  :last-child {
    margin-bottom: 0;
  }

  }
  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .input {
    max-width: 800px;
    margin-left: 10px;
  }

  .button {
    margin-left: 10px;
  }
</style>
