<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible">
    <d2-markdown :source="doc"/>
    <div style="margin: 15px 0;"></div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="formData.privileges" @change="handleCheckedPrivilegesChange">
      <el-checkbox v-for="privilege in privileges" :label="privilege" :key="privilege">{{privilege}}</el-checkbox>
    </el-checkbox-group>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="saveItem">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

  // API
  import { privilegeCloudDBAccount } from '@api/cloud/cloud.db.js'

  import doc from '@/static/md/cloud.db.privilege.md'

  const privilegeOptions = ['ReadOnly', 'ReadWrite', 'DDLOnly', 'DMLOnly']

  export default {
    data () {
      return {
        checkAll: false,
        privileges: privilegeOptions,
        isIndeterminate: true,
        doc,
        title: '数据库实例账户授权'
      }
    },
    name: 'dialog-privilege',
    props: ['formStatus', 'formData'],
    mixins: [],
    mounted () {
    },
    methods: {
      // 全选
      handleCheckAllChange (val) {
        this.formData.privileges = val ? privilegeOptions : []
        this.isIndeterminate = false
      },
      handleCheckedPrivilegesChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.privileges.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.privileges.length
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      saveItem () {
        setTimeout(() => {
          var requestBody = {
            'cloudDbId': this.formData.id,
            'privileges': this.formData.privileges
          }
          privilegeCloudDBAccount(requestBody)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.formStatus.visible = false
              this.$emit('closePrivilegeDialog')
            })
        }, 600)
      }
    }
  }
</script>
