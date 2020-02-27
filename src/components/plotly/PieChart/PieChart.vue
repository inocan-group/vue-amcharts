<template>
  <div ref="chartdiv"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from '@vue/composition-api'
import Plotly from 'plotly.js-dist'

export default defineComponent({
  setup() {
    const chartdiv = ref(null)
    const data = [
      {
        values: [19, 26, 55],
        labels: ['Residential', 'Non-Residential', 'Utility'],
        type: 'pie',
      },
    ]
    const layout = {
      height: 400,
      width: 500,
    }

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
