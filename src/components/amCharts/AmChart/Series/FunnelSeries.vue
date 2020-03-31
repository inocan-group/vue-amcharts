<template>
  <div class="funnel-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { useSeries } from '../composables'
import { IDictionary } from 'common-types'
import { ChartType } from '../index'
import { FunnelSeries, SlicedChart } from '@amcharts/amcharts4/charts'

export default defineComponent({
  name: 'FunnelSeries',
  props: {},

  setup(props: IDictionary, context: SetupContext) {
    const series: Ref<FunnelSeries> = ref(new FunnelSeries())
    const { actionsConfig, register, onChartConfig, initializeProps, childReady, dataReady } = useSeries(
      props,
      context,
      series,
      SlicedChart,
    )

    dataReady(series)

    register(ChartType.series, props.id, FunnelSeries, series)

    actionsConfig(s => ({}))

    onChartConfig(chart => {
      initializeProps()
      series.value = chart.series.push(series.value)
    })

    childReady()

    return { series }
  },
})
</script>

<style scoped>
.column-series {
  opacity: 1;
}
</style>
