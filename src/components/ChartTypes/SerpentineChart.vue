<template>
  <div class="serpentine-chart">
    <div class="chart" ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import { useTheme } from '@amcharts/amcharts4/core'
import { SerpentineChart } from '@amcharts/amcharts4/plugins/timeline'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import { defineComponent, SetupContext } from '@vue/composition-api'
import { useChart } from '../composables'
import { IDictionary } from 'common-types'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { dataProperties } from '../composables/useData'

useTheme(am4themesAnimated)

export default defineComponent({
  props: {
    ...dataProperties,

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
    orientation: {
      type: String,
      default: 'vertical',
    },
    levelCount: {
      type: Number,
      default: 3,
    },
    initialize: {
      type: Function,
    },
  },

  setup(props: IDictionary, context: SetupContext): IDictionary {
    const parentConfig: IChildWithCardinality[] = [
      [1, null, 'xAxis'],
      [1, null, 'yAxis'],
      [1, null, 'series'],
      [0, 1, 'cursor'],
      [0, 1, 'legend'],
      [0, null, 'features'],
    ]
    const {
      chart,
      chartdiv,
      acceptChildMessage,
      acceptChildRegistration,
      registrants,
      dataMeta,
      chartData,
      actionsConfig,
      onChartMounted,
    } = useChart(SerpentineChart, props, context, parentConfig)

    actionsConfig(c => ({
      orientation: [c, v => v, () => c.invalidateData()],
      levelCount: [c, v => v, () => c.invalidateData()],
    }))

    onChartMounted(() => {
      const c = chart.value as SerpentineChart
      c.height = 800
      c.contentHeight = 800
      c.responsive.enabled = props.responsive
    })

    return {
      chart,
      chartdiv,
      chartData,
      dataMeta,
      registrants,
      acceptChildRegistration,
      acceptChildMessage,
    }
  },
})
</script>

<style scoped>
.serpentine-chart {
  width: 100%;
  height: 800px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
