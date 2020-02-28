<template>
  <div class="chart" ref="chartdiv"></div>
</template>

<script lang="ts">
import * as am4core from '@amcharts/amcharts4/core'
import * as am4plugins from '@amcharts/amcharts4/plugins/sunburst'
import { defineComponent, onMounted, ref, onBeforeUnmount } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const chartdiv = ref(null)
    const data = [
      {
        name: 'First',
        children: [
          { name: 'A1', value: 100 },
          { name: 'A2', value: 60 },
        ],
      },
      {
        name: 'Second',
        children: [
          { name: 'B1', value: 135 },
          { name: 'B2', value: 98 },
        ],
      },
      {
        name: 'Third',
        children: [
          {
            name: 'C1',
            children: [
              { name: 'EE1', value: 130 },
              { name: 'EE2', value: 87 },
              { name: 'EE3', value: 55 },
            ],
          },
          { name: 'C2', value: 148 },
          {
            name: 'C3',
            children: [
              { name: 'CC1', value: 53 },
              { name: 'CC2', value: 30 },
            ],
          },
          { name: 'C4', value: 26 },
        ],
      },
      {
        name: 'Fourth',
        children: [
          { name: 'D1', value: 415 },
          { name: 'D2', value: 148 },
          { name: 'D3', value: 89 },
        ],
      },
      {
        name: 'Fifth',
        children: [
          {
            name: 'E1',
            children: [
              { name: 'EE1', value: 33 },
              { name: 'EE2', value: 40 },
              { name: 'EE3', value: 89 },
            ],
          },
          {
            name: 'E2',
            value: 148,
          },
        ],
      },
    ]
    let chart: am4plugins.Sunburst | undefined = undefined

    onMounted(() => {
      // Create chart instance
      chart = am4core.create((chartdiv.value as unknown) as HTMLElement, am4plugins.Sunburst)

      chart.radius = am4core.percent(100)

      // Make colors more distinctive
      chart.colors.step = 2

      // Add multi-level data
      chart.data = data
      // Define data fields
      chart.dataFields.value = 'value'
      chart.dataFields.name = 'name'
      chart.dataFields.children = 'children'
    })

    onBeforeUnmount(() => {
      if (chart) {
        chart.dispose()
      }
    })

    return { chartdiv }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart {
  width: 100%;
  height: 800px;
}
</style>
