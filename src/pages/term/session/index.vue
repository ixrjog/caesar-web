<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-row :gutter="24" style="margin-bottom: 5px">
        <el-col :span="12">
          <el-card shadow="never">
            <XTermSessionTable ref="xtermSessionTable" @handlerSelSession="handlerSelSession"></XTermSessionTable>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="never"><XTermSessionInstanceTable ref="xtermSessionInstanceTable"></XTermSessionInstanceTable>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </d2-container>
</template>

<script>

  import XTermSessionTable from '@/components/opscloud/xterm/XTermSessionTable'
  import XTermSessionInstanceTable from '@/components/opscloud/xterm/XTermSessionInstanceTable'

  export default {
    data () {
      return {
        title: '终端会话管理'
      }
    },
    computed: {},
    mounted () {
    },
    components: {
      XTermSessionTable,
      XTermSessionInstanceTable
    },
    methods: {
      handlerSelSession (sessionInstances) {
        this.$refs.xtermSessionInstanceTable.initData(sessionInstances)
      }
    }
  }
</script>

<style>
</style>
