<template>
  <div>
    <el-popover placement="top-start" trigger="hover" width="400">
      <el-row :gutter="10">
        <span style="margin-left: 5px">可靠性</span>
        <el-button type="text" style="float: right; padding: 3px 0" @click="handlerOpenUrl">跳转详情页面</el-button>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <content-card :value="sonarQube.measures.bugs.value" comment="Bugs"></content-card>
        </el-col>
        <el-col :span="12" v-if="sonarQube.measures.new_bugs != null">
          <content-card :value="sonarQube.measures.new_bugs.periods[0].value" comment="新增Bugs"></content-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <span style="margin-left: 5px">安全性</span>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <content-card :value="sonarQube.measures.vulnerabilities.value" comment="漏洞"></content-card>
        </el-col>
        <el-col :span="12">
          <content-card :value="sonarQube.measures.new_vulnerabilities.periods[0].value" comment="新增漏洞"></content-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <span style="margin-left: 5px">覆盖率</span>
      </el-row>
      <el-row :gutter="10">
          <content-card :value="sonarQube.measures.coverage.value" symbol="%" comment="覆盖率"></content-card>
      </el-row>
      <el-row :gutter="10">
        <span style="margin-left: 5px">重复</span>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <content-card :value="sonarQube.measures.duplicated_lines_density.value" symbol="%" comment="重复度"></content-card>
        </el-col>
        <el-col :span="12">
          <content-card :value="sonarQube.measures.duplicated_blocks.value" comment="重复块"></content-card>
        </el-col>
      </el-row>
      <el-button slot="reference" type="text"><img :src="sonarQube.alertStatus"></el-button>
    </el-popover>
  </div>
</template>

<script>

  import util from '@/libs/util.js'

  import ContentCard from './child/ContentCard'

  export default {
    name: 'SonarPopover',
    data () {
      return {}
    },
    props: ['sonarQube'],
    components:{
      ContentCard
    },
    methods: {
      handlerOpenUrl () {
        util.open(this.sonarQube.projectUrl)
      }
    }
  }
</script>

<style scoped>

</style>
