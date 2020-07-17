<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <div>
        <organization-chart :datasource="ds" :pan="true" :zoom="true" :style="chartStyle"></organization-chart>
      </div>
    </template>
  </d2-container>
</template>

<script>

  import OrganizationChart from 'vue-organization-chart'
  import 'vue-organization-chart/dist/orgchart.css'

  // API
  import { queryOrgChartByParentId } from '@api/org/org.js'

  const queryOrgChartBySetting = -1

  export default {
    data () {
      return {
        ds: {},
        chartStyle: {
          fontFamily: 'Arial',
          height: '420px',
          border: '2px dashed #aaa',
          borderRadius: '5px',
          overflow: 'auto',
          textAlign: 'left',
          direction: '12r'
        },
        title: '组织架构',
        options: {
          'data': this.ds,
          'nodeContent': 'title',
          'direction': 'l2r',
          'pan': true
        },
        orgChartId: queryOrgChartBySetting
      }
    },
    mounted () {
      this.fetchData()
    },
    components: {
      OrganizationChart
    },
    methods: {
      fetchData () {
        queryOrgChartByParentId(this.orgChartId)
          .then(res => {
            this.ds = res.body
          })
      }
    }
  }
</script>

<style>
</style>
