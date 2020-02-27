<template>
  <div ref="chartdiv"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from '@vue/composition-api'
import Plotly from 'plotly.js-dist'

export default defineComponent({
  setup() {
    const chartdiv = ref(null)
    const trace1 = {
      x: ['giraffes', 'orangutans', 'monkeys'],
      y: [20, 14, 23],
      name: 'SF Zoo',
      type: 'bar',
    }
    const trace2 = {
      x: ['giraffes', 'orangutans', 'monkeys'],
      y: [12, 18, 29],
      name: 'LA Zoo',
      type: 'bar',
    }

    const data = [trace1, trace2]

    const layout = { barmode: 'group' }

    onMounted(() => {
      Plotly.newPlot(chartdiv.value, data, layout)
    })

    onBeforeUnmount(() => {
      Plotly.purge(chartdiv.value)
    })

    return { chartdiv }
  },
})
</script>
