<template>
  <div class="chart" ref="chartdiv"></div>
</template>

<script lang="ts">
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import { defineComponent, onMounted, ref, onBeforeUnmount } from '@vue/composition-api'

am4core.useTheme(am4themesAnimated)

export default defineComponent({
  setup() {
    const chartdiv = ref(null)
    let chart: am4charts.XYChart | undefined = undefined

    const data: Record<string, Date | string | number>[] = []

    let visits = 10
    for (let i = 1; i < 366; i++) {
      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10)
      data.push({ date: new Date(2018, 0, i), name: 'name' + i, value: visits })
    }

    onMounted(() => {
      chart = am4core.create((chartdiv.value as unknown) as HTMLElement, am4charts.XYChart)
      chart.paddingRight = 20

      chart.data = data

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis())
      dateAxis.renderer.grid.template.location = 0

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      if (valueAxis.tooltip) {
        valueAxis.tooltip.disabled = true
      }
      valueAxis.renderer.minWidth = 35

      const series = chart.series.push(new am4charts.LineSeries())
      series.dataFields.dateX = 'date'
      series.dataFields.valueY = 'value'

      series.tooltipText = '{valueY.value}'
      chart.cursor = new am4charts.XYCursor()

      const scrollbarX = new am4charts.XYChartScrollbar()
      scrollbarX.series.push(series)
      chart.scrollbarX = scrollbarX
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
  height: 500px;
}
</style>
