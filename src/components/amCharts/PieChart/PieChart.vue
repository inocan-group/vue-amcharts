<template>
  <div class="chart" ref="chartdiv"></div>
</template>

<script lang="ts">
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import { defineComponent, onMounted, ref, Ref, onBeforeUnmount, watch } from '@vue/composition-api'

am4core.useTheme(am4themesAnimated)

export default defineComponent({
  props: {
    chartData: {
      type: Array as () => Record<string, string | number>[],
      required: true,
    },
    category: { type: String, required: true },
    value: { type: String, required: true },
  },
  setup(props) {
    const chartdiv = ref(null)
    const data = props.chartData
    const chart: Ref<am4charts.PieChart | null> = ref(null)

    onMounted(() => {
      // Create chart instance
      chart.value = am4core.create((chartdiv.value as unknown) as HTMLElement, am4charts.PieChart)

      // Add data
      chart.value.data = data

      // Add and configure Series
      const pieSeries = chart.value.series.push(new am4charts.PieSeries())
      pieSeries.dataFields.category = props.category
      pieSeries.dataFields.value = props.value

      // Refresh chart
      watch([() => props.chartData, () => props.category, () => props.value], (newParams, oldParams) => {
        const [newData, newCategory, newValue] = newParams as [Record<string, string | number>[], string, string]

        if (chart.value) {
          chart.value.data.forEach((d, i) => {
            if (d[newCategory] != newData[i][newCategory]) d[newCategory] = newData[i][newCategory]
            if (d[newValue] != newData[i][newValue]) d[newValue] = newData[i][newValue]
          })

          if (oldParams) {
            const [oldData, oldCategory, oldValue] = oldParams as [Record<string, string | number>[], string, string]

            if (newCategory !== oldCategory || newValue !== oldValue) {
              pieSeries.dataFields.category = newCategory as string
              pieSeries.dataFields.value = newValue as string
              chart.value.invalidateData()
            }
          }

          chart.value.invalidateRawData()
        }
      })
    })

    onBeforeUnmount(() => {
      if (chart.value) {
        chart.value.dispose()
      }
    })

    return { chartdiv, chart }
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
