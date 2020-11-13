<template>
  <div>
    <div>
      <h1>{{title}}</h1>
    </div>
    <el-col :span="10">
      <el-card shadow="never">
        <el-col :span="10">
          <div style="width:100%;text-align:center">
            <vue-qr :logoSrc="imageUrl" :text="downloadHref" :size="150"></vue-qr>
          </div>
        </el-col>
        <el-col :span="10">
          <div style="width:100%;text-align:center; margin-top: 50px">
            <div style="color: #286090; font-size:1em;">{{build.jobName}}</div>
            <div style="color: #286090; font-size:2em;">{{build.versionName}}</div>
          </div>
          <!--          <div style="width:100%;text-align:center; margin-top: 50px" v-show="false">-->
          <!--            <a title="download" style="color: #286090; font-size:2em;" :href="downloadHref">点击安装</a>-->
          <!--          </div>-->
        </el-col>
      </el-card>
      <el-card shadow="never" style="margin-top: 10px">
        <el-row>
          <build-user :user="build.user" :ago="build.ago"></build-user>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <build-times :buildTime="build.buildTime" :startTime="build.startTime" :endTime="build.endTime"></build-times>
        </el-row>
        <el-divider></el-divider>
        <!--              变更详情-->
        <el-row>
          <build-changes :changes="build.changes"></build-changes>
        </el-row>
        <el-divider></el-divider>
        <!--              产出物详情-->
        <el-row>
          <build-artifacts :artifacts="build.artifacts"></build-artifacts>
        </el-row>
        <el-divider></el-divider>
        <!--              工作节点-->
        <el-row>
          <build-executors :executors="build.executors"></build-executors>
        </el-row>
      </el-card>
    </el-col>
  </div>
</template>

<script>

  import VueQr from 'vue-qr'

  import BuildUser from '@/components/opscloud/build/summary/BuildUser'
  import BuildTimes from '@/components/opscloud/build/summary/BuildTimes'
  import BuildArtifacts from '@/components/opscloud/build/summary/BuildArtifacts'
  import BuildExecutors from '@/components/opscloud/build/summary/BuildExecutors'
  import BuildChanges from '@/components/opscloud/build/summary/BuildChanges'

  import { queryCiJobBuildByBuildId } from '@api/build/job.build.js'

  const build = {
    user: { email: '' },
    ago: '',
    artifacts: [],
    changes: [],
    executors: []
  }

  export default {
    name: 'AndroidBuildDetails',
    data () {
      return {
        title: 'Android构建任务详情',
        buildId: '',
        build: build,
        options: {
          stripe: true
        },
        imageUrl: require('@/static/icons/android.svg'),
        pageUrl: '',
        downloadHref: ''
      }
    },
    mounted () {
      this.buildId = this.$route.query.buildId
      this.fetchData()
      this.$store.dispatch('d2admin/menu/asideCollapseSet', true)
    },
    components: {
      VueQr,
      BuildUser,
      BuildTimes,
      BuildArtifacts,
      BuildExecutors,
      BuildChanges
    },
    methods: {
      initDownloadHref () {
        for (let i = 0; i < this.build.artifacts.length; i++) {
          let artifact = this.build.artifacts[i]
          let size = artifact.artifactFileName.length
          if (artifact.artifactFileName.lastIndexOf('.apk') === (size - 4)) {
            this.downloadHref = artifact.ossUrl
            break
          }
        }
      },
      fetchData () {
        queryCiJobBuildByBuildId(this.buildId)
          .then(res => {
            this.build = res.body
            this.initDownloadHref()
          })
      }
    }
  }
</script>

<style>

  .input {
    display: inline-block;
    max-width: 200px;
  }

  .select {
    margin-right: 5px;
  }
</style>
