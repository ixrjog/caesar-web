<template>
  <el-dialog :title="formStatus.title"
             :visible.sync="formStatus.visible">
    <el-form :model="formData">
      <el-transfer v-model="formData.serverTag"
                   :props="{ key: 'id', label: 'tagKey' }"
                   :data="formData.tagOptions"
                   :titles="['所有用户组', '授权用户组']">
      </el-transfer>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
      <el-button type="primary" size="mini" @click="saveInfo">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { updateTagBusiness } from '@api/tag/tag.js'

  export default {
    data () {
      return {
      }
    },
    name: 'tag-dialog',
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
          // var requestBody = Object.assign({}, this.formData)
          var requestBody = {
            'businessType': this.formData.businessType,
            'businessId': this.formData.businessId,
            'tagIds': this.formData.serverTag
          }
          updateTagBusiness(requestBody)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.formStatus.visible = false
              this.$emit('closeTagTransferDialog')
            })
        }, 600)
      }
    }
  }
</script>
