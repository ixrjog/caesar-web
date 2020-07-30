<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="实例" name="instance">
          <GitlabInstanceTable></GitlabInstanceTable>
        </el-tab-pane>
      </el-tabs>
    </template>
  </d2-container>
</template>

<script>

  // Component
  import GitlabInstanceTable from '@/components/opscloud/gitlab/GitlabInstanceTable'

  export default {
    data () {
      return {
        title: 'Gitlab实例管理',
        activeName: 'instance'
      }
    },
    computed: {},
    mounted () {
    },
    components: {
      GitlabInstanceTable
    },
    methods: {}
  }
</script>
