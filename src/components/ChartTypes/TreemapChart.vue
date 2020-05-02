<template>
  <div class="treemap-chart">
    <div class="chart" ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import { TreeMap } from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import { useTheme } from '@amcharts/amcharts4/core'
import { defineComponent, SetupContext } from '@vue/composition-api'
import { useChart } from '../composables'
import { IDictionary } from 'common-types'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { dataProperties } from '../composables/useData'

useTheme(am4themesAnimated)

type ILayoutAlgo = 'squarify' | 'binaryTree' | 'dice' | 'slice' | 'sliceDice'

export default defineComponent({
  props: {
    ...dataProperties,
    name: { type: String, required: true },
    value: { type: String, required: true },
    children: { type: String },
    color: { type: String },
    colorsStep: { type: Number, default: 1 },
    maxLevels: { type: Number, default: 2 },
    layoutAlgorithm: { type: String, default: 'squarify' },
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
      actionsConfig,
    } = useChart(TreeMap, props, context, parentConfig)

    actionsConfig(tm => ({
      name: [tm, 'dataFields.name'],
      value: [tm, 'dataFields.value'],
      children: [tm, 'dataFields.children'],
      color: [tm, 'dataFields.color'],
      colorsStep: [tm, 'colors.step', v => v, () => tm.invalidateData()],
      maxLevels: [tm, v => v, () => tm.invalidateData()],
      layoutAlgorithm: [tm, (v: ILayoutAlgo) => tm[v], () => tm.invalidateData()],
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
.treemap-chart {
  width: 100%;
  height: 800px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
