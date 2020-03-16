<template>
  <div class="xy-chart">
    <div class="chart" ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import * as am4core from '@amcharts/amcharts4/core'
import { XYChart } from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import { defineComponent, onMounted, onBeforeUnmount } from '@vue/composition-api'
import { useChart, useRegistry } from '../composables'
import { IDictionary } from 'common-types'

am4core.useTheme(am4themesAnimated)

export default defineComponent({
  props: {
    data: {
      type: [String, Array],
      default: [],
    },
    license: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'animated',
    },
    responsive: {
      type: Boolean,
      default: Boolean(false),
    },
  },

  setup(props, context): IDictionary {
    const { registerAsParent } = useRegistry<XYChart>(props, context)
    const { chart, chartData, chartdiv, drawChart } = useChart<XYChart>('xy-chart', XYChart, props)

    const { registrants, acceptChildRegistration, acceptChildMessage, configureChildren } = registerAsParent([
      [1, null, 'xAxis'],
      [1, null, 'yAxis'],
      [1, null, 'series'],
      [0, 1, 'cursor'],
      [0, 1, 'legend'],
      [0, null, 'features'],
    ])

    onMounted(async () => {
      drawChart()
      const c = chart.value as XYChart
      c.height = 800
      c.contentHeight = 800

      if (typeof props.data === 'string') {
        c.dataSource.url = props.data
      } else {
        c.data = props.data as IDictionary[]
      }

      c.responsive.enabled = props.responsive

      await configureChildren(c)
    })

    onBeforeUnmount(() => {
      if (chart.value) chart.value.dispose()
    })

    return {
      chart,
      chartData,
      chartdiv,
      registrants,
      acceptChildRegistration,
      acceptChildMessage,
    }
  },
})
</script>

<style scoped>
.xy-chart {
  width: 100%;
  height: 800px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
