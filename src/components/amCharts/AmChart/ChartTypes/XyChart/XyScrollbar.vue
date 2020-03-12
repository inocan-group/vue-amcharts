<template>
  <div class="xy-scrollbar"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { IChartChildApi } from '..'
import { XYChartScrollbar } from '@amcharts/amcharts4/charts'

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
  },

  setup(props, context) {
    const parent = context.parent as IChartChildApi<any>
    const seriesRegistered = ref(parent.series)

    const scrollbar = new XYChartScrollbar()
    const chart = parent.addFeature('xy-chart-scrollbar', XYChartScrollbar, scrollbar)

    if (Object.getOwnPropertyNames(seriesRegistered).includes(props.series)) {
      const s = seriesRegistered.value[props.series]
      scrollbar.series.push(s.instance)
      if (props.axis === 'x') {
        chart.value.scrollbarX = scrollbar
      } else {
        chart.value.scrollbarY = scrollbar
      }
    }

    return { scrollbar, seriesRegistered }
  },
})
</script>

<style scoped></style>
