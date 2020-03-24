<template>
  <div class="column-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { ColumnSeries } from '@amcharts/amcharts4/charts'
import { useSeries, seriesProps, useRegistry, useProps } from '../composables'
import { IDictionary } from 'common-types'
import { IChart, ChartType } from '../index'
import { color } from '@amcharts/amcharts4/core'

export default defineComponent({
  name: 'ColumnSeries',
  props: {
    ...seriesProps,
  },

  setup(props: IDictionary, context: SetupContext) {
    const { register, onChartConfig } = useRegistry(props, context)
    const { onPropChange, respondTo, initializeProps } = useProps(props)
    const series: Ref<ColumnSeries> = ref(new ColumnSeries())
    const { setupAxes, dataReady, addToRegistration } = useSeries(props, context, series)
    dataReady(series.value)
    const axisConfig: Ref<IDictionary> = ref({})

    register(ChartType.series, props.id, series)

    const actionConfig = {
      name: series.value,
      tooltipText: series.value,
      show: () => {
        if (props.show) {
          series.value.show()
          series.value.invalidate()
        } else {
          series.value.hide()
          series.value.invalidate()
        }
      },
      stroke: () => {
        if (props.stroke !== undefined) {
          series.value.stroke = color(props.stroke)
          series.value.invalidate()
        }
      },
      fill: () => {
        series.value.fill = color(props.fill)
        series.value.invalidate()
      },
      strokeWidth: series.value,
    }

    onPropChange((prop, value) => {
      respondTo(prop, value, actionConfig)
    })

    onChartConfig((chart: IChart) => {
      axisConfig.value = setupAxes(series)
      series.value = chart.series.push(series.value)
      initializeProps(actionConfig)

      if (props.tooltipText) {
        console.warn(
          `You have configured tooltip text for the ${props.name} LineSeries component but there is no Cursor on this chart so it will not be displayed!`,
        )
      }
    })

    return { series, axisConfig }
  },
})
</script>

<style scoped>
.column-series {
  opacity: 1;
}
</style>
