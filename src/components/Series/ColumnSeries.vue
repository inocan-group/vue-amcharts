<template>
  <div class="column-series"></div>
</template>

<script lang="ts">
// import { defineComponent, ref, Ref, SetupContext } from 'vue'
import { ColumnSeries } from '@amcharts/amcharts4/.internal/charts/series/ColumnSeries'
import { useSeries, seriesProps } from '../composables'
import { IDictionary } from 'common-types'
import { ChartType, allowUndefined } from '../index'
import { color } from '@amcharts/amcharts4/.internal/core/utils/Color'

export default {
  name: 'ColumnSeries',
  props: {
    ...seriesProps,
  },

  setup(props: IDictionary, context: SetupContext) {
    const series: Ref<ColumnSeries> = ref(new ColumnSeries())
    const { actionsConfig, register, onChartConfig, initializeProps, childReady, setupAxes, dataReady } = useSeries(
      props,
      context,
      series,
    )
    dataReady(series.value)
    const axisConfig: Ref<IDictionary> = ref({})

    register(ChartType.series, props.id, ColumnSeries, series)

    actionsConfig(s => ({
      name: s,
      tooltipText: s,
      show: () => {
        if (props.show) {
          s.show()
          s.invalidate()
        } else {
          s.hide()
          s.invalidate()
        }
      },
      stroke: [s, v => allowUndefined(color(v)), () => s.invalidate()],
      fill: [s, v => allowUndefined(color(v)), () => s.invalidate()],
      strokeWidth: s,
    }))

    onChartConfig(chart => {
      axisConfig.value = setupAxes(series)
      series.value = chart.series.push(series.value)
      initializeProps()

      if (props.tooltipText) {
        console.warn(
          `You have configured tooltip text for the ${props.name} LineSeries component but there is no Cursor on this chart so it will not be displayed!`,
        )
      }
    })

    childReady()

    return { series, axisConfig }
  },
}
</script>

<style scoped>
.column-series {
  opacity: 1;
}
</style>
