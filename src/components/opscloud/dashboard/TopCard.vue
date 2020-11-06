<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>应用总数</span>
            <el-tag style="float: right" type="text">Applications</el-tag>
          </div>
          <div style="font-size: 45px;color:#20A9D9 ;font-weight: 300">{{ topCard.applicationTotal}}</div>
          <div style="font-size: 10px; color: #B7B6B6">All applications</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>构建任务总数</span>
            <el-tag style="float: right" type="text">Build Jobs</el-tag>
          </div>
          <div style="font-size: 45px; color:#20A9D9; font-weight: 300">{{ topCard.buildJobTotal}}</div>
          <div style="font-size: 10px; color: #B7B6B6">All build jobs</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>部署任务总数</span>
            <el-tag style="float: right" type="text">Deployment Jobs</el-tag>
          </div>
          <div style="font-size: 45px; color:#20A9D9; font-weight: 300">{{ topCard.deploymentJobTotal}}</div>
          <div style="font-size: 10px; color: #B7B6B6">All deployment jobs</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>SCM项目总数</span>
            <el-tag style="float: right" type="text">SCM Projects</el-tag>
          </div>
          <div style="font-size: 45px; color:#20A9D9; font-weight: 300">{{ topCard.scmProjectTotal}}</div>
          <div style="font-size: 10px; color: #B7B6B6">All scm projects</div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>

  import { queryTopCard } from '@api/dashboard/dashboard.js'

  export default {
    name: 'TopCard',
    data () {
      return {
        topCard: ''
      }
    },
    mounted () {
      this.fetchData()
    },
    methods: {
      fetchData () {
        queryTopCard()
          .then(res => {
            this.topCard = res.body
          })
      }
    }
  }
</script>

<style>
  .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
