<template>
  <div class="pie-series"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Ref, ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { VennSeries } from '@amcharts/amcharts4/plugins/venn'
import { color } from '@amcharts/amcharts4/core'
import { useSeries } from '../composables'
import { ChartType } from '../types'

export default defineComponent({
  name: 'VennSeries',
  props: {
    data: { type: Array, requried: true },
    category: { type: String, required: true },
    value: { type: String, required: true },
    intersections: { type: String },
    hidden: { type: String },
    hiddenInLegend: { type: String },
    fill: { type: String },
    fillOpacity: { type: Number, validator: (v: number) => v >= 0 && v <= 1 },
    labelText: { type: String, default: '{category}' },
    labelFontSize: { type: Number, default: 16 },
    labelFill: { type: String, default: '#000' },
    tooltipText: { type: String, default: '{value}' },
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
      value: [s, 'dataFields.value'],
      category: [s, 'dataFields.category'],
      // TODO: Find out what to invalidate to make this reactive
      intersections: [
        s,
        'dataFields.intersections',
        v => {
          s.invalidate()
          console.log(v)
          return v
        },
      ],
      hidden: [s, 'dataFields.hidden'],
      hiddenInLegend: [s, 'dataFields.hiddenInLegend'],
      fill: [s, 'slices.template.propertyFields.fill'],
      fillOpacity: [s, 'slices.template.fillOpacity'],
      labelText: [s, 'labels.template.text'],
      labelFontSize: [s, 'labels.template.fontSize'],
      labelFill: [s, 'labels.template.fill', v => color(v)],
      tooltipText: [s, 'slices.template.tooltipText'],
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
