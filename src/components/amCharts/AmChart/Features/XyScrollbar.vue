<template>
  <div class="xy-scrollbar"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { IChart } from '..'
import { XYChartScrollbar, LineSeries, ColumnSeries } from '@amcharts/amcharts4/charts'
import { useRegistry, useProps } from '../composables'
import { ChartType } from '../types'
import { IDictionary } from 'common-types'

export default defineComponent({
  name: 'XyScrollbar',
  props: {
    series: {
      type: String,
      default: '',
    },
    axis: {
      validator: v => ['y', 'x'].includes(v),
      default: 'x',
    },
    tooltipText: {
      type: String,
      default: '',
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const { register, getComponent, onChartConfig, childReady, getChart } = useRegistry(props, context)
    const scrollbar: Ref<XYChartScrollbar> = ref(new XYChartScrollbar())
    const { actionsConfig, initializeProps } = useProps(props, scrollbar, getChart)

    register(ChartType.features, 'scrollbar', XYChartScrollbar, scrollbar)

    actionsConfig(tt => ({
      tooltipText: tt,
    }))

    onChartConfig((chart: IChart) => {
      initializeProps()
      if (props.axis === 'x' || props.axis === undefined) {
        const series = getComponent<LineSeries | ColumnSeries>('series', props.series)
        scrollbar.value.series.push(series)
        chart.scrollbarX = scrollbar.value
      } else {
        const series = getComponent<LineSeries | ColumnSeries>('series', props.series)
        scrollbar.value.series.push(series)
        chart.scrollbarY = scrollbar.value
      }
    })

    childReady()

    return { XYChartScrollbar }
  },
})
</script>

<style scoped></style>
