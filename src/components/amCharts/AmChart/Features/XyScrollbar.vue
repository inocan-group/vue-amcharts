<template>
  <div class="xy-scrollbar"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { IChartChildApi, IChart } from '..'
import { XYChartScrollbar, XYChart } from '@amcharts/amcharts4/charts'
import { useRegistry } from '../composables'
import { ChartType } from '../types'

export default defineComponent({
  name: 'XyScrollbar',
  props: {
    series: {
      type: String,
      default: '',
    },
    axis: {
      type: String,
      default: 'x',
    },
    /**
     * in cases where there are more than one axis for a given dimension, you must name which one you want,
     * if you do NOT then it will use the first one
     */
    namedAxis: {
      type: String,
      default: undefined,
    },
    tooltipText: {
      type: String,
      default: '',
    },
  },

  setup(props, context) {
    const { register, getComponent } = useRegistry(props, context, XYChartScrollbar)
    const scrollbar: Ref<XYChartScrollbar> = ref(new XYChartScrollbar())

    const configure = async (chart: IChart) => {
      if (props.tooltipText) {
        scrollbar.value.tooltipText = props.tooltipText
      }
      if (props.axis === 'x' || props.axis === undefined) {
        const axis = getComponent('xAxis', props.namedAxis)
        console.log({ axis })

        scrollbar.value.series.push(axis)
        chart.scrollbarX = scrollbar.value
      } else {
        const axis = getComponent('yAxis', props.namedAxis)
        scrollbar.value.series.push(axis)
        chart.scrollbarY = scrollbar.value
      }
    }

    register(ChartType.features, 'scrollbar', configure, { instance: scrollbar })

    return { XYChartScrollbar }
  },
})
</script>

<style scoped></style>
