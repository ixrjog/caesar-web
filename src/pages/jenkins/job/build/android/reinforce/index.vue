<template>
  <div>
    <div>
      <h1>{{title}}</h1>
    </div>
    <el-col :span="10">
      <el-card shadow="never">
        <el-col :span="6">
          <vue-qr :logoSrc="imageUrl" :text="pageUrl" :size="150"></vue-qr>
        </el-col>
        <el-col :span="18">
          <div style="width:100%;text-align:center; margin-top: 50px">
            <a title="download" style="color: #286090; font-size:2em;" :href="downloadHref">点击安装</a>
          </div>
        </el-col>
      </el-card>
      <el-card shadow="never" style="margin-top: 10px">
        <el-row>
          <el-col :span="22">
            <el-tooltip class="item" effect="light" :content="build.user.email" placement="top-start">
              <el-tag disable-transitions type="primary">{{build.user.displayName}}
              </el-tag>
            </el-tooltip>
            <span style="margin-left: 5px">{{build.ago}}</span>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="light" content="执行人" placement="top-start">
              <i class="el-icon-user" aria-hidden="true"></i>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="22">
            <div>构建时长: {{build.buildTime}}</div>
            <div>开始时间: {{build.startTime}}</div>
            <div>结束时间: {{build.endTime}}</div>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="light" content="构建时间" placement="top-start">
              <i class="el-icon-time" aria-hidden="true"></i>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <!--              产出物详情-->
        <el-row>
          <el-col :span="22">
            <div class="tag-group" v-show="build.artifacts.length > 0">
              <div v-for="item in build.artifacts" :key="item.id">
                <el-tooltip class="item" effect="light" :content="item.ossUrl" placement="top-start">
                  <el-tag type="primary">{{ item.artifactFileName }}</el-tag>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="文件大小" placement="top-start">
                  <el-tag style="margin-left: 5px" type="primary">{{ item.artifactFileSize }}</el-tag>
                </el-tooltip>
              </div>
            </div>
            <span v-show="build.artifacts.length === 0">No Artifacts</span>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="light" content="产出物" placement="top-start">
              <i class="el-icon-folder" aria-hidden="true"></i>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <!--              工作节点-->
        <el-row>
          <el-col :span="22">
            <div class="tag-group" v-show="build.executors.length > 0">
              <div v-for="item in build.executors" :key="item.id">
                <el-tag type="primary">{{ item.nodeName }}:{{ item.privateIp}}</el-tag>
              </div>
            </div>
            <span v-show="build.executors.length === 0">No Executors</span>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="light" content="工作节点" placement="top-start">
              <i class="fa fa-television" aria-hidden="true"></i>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </div>
</template>

<script>

  import VueQr from 'vue-qr'
  import { queryCdJobBuildByBuildId } from '@api/build/job.build.js'

  const build = {
    user: { email: '' },
    ago: '',
    artifacts: [],
    changes: [],
    executors: []
  }

  export default {
    name: 'AndroidReinforceDetails',
    data () {
      return {
        title: 'Android加固任务详情',
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
      this.initPageURL()
      this.$store.dispatch('d2admin/menu/asideCollapseSet', true)
    },
    components: {
      VueQr
    },
    methods: {
      initPageURL () {
        this.pageUrl = window.location.href
      },
      initDownloadHref () {
        for (let i = 0; i < this.build.artifacts.length; i++) {
          let artifact = this.build.artifacts[i]
          let size = artifact.artifactFileName.length
          if (artifact.artifactFileName.lastIndexOf('.zip') === (size - 4)) {
            this.downloadHref = artifact.ossUrl
            break
          }
        }
      },
      fetchData () {
        queryCdJobBuildByBuildId(this.buildId)
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
