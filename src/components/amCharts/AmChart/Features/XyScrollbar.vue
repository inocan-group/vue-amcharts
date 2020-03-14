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
      if (props.axis === 'x') {
        const axis = getComponent('xAxis', 'dates').instance
        scrollbar.value.series.push(axis)
        chart.scrollbarX = scrollbar.value
      } else {
        const axis = getComponent('yAxis', 'dates').instance
        scrollbar.value.series.push(axis)
        chart.scrollbarY = scrollbar.value
      }
    }

    register(ChartType.features, 'scrollbar', configure)

    return { XYChartScrollbar }
  },
})
</script>

<style scoped></style>
