<template>
  <div class="fdt-chart">
    <div class="chart" ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import { useTheme } from '@amcharts/amcharts4/core'
import { ForceDirectedTree } from '@amcharts/amcharts4/plugins/forceDirected'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import { defineComponent, SetupContext } from 'vue'
import { useChart } from '../composables'
import { IDictionary } from 'common-types'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { dataProperties } from '../composables/useData'

useTheme(am4themesAnimated)

export default defineComponent({
  name: 'ForceDirectedTree',
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
    initialize: {
      type: Function,
    },
  },

  setup(props: IDictionary, context: SetupContext): IDictionary {
    const parentConfig: IChildWithCardinality[] = [
      [1, null, 'series'],
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
      onChartMounted,
      actionsConfig,
    } = useChart(ForceDirectedTree, props, context, parentConfig)

    actionsConfig(c => ({
      responsive: c,
    }))

    onChartMounted(c => {
      c.height = 800
      c.contentHeight = 800
      // c.responsive.enabled = props.responsive
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
.fdt-chart {
  width: 100%;
  height: 800px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
