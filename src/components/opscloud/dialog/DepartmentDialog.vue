<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="departmentData">
      <el-form-item label="部门名称" :label-width="formStatus.labelWidth" prop="name" :required="true">
        <el-input v-model="departmentData.name" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="departmentData">
      <el-form-item label="部门类型" :label-width="formStatus.labelWidth" prop="deptType" :required="true">
        <el-select v-model="departmentData.deptType" placeholder="选择类型">
          <el-option
            v-for="item in deptTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="departmentData">
      <el-form-item label="描述" :label-width="formStatus.labelWidth">
        <el-input v-model="departmentData.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="saveInfo">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // API
  import { addDepartment, updateDepartment } from '@api/org/org.js'

  export default {
    data () {
      return {
        departmentData: {},
        deptTypeOptions: [{
          value: 0,
          label: '普通部门'
        }, {
          value: 1,
          label: '技术部'
        }]
      }
    },
    name: 'DepartmentDialog',
    props: ['formStatus'],
    mixins: [],
    mounted () {
    },
    methods: {
      initData (departmentData) {
        this.departmentData = departmentData
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      saveInfo () {
        setTimeout(() => {
          var requestBody = Object.assign({}, this.departmentData)
          if (this.formStatus.operationType) {
            addDepartment(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeDepartmentDialog')
              })
          } else {
            updateDepartment(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.formStatus.visible = false
                this.$emit('closeDepartmentDialog')
              })
          }
        }, 600)
      }
    }
  }
</script>
