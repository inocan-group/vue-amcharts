<template>
  <div class="curve-step-line-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { CurveStepLineSeries } from '@amcharts/amcharts4/plugins/timeline'
import { useSeries, seriesProps } from '../composables'
import { IDictionary } from 'common-types'
import { IChart, ChartType } from '../index'
import { color } from '@amcharts/amcharts4/core'

export default defineComponent({
  name: 'CurveStepLineSeries',
  props: {
    ...seriesProps,
  },

  setup(props: IDictionary, context: SetupContext) {
    const series: Ref<CurveStepLineSeries> = ref(new CurveStepLineSeries())
    const { actionsConfig, register, onChartConfig, initializeProps, childReady, setupAxes, dataReady } = useSeries(
      props,
      context,
      series,
    )
    dataReady(series.value)
    const axisConfig: Ref<IDictionary> = ref({})

    register(ChartType.series, props.id, CurveStepLineSeries, series)

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
      stroke: [s, v => color(v ?? 'rgb(103,183,220)'), () => s.invalidate()], // default color is rgb(103,183,220)
      fill: [s, v => color(v ?? 'rgb(103,183,220)'), () => s.invalidate()],
      fillOpacity: s,
      strokeWidth: s,
    }))

    onChartConfig((chart: IChart) => {
      initializeProps()
      series.value = chart.series.push(series.value)
      axisConfig.value = setupAxes(series)

      if (props.tooltipText) {
        console.warn(
          `You have configured tooltip text for the ${props.name} CurveStepLineSeries component but there is no Cursor on this chart so it will not be displayed!`,
        )
      }
    })

    childReady()

    return { series, axisConfig }
  },
})
</script>

<style scoped>
.curve-step-line-series {
  opacity: 1;
}
</style>
