<template>
  <div ref="chartdiv"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from '@vue/composition-api'
import Plotly from 'plotly.js-dist'
import { Root, PlotData } from 'plotly.js'

export default defineComponent({
  setup() {
    const chartdiv = ref(null)

    const trace1: Partial<PlotData> & { textfont: object } = {
      x: [1, 2, 3, 4, 5],
      y: [1, 6, 3, 6, 1],
      mode: 'text+markers',
      type: 'scatter',
      name: 'Team A',
      text: ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'],
      textposition: 'top center',
      textfont: {
        family: 'Raleway, sans-serif',
      },
      marker: { size: 12 },
    }

    const trace2: Partial<PlotData> & { textfont: object } = {
      x: [1.5, 2.5, 3.5, 4.5, 5.5],
      y: [4, 1, 7, 1, 4],
      mode: 'text+markers',
      type: 'scatter',
      name: 'Team B',
      text: ['B-a', 'B-b', 'B-c', 'B-d', 'B-e'],
      textfont: {
        family: 'Times New Roman',
      },
      textposition: 'bottom center',
      marker: { size: 12 },
    }

    const data = [trace1, trace2]

    const layout = {
      xaxis: {
        range: [0.75, 5.25],
      },
      yaxis: {
        range: [0, 8],
      },
      legend: {
        y: 0.5,
        yref: 'paper',
        font: {
          family: 'Arial, sans-serif',
          size: 20,
          color: 'grey',
        },
      },
      title: 'Data Labels on the Plot',
    }

    onMounted(() => {
      Plotly.newPlot((chartdiv.value as unknown) as Root, data, layout)
    })

    onBeforeUnmount(() => {
      Plotly.purge((chartdiv.value as unknown) as Root)
    })

    return { chartdiv }
  },
})
</script>
