<template>
  <div class="pie-series"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Ref, ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { PieSeries } from '@amcharts/amcharts4/charts'
import { useSeries } from '../composables'
import { ChartType } from '../types'
import { color } from '@amcharts/amcharts4/core'

export default defineComponent({
  name: 'PieSeries',
  props: {
    valueProp: {
      type: String,
      required: true,
    },
    categoryProp: {
      type: String,
      required: true,
    },
    /** if there is a property in the data which has color info you can use it to state the fill color */
    fillProp: {
      type: String,
      required: false,
    },
    stroke: {
      type: String,
    },
    strokeWidth: {
      type: [Number, String],
    },
    strokeOpacity: {
      type: [Number, String],
    },
    disableTicks: {
      type: Boolean,
      default: false,
    },
    disableLabels: {
      type: Boolean,
      default: false,
    },
    tooltipText: {
      type: String,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const series: Ref<PieSeries> = ref(new PieSeries())
    const { dataReady, dataMeta, childReady, actionsConfig, initializeProps, register, onChartConfig } = useSeries(
      props,
      context,
      series,
    )

    register(ChartType.series, props.id || 'primary', PieSeries, series)

    dataReady(series, {
      id: props.categoryProp,
      dataProps: [props.valueProp],
      labelProps: [props.categoryProp],
    })

    actionsConfig(s => ({
      stroke: [s, 'slices.template.stroke', (v: string) => color(v)],
      strokeWidth: [s, 'slices.template.strokeWidth', (v: string | number) => Number(v)],
      strokeOpacity: [s, 'slices.template.strokeOpacity', (v: string | number) => Number(v)],
      fillProp: [s, 'slices.template.propertyFields.fill'],
      disableTicks: [s, 'ticks.template.disabled'],
      disableLabels: [s, 'labels.template.disabled'],
      valueProp: [s, 'dataFields.value'],
      categoryProp: [s, 'dataFields.category'],
      // tooltipText: s,
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
