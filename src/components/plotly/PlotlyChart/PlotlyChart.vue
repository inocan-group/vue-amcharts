<template>
  <div ref="chartdiv"><slot /></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, watch, provide, PropType } from '@vue/composition-api'
import Plotly, { Root, PlotData, Layout } from 'plotly.js-dist'
import { plotDataSymbol } from '@/shared/plotly'

export default defineComponent({
  props: {
    layout: Object as PropType<Partial<Layout>>,
  },
  setup(props) {
    const chartdiv = ref<HTMLElement>(null)
    const plotData = ref<(Partial<PlotData> & { id?: number })[]>([])

    provide(plotDataSymbol, plotData)

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

      // Animates animatable charts if trace data changes. For non-animatable charts it just reacts instantaneously.
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

    return { chartdiv }
  },
})
</script>
