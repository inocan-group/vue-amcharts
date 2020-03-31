<template>
  <div class="slice-chart" style="width: 100%; min-height: 500px">
    <div class="chart" ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import * as am4core from '@amcharts/amcharts4/core'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import { defineComponent, SetupContext } from '@vue/composition-api'
import { useChart } from '../composables'
import { IDictionary } from 'common-types'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { dataProperties } from '../composables/useData'
import { SlicedChart } from '@amcharts/amcharts4/charts'

am4core.useTheme(am4themesAnimated)

export default defineComponent({
  name: 'SliceChart',
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
  },

  setup(props: IDictionary, context: SetupContext): IDictionary {
    const parentConfig: IChildWithCardinality[] = [
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
    } = useChart(SlicedChart, props, context, parentConfig)

    actionsConfig(c => ({
      responsive: c,
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
.slice-chart {
  opacity: 1;
}
</style>
