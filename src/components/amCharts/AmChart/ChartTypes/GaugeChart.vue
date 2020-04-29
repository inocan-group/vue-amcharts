<template>
  <div class="gauge-chart">
    <div class="chart" ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import * as am4core from '@amcharts/amcharts4/core'
import { GaugeChart } from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import { defineComponent, SetupContext } from '@vue/composition-api'
import { useChart } from '../composables'
import { IDictionary } from 'common-types'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { toNumberOrPercent, toNumber } from '../helpers'

am4core.useTheme(am4themesAnimated)

export default defineComponent({
  props: {
    /**
     * Inner radius of the radar face.
     * This can either be in absolute pixel value, or relative percent.
     * If set in percent, it will be relative to radius. (outer radius)
     */
    innerRadius: {
      type: [String, Number],
      default: 0,
    },
    /**
     * Starting angle of the Radar face.
     */
    startAngle: {
      type: Number,
      default: 180,
    },
    /**
     * Ending angle of the Radar face.
     */
    endAngle: {
      type: Number,
      default: 360,
    },
  },

  setup(props: IDictionary, context: SetupContext): IDictionary {
    const parentConfig: IChildWithCardinality[] = [
      [1, null, 'xAxis'],
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
    } = useChart(GaugeChart, props, context, parentConfig)

    actionsConfig(gc => ({
      innerRadius: [gc, v => toNumberOrPercent(v)],
      startAngle: [gc, v => toNumber(v)],
      endAngle: [gc, v => toNumber(v)],
    }))

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
.gauge-chart {
  width: 100%;
  height: 800px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
