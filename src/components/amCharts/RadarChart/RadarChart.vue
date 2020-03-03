<template>
  <div class="chart" ref="chartdiv"></div>
</template>

<script lang="ts">
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import { defineComponent, onMounted, ref, onBeforeUnmount } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const chartdiv = ref(null)
    const data = [
      {
        country: 'Lithuania',
        litres: 501.9,
      },
      {
        country: 'Czech Republic',
        litres: 301.9,
      },
      {
        country: 'Ireland',
        litres: 201.1,
      },
      {
        country: 'Germany',
        litres: 165.8,
      },
      {
        country: 'Australia',
        litres: 139.9,
      },
      {
        country: 'Austria',
        litres: 128.3,
      },
      {
        country: 'UK',
        litres: 99,
      },
      {
        country: 'Belgium',
        litres: 60,
      },
      {
        country: 'The Netherlands',
        litres: 50,
      },
    ]
    let chart: am4charts.RadarChart | undefined = undefined

    onMounted(() => {
      // Create chart instance
      chart = am4core.create((chartdiv.value as unknown) as HTMLElement, am4charts.RadarChart)

      // Add data
      chart.data = data

      // Create axes

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis() as any)
      categoryAxis.dataFields.category = 'country'

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chart.yAxes.push(new am4charts.ValueAxis() as any)

      // Create and configure series
      const series = chart.series.push(new am4charts.RadarSeries())
      series.dataFields.valueY = 'litres'
      series.dataFields.categoryX = 'country'
      series.name = 'Sales'
      series.strokeWidth = 3
    })

    onBeforeUnmount(() => {
      if (chart) {
        chart.dispose()
      }
    })

    return { chartdiv }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart {
  width: 100%;
  height: 300px;
}
</style>
