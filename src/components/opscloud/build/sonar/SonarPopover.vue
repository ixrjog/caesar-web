<template>
  <div>
    <el-popover placement="top-start" trigger="hover" width="400">
      <el-row :gutter="10">
        <span>可靠性</span>
        <el-button type="text" style="float: right; padding: 3px 0" @click="handlerOpenUrl">跳转详情页面</el-button>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="box-card" shadow="never">
            <div style="font-size: 30px;color:#20A9D9 ;font-weight: 300">{{ sonarQube.measures.bugs.value }}</div>
            <div style="font-size: 10px; color: #B7B6B6">Bugs</div>
          </el-card>
        </el-col>
        <el-col :span="12" v-if="sonarQube.measures.new_bugs != null">
          <el-card class="box-card" shadow="never">
            <div style="font-size: 30px;color:#20A9D9 ;font-weight: 300">{{ sonarQube.measures.new_bugs.periods[0].value }}
            </div>
            <div style="font-size: 10px; color: #B7B6B6">新增Bugs</div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <span>安全性</span>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="box-card" shadow="never">
            <div style="font-size: 30px;color:#20A9D9 ;font-weight: 300">{{ sonarQube.measures.vulnerabilities.value
              }}
            </div>
            <div style="font-size: 10px; color: #B7B6B6">漏洞</div>
          </el-card>
        </el-col>
        <el-col :span="12" v-if="sonarQube.measures.new_vulnerabilities != null">
          <el-card class="box-card" shadow="never">
            <div style="font-size: 30px;color:#20A9D9 ;font-weight: 300">{{ sonarQube.measures.new_vulnerabilities.periods[0].value }}
            </div>
            <div style="font-size: 10px; color: #B7B6B6">新增漏洞</div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <span>覆盖率</span>
      </el-row>
      <el-row :gutter="10">
        <el-col>
          <el-card class="box-card" shadow="never">
            <div style="font-size: 30px;color:#20A9D9 ;font-weight: 300">{{ sonarQube.measures.coverage.value }}%</div>
            <div style="font-size: 10px; color: #B7B6B6">覆盖率</div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <span>重复</span>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="box-card" shadow="never">
            <div style="font-size: 30px;color:#20A9D9 ;font-weight: 300">{{
              sonarQube.measures.duplicated_lines_density.value }}%
            </div>
            <div style="font-size: 10px; color: #B7B6B6">重复度</div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" shadow="never">
            <div style="font-size: 30px;color:#20A9D9 ;font-weight: 300">{{ sonarQube.measures.duplicated_blocks.value
              }}
            </div>
            <div style="font-size: 10px; color: #B7B6B6">重复块</div>
          </el-card>
        </el-col>
      </el-row>
      <el-button slot="reference" type="text"><img :src="sonarQube.alertStatus"></el-button>
    </el-popover>
  </div>
</template>

<script>

  import util from '@/libs/util.js'

  export default {
    name: 'SonarPopover',
    data () {
      return {}
    },
    props: ['sonarQube'],
    methods: {
      handlerOpenUrl () {
        util.open(this.sonarQube.projectUrl)
      }
    }
  }
</script>

<style scoped>

</style>
