<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="实例" name="instance">
          <caesarInstanceTable></caesarInstanceTable>
        </el-tab-pane>
      </el-tabs>
    </template>
  </d2-container>
</template>

<script>

  // Component
  import CaesarInstanceTable from '@/components/opscloud/caesar/CaesarInstanceTable'

  export default {
    data () {
      return {
        title: 'Caesar实例管理',
        activeName: 'instance'
      }
    },
    computed: {
    },
    mounted () {
    },
    components: {
      CaesarInstanceTable
    },
    methods: {
    }
  }
</script>
