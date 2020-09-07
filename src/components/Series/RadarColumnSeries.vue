<template>
  <div class="radar-column-series"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Ref, ref } from 'vue'
import { IDictionary } from 'common-types'
import { RadarColumnSeries } from '@amcharts/amcharts4/charts'
import { useSeries, seriesProps } from '../composables'
import { ChartType } from '../types'
import { color } from '@amcharts/amcharts4/core'

export default defineComponent({
  name: 'RadarColumnSeries',
  props: {
    ...seriesProps,
  },

  setup(props: IDictionary, context: SetupContext) {
    const series: Ref<RadarColumnSeries> = ref(new RadarColumnSeries())
    const { actionsConfig, register, onChartConfig, initializeProps, childReady, setupAxes, dataReady } = useSeries(
      props,
      context,
      series,
    )
    dataReady(series.value)
    const axisConfig: Ref<IDictionary> = ref({})

    register(ChartType.series, props.id, RadarColumnSeries, series)

    actionsConfig(s => ({
      name: s,
      tooltipText: [s, 'columns.template.tooltipText', v => v],
      show: () => {
        if (props.show) {
          s.show()
          s.invalidate()
        } else {
          s.hide()
          s.invalidate()
        }
      },
      stroke: [s, v => color(v ?? 'rgb(103,183,220)'), () => s.invalidate()], // default color is rgb(103,183,220)
      fill: [s, v => color(v ?? 'rgb(103,183,220)'), () => s.invalidate()],
      fillOpacity: [s, 'columns.template.fillOpacity', v => v],
      strokeWidth: [s, 'columns.template.strokeWidth', v => v],
      strokeOpacity: [s, 'columns.template.strokeOpacity', v => v],
    }))

    onChartConfig(chart => {
      initializeProps()
      series.value = chart.series.push(series.value)
      axisConfig.value = setupAxes(series)
    })

    childReady()

    return { series, axisConfig }
  },
})
</script>

<style scoped>
.radar-column-series {
  opacity: 1;
}
</style>
