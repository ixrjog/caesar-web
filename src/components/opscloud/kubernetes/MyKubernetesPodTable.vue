<template>
  <div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="容器组状态" width="150">
        <template slot-scope="props">
          <el-popover placement="right" width="500" trigger="hover">
            <el-form :model="props.row">
              <el-form-item label="名称" :label-width="labelWidth">
                <el-input v-model="props.row.name" readonly></el-input>
              </el-form-item>
              <el-form-item label="运行阶段" :label-width="labelWidth">
                <el-tag :type="props.row.phase === 'Running' ? 'success':'warning'">{{ props.row.phase }}</el-tag>
              </el-form-item>
            </el-form>
            <el-button type="text" slot="reference">容器组详情</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="hostIP" label="节点ip" width="120"></el-table-column>
      <el-table-column prop="containers" label="容器">
        <template slot-scope="props">
          <div v-for="item in props.row.containers" :key="item.name" style="float: right; margin-right:10px">
            <el-tag :type="item.started ? 'success':'warning'" effect="dark">{{ item.name }}
              <span v-show="item.id !== ''">[id:{{ item.id }}]</span>
              <el-button type="text" style="margin-left: 10px; padding: 3px 0" @click="handlerXTerm(props.row, item)"><span style="color: #535353">打开终端</span></el-button>
            </el-tag>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <KubernetesXTerm :formStatus="formXtermStatus" ref="xtermDialog"></KubernetesXTerm>
  </div>
</template>

<script>

  import { queryMyKubernetesPod } from '@api/kubernetes/kubernetes.pod.js'

  // XTerm
  import KubernetesXTerm from '@/components/opscloud/xterm/KubernetesXTerm'

  export default {
    name: 'MyKubernetesPodTable',
    data () {
      return {
        instanceId: '',
        tableData: [],
        loading: false,
        labelWidth: '80px',
        formXtermStatus: {
          visible: false
        }
      }
    },
    computed: {},
    mounted () {
    },
    components: {
      KubernetesXTerm
    },
    methods: {
      initData (instanceId) {
        this.instanceId = instanceId
        this.fetchData()
      },
      handlerXTerm (pod, container) {
        this.formXtermStatus.visible = true
        this.$refs.xtermDialog.initData(pod, container)
      },
      fetchData () {
        this.loading = true
        let requestBody = {
          instanceId: this.instanceId
        }
        queryMyKubernetesPod(requestBody)
          .then(res => {
            this.tableData = res.body
            this.loading = false
          })
      }
    }
  }
</script>

<style scoped>
  .input {
    display: inline-block;
    max-width: 200px;
    margin-right: 5px;
  }

  .select {
    margin-right: 5px;
  }

</style>
