<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div id="jobTypeChart" style="width: 100%; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script>

  import { queryJobTypeStatistics } from '@api/dashboard/dashboard.js'

  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
  require('echarts/map/js/china')
  require('echarts/lib/chart/line')
  require('echarts/lib/chart/bar')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')

  export default {
    name: 'JobTypeStatistics',
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
        let myChart = echarts.init(document.getElementById('jobTypeChart'))
        // 指定图表的配置项和数据
        let dataList = data.buildJobTypeStatistics.map(function (item) {
          // return item['hours']
          return { name: item['jobType'], value: item['total'] }
        })

        let legendList = data.buildJobTypeStatistics.map(function (item) {
          return item['jobType']
        })

        let option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: legendList
          },
          series: [
            {
              name: '任务类型',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: dataList
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      fetchData () {
        queryJobTypeStatistics()
          .then(res => {
            this.initChart(res.body)
          })
      }
    }
  }
</script>

<style>

</style>
