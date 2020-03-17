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
    const { register, getRegistration } = useRegistry(props, context)
    const { setupAxes, setupEvents } = useSeries(props, context)
    const series: Ref<LineSeries> = ref(new LineSeries())
    const axisConfig: Ref<IDictionary> = ref({})

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

    onPropChange(async (prop: string, current) => {
      respondTo(prop, current, propertyConfig)
    })

    const configure = async (chart: IChart) => {
      axisConfig.value = setupAxes(series)
      setupEvents(series)
      initializeProps(propertyConfig)
      series.value = chart.series.push(series.value)
      initializeProps(propertyConfig)

      try {
        getRegistration('cursor')
      } catch (e) {
        if (props.tooltipText) {
          console.warn(
            `You have configured tooltip text for the ${props.name} LineSeries component but there is no Cursor on this chart so it will not be displayed!`,
          )
        }
      }
    }

    register(ChartType.series, props.id, configure, { instance: series })

    return { instance: series, axisConfig }
  },
})
</script>

<style scoped>
.line-series {
  opacity: 1;
}
</style>
