<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div id="engineChart" style="width: 100%; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script>

  import util from '@/libs/util'

  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
  require('echarts/map/js/china')
  require('echarts/lib/chart/line')
  require('echarts/lib/chart/bar')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')

  const wsUrl = 'ws/engine'

  export default {
    name: 'EngineChart',
    data () {
      return {
        socket: null,
        socketURI: util.wsUrl(wsUrl),
        engineChart: null,
        timer: null
      }
    },
    mixins: [],
    components: {},
    mounted () {
      this.initSocket()
      this.initChart()
    },
    destroyed () {
      clearInterval(this.timer) // 销毁定时器
      this.socket.close()
    },
    methods: {
      setTimer () {
        if (this.timer !== null) return
        this.timer = setInterval(() => {
          this.retrySocket()
        }, 10000)
      },
      retrySocket () {
        if (this.socket.readyState === 3) {
          // console.log('服务端链接关闭,尝试重新链接！')
          try {
            this.socket.close()
          } catch (e) {
          }
          this.socket = null
          this.initSocket()
        }
      },
      initSocket () {
        this.socket = new WebSocket(this.socketURI)
        this.socketOnClose()
        this.socketOnOpen()
        this.socketOnError()
        this.socketOnMessage()
        this.setTimer()
      },
      socketOnOpen () {
        this.socket.onopen = () => { // 链接成功后
          // console.log('引擎视图链接成功！')
        }
      },
      socketOnClose () {
        this.socket.onclose = () => {
          // console.log('引擎视图链接关闭！')
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
          this.pushData(JSON.parse(message.data))
        }
      },
      initChart () {
        this.engineChart = echarts.init(document.getElementById('engineChart'))
      },
      pushData (data) {
        // 指定图表的配置项和数据
        let option = {
          title: {
            text: 'Jenkins Engine Cluster',
            subtext: 'Caesar持续集成平台调度多Jenkins集群',
            textStyle: {
              fontSize: 14,
              align: 'center'
            },
            subtextStyle: {
              align: 'center'
            },
            sublink: 'http://wiki.xinc818.com/pages/viewpage.action?pageId=17827555'
          },
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
          },
          series: [
            {
              type: 'tree',
              id: 0,
              name: 'tree1',
              data: [data],
              top: '10%',
              left: '8%',
              bottom: '22%',
              right: '35%',
              symbolSize: 7,
              edgeShape: 'polyline',
              edgeForkPosition: '63%',
              initialTreeDepth: 3,
              lineStyle: {
                width: 2
              },
              label: {
                backgroundColor: '#fff',
                position: 'left',
                verticalAlign: 'middle',
                align: 'right'
              },
              leaves: {
                label: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              },
              expandAndCollapse: true,
              animationDuration: 550,
              animationDurationUpdate: 750
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        this.engineChart.setOption(option, true)
      }
    }
  }
</script>

<style>
  .table-expand {
    font-size: 0;
  }

  .table-expand label {
    width: 150px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
