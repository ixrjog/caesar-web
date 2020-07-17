<template>
  <d2-container>
    <h1>{{title}}</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="订阅配置" name="subscription">
        <ProfileSubscriptionTable ref="profileSubscriptionTable"></ProfileSubscriptionTable>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

  import ProfileSubscriptionTable from '@/components/opscloud/profile/ProfileSubscriptionTable.vue'

  export default {
    data () {
      return {
        activeName: 'subscription',
        title: '配置订阅'
      }
    },
    components: {
      ProfileSubscriptionTable
    },
    mounted () {
    },
    methods: {}
  }
</script>
