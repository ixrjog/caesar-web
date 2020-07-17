<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="workorderGroupData">
      <el-form-item label="名称" :label-width="labelWidth">
        <el-input v-model="workorderGroupData.name" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="workorderGroupData">
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="workorderGroupData.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="saveInfo">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { saveWorkorderGroup } from '@api/workorder/workorder.group.js'

  export default {
    data () {
      return {
        workorderGroupData: '',
        labelWidth: '100px'
      }
    },
    name: 'WorkorderGroupDialog',
    props: ['formStatus'],
    mounted () {
    },
    methods: {
      initData (workorderGroupData) {
        this.workorderGroupData = workorderGroupData
      },
      saveInfo () {
        setTimeout(() => {
          var requestBody = Object.assign({}, this.workorderGroupData)
          saveWorkorderGroup(requestBody)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.formStatus.visible = false
              this.$emit('closeWorkorderGroupDialog')
            })
        }, 600)
      }
    }
  }
</script>
