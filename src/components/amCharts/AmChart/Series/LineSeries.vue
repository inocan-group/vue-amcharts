<template>
  <div class="line-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { LineSeries } from '@amcharts/amcharts4/charts'
import { useSeries, useRegistry, seriesProps, useProps } from '../composables'
import { IChart } from '..'
import { ChartType } from '../types'
import { IDictionary } from 'common-types'
import { color } from '@amcharts/amcharts4/core'
type Legend = import('@amcharts/amcharts4/charts').Legend

export default defineComponent({
  name: 'LineSeries',

  props: {
    ...seriesProps,
    /** the width of the line */
    strokeWidth: {
      type: [Number, String],
      default: 1,
    },
    color: {
      type: String,
      default: undefined,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const { onPropChange, respondTo, initializeProps } = useProps(props)
    const { register, getRegistration, onChartConfig } = useRegistry<IChart>(props, context)
    const series: Ref<LineSeries> = ref(new LineSeries())
    const { setupAxes, dataReady } = useSeries(props, context, series)
    const axisConfig: Ref<IDictionary> = ref({})
    dataReady(series)

    const s = series.value
    const propertyConfig = {
      name: s,
      strokeWidth: () => {
        s.strokeWidth = Number(props.strokeWidth)
        s.invalidate()
      },
      tooltipText: s,
      color: () => {
        if (props.color !== undefined) {
          s.stroke = color(props.color)
          s.invalidate()
        }
      },
      show: () => {
        if (props.show) {
          s.show()
          s.invalidate()
        } else {
          s.hide()
          s.invalidate()
        }
      },
    }
    register(ChartType.series, props.id, series)

    onPropChange(async (prop: string, current) => {
      respondTo(prop, current, propertyConfig)
    })

    onChartConfig(chart => {
      axisConfig.value = setupAxes(series)
      // initializeProps(propertyConfig)
      series.value = chart.series.push(series.value)
      initializeProps(propertyConfig)
      console.log('axis config', axisConfig.value)

      try {
        getRegistration('cursor')
      } catch (e) {
        if (props.tooltipText) {
          console.warn(
            `You have configured tooltip text for the ${props.name} LineSeries component but there is no Cursor on this chart so it will not be displayed!`,
          )
        }
      }
      // TODO: why in the world does adding this to the registration cause conflicts!?!
      // addToRegistration('axisConfig', axisConfig.value)
    })

    return { series, axisConfig }
  },
})
</script>

<style scoped>
.line-series {
  opacity: 1;
}
</style>
