<template>
  <el-dialog :title="formStatus.title"
             :visible.sync="formStatus.visible">
    <el-form :model="tagTransfer">
      <el-transfer v-model="tagTransfer.tagIds"
                   :props="{ key: 'id', label: 'tagKey' }"
                   :data="tagTransfer.tagOptions"
                   :titles="['所有标签', '服务器标签']">
      </el-transfer>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
      <el-button type="primary" size="mini" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { updateTagBusiness } from '@api/tag/tag.js'

  export default {
    data () {
      return {
        tagTransfer: {}
      }
    },
    name: 'TagTransferDialog',
    props: ['formStatus'],
    mixins: [],
    mounted () {
    },
    methods: {
      handleClick () {
        this.$emit('input', !this.value)
      },
      initData (tagTransfer) {
        this.tagTransfer = tagTransfer
      },
      handlerSave () {
        setTimeout(() => {
          updateTagBusiness(this.tagTransfer)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.formStatus.visible = false
              this.$emit('closeDialog')
            })
        }, 600)
      }
    }
  }
</script>
