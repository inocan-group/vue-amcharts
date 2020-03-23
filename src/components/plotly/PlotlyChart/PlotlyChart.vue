<template>
  <div ref="chartdiv"><slot /></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, watch } from '@vue/composition-api'
import Plotly, { Root, Layout } from 'plotly.js-dist'
import { IPlotData } from '@/@types/plotly'

export default defineComponent({
  props: {
    layout: Object as () => Partial<Layout>,
  },
  setup(props) {
    const chartdiv = ref<HTMLElement>(null)
    const plotData = ref<IPlotData[]>([])

    onMounted(() => {
      Plotly.newPlot(chartdiv.value as Root, plotData.value, props.layout)

      // Re-layout if layout changes
      watch(
        () => props.layout,
        newLayout => {
          Plotly.react(chartdiv.value as Root, plotData.value, newLayout)
        },
        { lazy: true },
      )

      // Animates animatable charts if series data changes. For non-animatable charts it just reacts instantaneously.
      watch(
        plotData,
        newPlotData => {
          Plotly.animate(
            chartdiv.value as Root,
            {
              data: newPlotData,
            },
            // TODO: make transition options configurable through props
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
        { lazy: true },
      )
    })

    onBeforeUnmount(() => {
      Plotly.purge(chartdiv.value as Root)
    })

    return { chartdiv, plotData }
  },
})
</script>
