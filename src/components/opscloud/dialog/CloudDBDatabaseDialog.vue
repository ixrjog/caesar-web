<template>
  <el-dialog :title="formStatus.title"
             :visible.sync="formStatus.visible">
    <el-form :model="formData">
      <el-form-item label="名称" :label-width="formStatus.labelWidth">
        <el-input v-model.trim="formData.dbName" placeholder="请输入内容" readonly></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="formData">
      <el-form-item label="环境" :label-width="formStatus.labelWidth">
        <el-select v-model.trim="formData.envType" filterable clearable
                   remote reserve-keyword
                   :loading="loading">
          <el-option
            v-for="item in formData.envTypeOptions"
            :key="item.envType"
            :label="item.envName"
            :value="item.envType">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="formData">
      <el-form-item label="描述" :label-width="formStatus.labelWidth">
        <el-input v-model.trim="formData.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="saveInfo">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { updateCloudDBDatabase } from '@api/cloud/cloud.db.database.js'

  export default {
    data () {
      return {
        loading: false
      }
    },
    name: 'database-dialog',
    props: ['formData', 'formStatus'],
    mixins: [],
    mounted () {
    },
    methods: {
      handleClick () {
        this.$emit('input', !this.value)
      },
      saveInfo () {
        setTimeout(() => {
          let requestBody = {}
          requestBody = Object.assign({}, this.formData)
          delete requestBody.env
          updateCloudDBDatabase(requestBody)
            .then(res => {
              // 返回数据
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.formStatus.visible = false
              this.$emit('closeDatabaseDialog')
            })
        }, 600)
      }
    }
  }
</script>
