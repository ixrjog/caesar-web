<template>
  <div>
    <div v-for="(pipeline,i) in pipelines" :key="pipeline.id" style="font-size: 12px">
      <template>
        <el-card shadow="hover" body-style="padding: 2px" class="card">
          <div slot="header" class="clearfix">
              <span>
                <el-tag>{{ pipeline.jobName }}</el-tag>
                <span class="buildNumber"><i class="el-icon-loading" v-show="pipeline.isRunning"></i>
                  #{{ pipeline.jobBuildNumber }}</span>
                <span class="ago"><i class="fa fa-clock-o"></i>{{ pipeline.ago }}</span>
                <el-tooltip class="item" effect="light" content="展开日志" placement="top-start">
                  <el-button class="btn" type="text" @click="handlerPipelineOutput(i)">
                   <d2-icon name="television"/>
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="登录节点(管理员专用)" placement="top-start"
                            v-if="pipeline.executors != null">
                  <el-button class="btn" type="text" @click="handlerOpenExecutor(pipeline)">
                    <d2-icon name="terminal"/>
                  </el-button>
                </el-tooltip>
              </span>
          </div>
          <div :style='{ height: pipeline.chartHeight }'>
            <!--        :onNodeClick='nodeClick'-->
            <!--        :selectedStage='selectedNode'-->
            <!--        layout='layout'-->
            <pipeline-graph
              :stages='pipeline.nodes'
              :layout='layout'
            />
          </div>
          <pipeline-output :buildType="buildType" :buildId="pipeline.id" :ref="`pipelines${i}`"></pipeline-output>
        </el-card>
      </template>
    </div>
  </div>
</template>

<script>

  import util from '@/libs/util'

  // pipeline 图形
  import PipelineGraph from 'jenkins-pipeline-graph-vue'
  import PipelineOutput from '@/components/opscloud/pipeline/PipelineOutput'

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
    props: ['buildType', 'queryParam'],
    data () {
      return {
        title: '持续集成',
        activeName: 'myApplication',
        socket: null,
        socketURI: util.wsUrl(wsUrl),
        layout: layout,
        pipelines: []
      }
    },
    components: {
      PipelineGraph,
      PipelineOutput
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
      socketOnOpen () {
        let _this = this
        this.socket.onopen = () => { // 链接成功后
          console.log('WebSocket链接成功！')
          let message = {
            status: 'INITIAL',
            token: util.cookies.get('token'),
            buildType: this.buildType,
            queryType: this.queryParam.queryType,
            querySize: this.queryParam.querySize
          }
          _this.socketOnSend(JSON.stringify(message))
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
      handlerPipelineOutput (i) {
        this.$refs[`pipelines${i}`][0].output()
      },
      handlerOpenExecutor (pipeline) {
        this.$emit('handlerOpenExecutor', pipeline.executors[0])
      }
    }
  }
</script>

<style scoped>
  .el-card__header {
    height: 15px;
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .buildNumber {
    color: #5b5d66;
    margin-left: 10px;
  }

  .ago {
    color: #5b5d66;
    margin-left: 10px;
  }

  .btn {
    float: right;
    padding: 3px 0;
    margin-left: 10px;
  }

  .card {
    margin-bottom: 10px
  }

</style>
