<template>
  <div ref="chartdiv"><slot /></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, Ref, watch, provide } from '@vue/composition-api'
import Plotly, { Root, PlotData, Layout } from 'plotly.js-dist'
import { plotDataSymbol } from '@/shared/plotly'

export default defineComponent({
  props: {
    layout: Object as () => Partial<Layout>,
  },
  setup(props) {
    const chartdiv = ref(null)
    const plotData: Ref<(Partial<PlotData> & { id: number })[]> = ref([])

    provide(plotDataSymbol, plotData)

    onMounted(() => {
      Plotly.newPlot((chartdiv.value as unknown) as Root, plotData.value, props.layout)

      // Re-layout if layout changes
      watch(
        () => props.layout,
        newLayout => {
          Plotly.react((chartdiv.value as unknown) as Root, plotData.value, newLayout)
        },
        { lazy: true },
      )

      // Animates animatable charts if trace data changes. For non-animatable charts it just reacts instantaneously.
      watch(
        plotData,
        newPlotData => {
          Plotly.animate(
            (chartdiv.value as unknown) as Root,
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
      Plotly.purge((chartdiv.value as unknown) as Root)
    })

    return { chartdiv }
  },
})
</script>
