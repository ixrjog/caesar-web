<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="实例" name="instance">
          <JenkinsInstanceTable></JenkinsInstanceTable>
        </el-tab-pane>
      </el-tabs>
    </template>
  </d2-container>
</template>

<script>

  // Component
  import JenkinsInstanceTable from '@/components/opscloud/jenkins/JenkinsInstanceTable'

  export default {
    data () {
      return {
        title: 'Jenkins实例管理',
        activeName: 'instance'
      }
    },
    computed: {
    },
    mounted () {
    },
    components: {
      JenkinsInstanceTable
    },
    methods: {
    }
  }
</script>
