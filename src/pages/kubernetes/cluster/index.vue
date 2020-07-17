<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="集群" name="cluster">
          <KubernetesClusterTable></KubernetesClusterTable>
        </el-tab-pane>
        <el-tab-pane label="命名空间" name="namespace">
          <KubernetesClusterNamespaceTable></KubernetesClusterNamespaceTable>
        </el-tab-pane>
      </el-tabs>
    </template>
  </d2-container>
</template>

<script>

  // Component
  import KubernetesClusterTable from '@/components/opscloud/kubernetes/KubernetesClusterTable'
  import KubernetesClusterNamespaceTable from '@/components/opscloud/kubernetes/KubernetesClusterNamespaceTable'

  export default {
    data () {
      return {
        title: 'Kubenetes集群管理',
        activeName: 'cluster'
      }
    },
    computed: {
    },
    mounted () {
    },
    components: {
      KubernetesClusterTable,
      KubernetesClusterNamespaceTable
    },
    methods: {
    }
  }
</script>

<style>
</style>
