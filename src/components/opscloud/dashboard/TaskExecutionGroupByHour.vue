<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div id="taskExecutionChart" style="width: 100%; height: 300px;"></div>
    </el-card>
  </div>
</template>

<script>

  import { queryTaskExecutionGroupByHour } from '@api/dashboard/dashboard.js'

  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
  require('echarts/map/js/china')
  require('echarts/lib/chart/line')
  require('echarts/lib/chart/bar')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')

  export default {
    name: 'TaskExecutionGroupByHour',
    data () {
      return {}
    },
    mixins: [],
    components: {},
    mounted () {
      this.fetchData()
    },
    methods: {
      initChart (data) {
        let myChart = echarts.init(document.getElementById('taskExecutionChart'))
        // 指定图表的配置项和数据
        let buildTaskDataList = data.buildTaskGroupByHours.map(function (item) {
          return item['hours']
        })
        let buildTaskValueList = data.buildTaskGroupByHours.map(function (item) {
          return item['count']
        })
        let deploymentTaskDataList = data.deploymentTaskGroupByHours.map(function (item) {
          return item['hours']
        })
        let deploymentTaskValueList = data.deploymentTaskGroupByHours.map(function (item) {
          return item['count']
        })

        let option = {
          // Make gradient line here
          visualMap: [{
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: 400
          }, {
            show: false,
            type: 'continuous',
            seriesIndex: 1,
            dimension: 0,
            min: 0,
            max: buildTaskDataList.length - 1
          }],

          title: [{
            left: 'center',
            text: '构建任务小时分布',
            textStyle: {
              fontSize: 14,
              align: 'center'
            }
          }, {
            top: '55%',
            left: 'center',
            text: '部署任务小时分布',
            textStyle: {
              fontSize: 14,
              align: 'center'
            }
          }],
          tooltip: {
            trigger: 'axis'
          },
          xAxis: [{
            data: buildTaskDataList
          }, {
            data: deploymentTaskDataList,
            gridIndex: 1
          }],
          yAxis: [{
            splitLine: { show: false }
          }, {
            splitLine: { show: false },
            gridIndex: 1
          }],
          grid: [{
            bottom: '60%'
          }, {
            top: '60%'
          }],
          series: [{
            type: 'line',
            showSymbol: false,
            data: buildTaskValueList
          }, {
            type: 'line',
            showSymbol: false,
            data: deploymentTaskValueList,
            xAxisIndex: 1,
            yAxisIndex: 1
          }]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      fetchData () {
        queryTaskExecutionGroupByHour()
          .then(res => {
            this.initChart(res.body)
          })
      }
    }
  }
</script>

<style>

</style>
