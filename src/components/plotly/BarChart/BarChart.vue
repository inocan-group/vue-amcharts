<template>
  <div ref="chartdiv"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, watch } from '@vue/composition-api'
import Plotly, { Root, PlotData, Layout } from 'plotly.js-dist'

export default defineComponent({
  props: {
    chartData: {
      type: Array as () => Partial<PlotData>[],
      required: true,
    },
  },
  setup(props) {
    const chartdiv = ref(null)
    const data = props.chartData

    const layout: Partial<Layout> = { barmode: 'group' }

    onMounted(() => {
      Plotly.newPlot((chartdiv.value as unknown) as Root, data, layout)

      watch(
        () => props.chartData,
        newData => {
          Plotly.animate(
            (chartdiv.value as unknown) as Root,
            {
              data: newData,
            },
            {
              transition: {
                duration: 300,
                easing: 'cubic-in-out',
              },
              frame: {
                duration: 300,
              },
            },
          )
        },
      )
    })

    onBeforeUnmount(() => {
      Plotly.purge((chartdiv.value as unknown) as Root)
    })

    return { chartdiv }
  },
})
</script>
