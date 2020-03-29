<template>
  <div ref="chartdiv">
    <!-- @slot The default slot accepts any _series_ component (e.g. `PlotlyBarSeries`, `PlotlyPieSeries`, etc - which define data), in addition to
    other components that define chart elements such as a legend and axes. -->
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, watch } from '@vue/composition-api'
import Plotly, { Root, Layout } from 'plotly.js-dist'
import { IPlotData } from '@/@types/plotly'

/**
 * The container component responsible for creating a **plotly** chart and defining layout and other
 * configuration options on the chart.
 */
export default defineComponent({
  props: {
    /**
     * An object containing any layout options. For a complete reference please refer to **plotly**'s documentation
     * on [layout](https://plotly.com/javascript/reference/#layout).
     */
    layout: { type: Object as () => Partial<Layout> },
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
