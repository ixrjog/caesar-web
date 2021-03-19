<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div id="engineChart" style="width: 100%; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script>

  // 此组件废弃

  import { queryEngineStatus } from '@api/jenkins/jenkins.engine.js'

  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
  require('echarts/map/js/china')
  require('echarts/lib/chart/line')
  require('echarts/lib/chart/bar')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')

  export default {
    name: 'JenkinsEngineStatus',
    data () {
      return {
        timer: null // 查询定时器
      }
    },
    mixins: [],
    components: {},
    mounted () {
      this.fetchData()
      this.setTimer()
    },
    beforeDestroy () {
      clearInterval(this.timer) // 销毁定时器
    },
    methods: {
      setTimer () {
        if (this.timer !== null) {
          return
        }
        this.timer = setInterval(() => {
          this.fetchData()
          // console.log('开始定时...每N秒执行一次')
        }, 20000)
      },
      initChart (data) {
        let chart = echarts.init(document.getElementById('engineChart'))
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
        chart.setOption(option, true)
      },
      fetchData () {
        queryEngineStatus()
          .then(res => {
            this.initChart(res.body)
          })
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
