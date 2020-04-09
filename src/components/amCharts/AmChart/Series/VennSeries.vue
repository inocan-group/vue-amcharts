<template>
  <div class="pie-series"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Ref, ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { VennSeries } from '@amcharts/amcharts4/plugins/venn'
import { useSeries } from '../composables'
import { ChartType } from '../types'
import { color } from '@amcharts/amcharts4/core'

export default defineComponent({
  name: 'VennSeries',
  props: {
    data: { type: Array, requried: true },
    category: { type: String, required: true },
    value: { type: String, required: true },
    intersections: { type: String },
    hidden: { type: String },
    hiddenInLegend: { type: String },
  },

  setup(props: IDictionary, context: SetupContext) {
    const series: Ref<VennSeries> = ref(new VennSeries())
    const { dataReady, dataMeta, childReady, actionsConfig, initializeProps, register, onChartConfig } = useSeries(
      props,
      context,
      series,
    )

    register(ChartType.series, props.id || 'primary', VennSeries, series)

    dataReady(series)

    actionsConfig(s => ({
      data: v => v,
      value: [s, 'dataFields.value', v => v],
      category: [s, 'dataFields.category', v => v],
      intersections: [
        s,
        'dataFields.intersections',
        v => {
          s.invalidate()
          console.log(v)
          return v
        },
      ],
      hidden: [s, 'dataFields.hidden', v => v],
      hiddenInLegend: [s, 'dataFields.hiddenInLegend', v => v],
    }))

    onChartConfig(chart => {
      initializeProps()
      chart.series.push(series.value)
    })

    childReady()

    return { series, dataMeta }
  },
})
</script>

<style scoped>
.pie-series {
  opacity: 1;
}
</style>
