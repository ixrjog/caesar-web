<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div id="taskExecutionWeekChart" style="width: 100%; height: 300px;"></div>
    </el-card>
  </div>
</template>

<script>

  import { queryTaskExecutionGroupByWeek } from '@api/dashboard/dashboard.js'

  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
  require('echarts/map/js/china')
  require('echarts/lib/chart/line')
  require('echarts/lib/chart/bar')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')

  export default {
    name: 'TaskExecutionGroupByWeek',
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
        let myChart = echarts.init(document.getElementById('taskExecutionWeekChart'))
        // 指定图表的配置项和数据

        let option = {
          title: {
            text: '(周)构建统计',
            textStyle: {
              fontSize: 14,
              align: 'center'
            }
          },
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: data.buildTaskGoupByWeeks.map(function (item) {
                return item['weeks']
              }),
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '任务执行次数',
              type: 'bar',
              barWidth: '60%',
              data: data.buildTaskGoupByWeeks.map(function (item) {
                return item['count']
              })
            }
          ]
        }

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      fetchData () {
        queryTaskExecutionGroupByWeek()
          .then(res => {
            this.initChart(res.body)
          })
      }
    }
  }
</script>

<style>

</style>
