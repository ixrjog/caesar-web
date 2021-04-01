<template>
  <div>
    <div v-for="pipeline in pipelines" :key="pipeline.id" style="font-size: 12px">
      <template>
        <el-card shadow="hover" body-style="padding: 2px" style="margin-right: 10px;margin-bottom: 10px">
          <div slot="header" class="clearfix" style="height: 15px">
              <span>
                <el-tag>{{ pipeline.jobName }}</el-tag>
                <el-tag style="margin-left: 5px">
                  <i class="el-icon-loading" v-show="pipeline.isRunning"></i>
                  任务编号 : {{ pipeline.jobBuildNumber }}</el-tag>
                <el-tooltip class="item" effect="light" content="展开日志" placement="top-start">
                <el-button style="float: right; padding: 3px 0" type="text" @click="handlerPipelineOutput(pipeline)">
                  Log
                </el-button>
              </el-tooltip>
              </span>
          </div>
          <div style="height: 120px">
            <!--        :onNodeClick='nodeClick'-->
            <!--        :selectedStage='selectedNode'-->
            <!--        layout='layout'-->
            <pipeline-graph
              :stages='pipeline.nodes'
              :layout='layout'
            />
          </div>
        </el-card>
      </template>
    </div>
  </div>
</template>

<script>

  import util from '@/libs/util'

  // pipeline 图形
  import PipelineGraph from 'jenkins-pipeline-graph-vue'

  const layout = {
    nodeSpacingH: 90, // 节点间距
    parallelSpacingH: 400, // 平行间距
    nodeRadius: 12, // 节点半径
    terminalRadius: 10, // 终端半径
    curveRadius: 5, // 跳过连接线半径
    connectorStrokeWidth: 8,
    labelOffsetV: 20, // 文字标签向上位移
    smallLabelOffsetV: 10
  }

  const wsUrl = 'ws/pipeline'

  export default {
    name: 'TaskPipeline',
    props: ['buildType'],
    data () {
      return {
        title: '持续集成',
        activeName: 'myApplication',
        socket: null,
        socketURI: util.wsUrl(wsUrl),
        timer: null, // 查询定时器
        intervalTime: 12000,
        layout: layout,
        pipelines: []
      }
    },
    components: {
      PipelineGraph
    },
    mounted () {
      this.initSocket()
    },
    destroyed () {
    },
    methods: {
      initSocket () {
        this.socket = new WebSocket(this.socketURI)
        this.socketOnClose()
        this.socketOnOpen()
        this.socketOnError()
        this.socketOnMessage()
      },
      setTimer () {
        this.timer = setInterval(() => {
          this.fetchData()
          // console.log('开始定时...每10秒执行一次')
        }, 12000)
      },
      socketOnOpen () {
        let _this = this
        this.socket.onopen = () => { // 链接成功后
          console.log('WebSocket链接成功！')
          let message = {
            status: 'INITIAL',
            token: util.cookies.get('token')
          }
          _this.socketOnSend(JSON.stringify(message))
          _this.setTimer()
        }
      },
      socketOnClose () {
        this.socket.onclose = () => {
          console.log('WebSocket链接关闭,尝试重新链接！')
          setTimeout(() => {
            this.initSocket()
          }, 15000)
        }
      },
      socketOnError () {
        this.socket.onerror = () => {
          // console.log('socket 链接失败')
        }
      },
      socketOnSend (data) {
        this.socket.send(data)
      },
      socketOnMessage () {
        this.socket.onmessage = (message) => {
          this.pipelines = JSON.parse(message.data)
        }
      },
      handlerPipelineOutput (pipeline) {
        let param = {
          buildType: this.buildType,
          buildId: pipeline.id
        }
        this.$emit('handlerOutput', param)
      },
      fetchData () {
        let message = {
          status: 'QUERY_TASK',
          buildType: this.buildType
        }
        try {
          this.socketOnSend(JSON.stringify(message))
        } catch (e) {
        }
      }
    }
  }
</script>

<style scoped>

</style>
