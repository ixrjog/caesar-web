<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="30%">
    <el-form :model="xtermSettingMap">
      <el-form-item label="终端字体颜色" :label-width="labelWidth">
        <el-color-picker v-model="xtermSettingMap['XTERM_FOREGROUND']"></el-color-picker>
      </el-form-item>
    </el-form>
    <el-form :model="xtermSettingMap">
      <el-form-item label="终端背景颜色" :label-width="labelWidth">
        <el-color-picker v-model="xtermSettingMap['XTERM_BACKGROUND']"></el-color-picker>
      </el-form-item>
    </el-form>
    <el-form :model="xtermSettingMap">
      <el-form-item label="终端行数" :label-width="labelWidth">
        <el-input-number v-model="xtermSettingMap['XTERM_ROWS']" :min="22" :max="60" label="终端行数"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handlerSaveSetting">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { saveUserSettingByGroup } from '@api/user/user.setting.js'

  const settingGroup = 'XTERM'

  export default {
    data () {
      return {
        title: '用户终端设置',
        xtermSettingMap: {},
        labelWidth: '110px'
      }
    },
    name: 'UserXTermSetting',
    props: ['formStatus'],
    mixins: [],
    mounted () {
    },
    methods: {
      initData (xtermSettingMap) {
        this.xtermSettingMap = xtermSettingMap
      },
      handlerSaveSetting () {
        setTimeout(() => {
          // var requestBody = Object.assign({}, this.formData)
          let requestBody = {
            settingGroup: settingGroup,
            settingMap: this.xtermSettingMap
          }
          saveUserSettingByGroup(requestBody)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.formStatus.visible = false
              this.$emit('closeUserXTermSetting')
            })
        }, 600)
      }
    }
  }
</script>
