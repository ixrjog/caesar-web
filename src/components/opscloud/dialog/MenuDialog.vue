<template>
  <el-dialog :title="title"
             :visible.sync="formStatus.visible">
    <el-form :model="menuData">
      <el-form-item label="名称" :label-width="labelWidth" disabled="">
        <el-input v-model="menuData.roleName"></el-input>
      </el-form-item>
      <el-form-item label="菜单" :label-width="labelWidth" :required="true">
        <editor v-model="menuData.menu" @init="editorInit" lang="javascript" theme="chrome"
                width="100%" height="400"></editor>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click=" saveMenu">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

  // API
  import { saveRoleMenu, queryRoleMenuByRoleId } from '@api/auth/auth.menu.js'

  export default {
    data () {
      return {
        title: '角色菜单配置',
        menuData: {},
        labelWidth: '100px',
        options: {
          stripe: true
        },
        loading: false
      }
    },
    name: 'MenuDialog',
    props: ['formStatus'],
    mounted () {
    },
    components: {
      editor: require('vue2-ace-editor')
    },
    methods: {
      editorInit: function (e) {
        // language extension prerequsite...
        require('brace/ext/language_tools')
        // language
        require('brace/mode/javascript')
        require('brace/mode/ejs')
        require('brace/theme/chrome')
      },
      initData (roleId) {
        queryRoleMenuByRoleId(roleId)
          .then(res => {
            // 返回数据
            if (res.success) {
              this.menuData = res.body
            } else {
              this.$message.error(res.msg)
            }
          })
      },
      saveMenu () {
        setTimeout(() => {
          saveRoleMenu(this.menuData)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.formStatus.visible = false
            })
        }, 600)
      }
    }
  }
</script>
