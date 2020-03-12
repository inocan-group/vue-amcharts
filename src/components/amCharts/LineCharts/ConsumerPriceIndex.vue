<template>
  <div>
    <h1>{{ title }}</h1>
    <div class="chart" ref="chartdiv"></div>
    <div class="footer"><slot /></div>
  </div>
</template>

<script lang="ts">
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import { defineComponent, onMounted, ref, onBeforeUnmount, Ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import cpi from '@/components/amCharts/LineCharts/cpi.json'

am4core.useTheme(am4themesAnimated)

export default defineComponent({
  name: 'AmLineChart',
  props: {
    title: String,
  },
  setup(props) {
    const chartdiv = ref(null)
    /**
     * Provides reference to the amCharts API
     */
    const chart: Ref<am4charts.XYChart | null> = ref(null)
    /**
     * Provides references to the data being charted
     */
    const data: Ref<IDictionary[]> = ref([])
    // const title: Ref<string> = ref(props.title)

    onMounted(async () => {
      chart.value = am4core.create((chartdiv.value as unknown) as HTMLElement, am4charts.XYChart)
      chart.value.paddingRight = 2

      data.value = cpi
      chart.value.data = data.value

      const dateAxis = chart.value.xAxes.push(new am4charts.DateAxis())
      dateAxis.renderer.grid.template.location = 0

      const valueAxis = chart.value.yAxes.push(new am4charts.ValueAxis())
      if (valueAxis.tooltip) {
        valueAxis.tooltip.disabled = true
      }
      valueAxis.renderer.minWidth = 35

      const series = chart.value.series.push(new am4charts.LineSeries())
      series.dataFields.dateX = 'Date'
      series.dataFields.valueY = 'Index'

      series.tooltipText = 'Inflation {Inflation}, CPI: {Index}'
      chart.value.cursor = new am4charts.XYCursor()

      const scrollbarX = new am4charts.XYChartScrollbar()
      scrollbarX.series.push(series)
      chart.value.scrollbarX = scrollbarX
    })

    onBeforeUnmount(() => {
      if (chart.value) {
        chart.value.dispose()
      }
    })

    return { chartdiv, chart, data }
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
