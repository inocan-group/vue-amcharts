<template>
  <div class="pie-series"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Ref, ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { PieSeries } from '@amcharts/amcharts4/charts'
import { useRegistry, useProps, useSeries, IActionConfiguration } from '../composables'
import { IChart } from '..'
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
    const { onPropChange, respondTo, initializeProps } = useProps(props)
    const { register, onChartConfig } = useRegistry<IChart>(props, context)
    const series: Ref<PieSeries> = ref(new PieSeries())
    const { dataReady, dataMeta } = useSeries(props, context, series)
    const dataFields: Ref<IDictionary> = ref(series.value.dataFields)
    const ttt: Ref<string> = ref(series.value.tooltipText)

    register(ChartType.series, props.id || 'primary', series)
    dataReady(series, {
      id: props.categoryProp,
      dataProps: [props.valueProp],
      labelProps: [props.categoryProp],
    })
    const actionsConfig: IActionConfiguration = () => ({
      stroke: [series, 'slices.template.stroke', (v: string) => color(v)],
      strokeWidth: [series, 'slices.template.strokeWidth', (v: string | number) => Number(v)],
      strokeOpacity: [series, 'slices.template.strokeOpacity', (v: string | number) => Number(v)],
      fillProp: [series, 'slices.template.propertyFields.fill', props.fillProp],
      disableTicks: [series, 'ticks.template.disabled', props.disableTicks],
      disableLabels: [series, 'labels.template.disabled', props.disableLabels],
    })

    onChartConfig(chart => {
      initializeProps(actionsConfig)
      chart.series.push(series.value)
      series.value.dataFields.value = props.valueProp
      series.value.dataFields.category = props.categoryProp
      dataFields.value = series.value.dataFields

      console.log('pie series configured')
    })

    onPropChange((prop, current) => {
      console.log(`${prop} changed`)
      if (props.disableTicks) {
        series.value.ticks.template.disabled = true
      }
      // TODO: another case where respondTo is not doing as it's supposed to

      respondTo(prop, current, actionsConfig)
    })

    return { dataFields, dataMeta, ttt }
  },
})
</script>

<style scoped>
.pie-series {
  opacity: 1;
}
</style>
