<template>
  <div class="line-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { LineSeries } from '@amcharts/amcharts4/charts'
import { useSeries, useRegistry, seriesProps, useProps } from '../composables'
import { IChart } from '..'
import { ChartType } from '../types'
import { IDictionary } from 'common-types'

export default defineComponent({
  name: 'LineSeries',

  props: {
    ...seriesProps,
    /** the width of the line */
    strokeWidth: {
      type: [Number, String],
      default: 1,
    },
  },

  setup(props, context) {
    const { onChange } = useProps(props)
    const { register, getRegistration } = useRegistry(props, context)
    const { setupAxes, setupEvents } = useSeries(props, context)
    const series: Ref<LineSeries> = ref(new LineSeries())
    const axisConfig: Ref<IDictionary> = ref({})

    // const mapper = (props: IDictionary) =>  {
    //   name: 'name',
    //   strokeWidth: () => Number(props.strokeWidth),

    // }

    onChange(async (prop: string, current, old) => {
      console.log(`Prop "${prop}" changed: `, current, old)

      return
    })

    const configure = async (chart: IChart) => {
      axisConfig.value = setupAxes(series)
      setupEvents(series)

      series.value = chart.series.push(series.value)
      series.value.name = props.name
      series.value.strokeWidth = Number(props.strokeWidth)

      series.value.tooltipText = props.tooltipText
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

    // const update = async (chart: IChart, property: string, value: any) => {
    //   //
    // }

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
