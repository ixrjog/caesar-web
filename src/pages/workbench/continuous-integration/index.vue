<template>
  <d2-container>
    <h1>{{title}}</h1>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card shadow="never">
          <myApplicationTable ref="myApplicationTable"
                              @handlerSelApplication="handlerSelApplication"></myApplicationTable>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="never" v-show="builbType">
          <div slot="header" class="clearfix">
            <span>构建任务</span>
            <el-button style="float: right; padding: 3px 0;margin-right: 45px" type="primary" @click="handlerSwitch"><i
              class="fa fa-refresh" aria-hidden="true"></i>SWITCH
            </el-button>
          </div>
          <myCiJobTable ref="myCiJobTable"></myCiJobTable>
        </el-card>
        <el-card shadow="never" v-show="!builbType">
          <div slot="header" class="clearfix">
            <span>部署任务</span>
            <el-button style="float: right; padding: 3px 0;margin-right: 45px" type="primary" @click="handlerSwitch"><i
              class="fa fa-refresh" aria-hidden="true"></i>SWITCH
            </el-button>
          </div>
          <myCdJobTable ref="myCdJobTable"></myCdJobTable>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

  import MyApplicationTable from '@/components/opscloud/application/MyApplicationTable.vue'
  import MyCiJobTable from '@/components/opscloud/application/MyCiJobTable.vue'
  import MyCdJobTable from '@/components/opscloud/application/MyCdJobTable.vue'

  export default {
    data () {
      return {
        title: '我的应用',
        builbType: true
      }
    },
    components: {
      MyApplicationTable,
      MyCiJobTable,
      MyCdJobTable
    },
    mounted () {
    },
    methods: {
      handlerSwitch () {
        this.builbType = !this.builbType
      },
      handlerSelApplication (application) {
        this.$refs.myCiJobTable.initData(application)
        this.$refs.myCdJobTable.initData(application)
      }
    }
  }
</script>

<style>
  .table-expand {
    font-size: 0;
  }

  .table-expand label {
    width: 150px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
