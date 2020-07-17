<template>
  <d2-container>
    <h1>{{title}}</h1>
    <el-row :gutter="40">
      <el-col :span="12">
        <el-card shadow="never">
          <MyKubernetesApplicationTable ref="myKubernetesApplicationTable"
                                        @handlerSelInstance="handlerSelInstance"></MyKubernetesApplicationTable>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never">
          <MyKubernetesPodTable ref="myKubernetesPodTable"></MyKubernetesPodTable>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

  import MyKubernetesApplicationTable from '@/components/opscloud/kubernetes/MyKubernetesApplicationTable.vue'
  import MyKubernetesPodTable from '@/components/opscloud/kubernetes/MyKubernetesPodTable.vue'

  export default {
    data () {
      return {
        title: '我的应用'
      }
    },
    components: {
      MyKubernetesApplicationTable,
      MyKubernetesPodTable
    },
    mounted () {
    },
    methods: {
      handlerSelInstance (instanceId) {
        this.$refs.myKubernetesPodTable.initData(instanceId)
      }
    }
  }
</script>

<style scoped>
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
