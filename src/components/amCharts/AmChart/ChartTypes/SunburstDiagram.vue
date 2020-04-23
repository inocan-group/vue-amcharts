<template>
  <div class="sunburst-diagram">
    <div class="chart" ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import * as am4core from '@amcharts/amcharts4/core'
import { Sunburst } from '@amcharts/amcharts4/plugins/sunburst'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import { defineComponent, SetupContext } from '@vue/composition-api'
import { useChart } from '../composables'
import { IDictionary } from 'common-types'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { dataProperties } from '../composables/useData'

am4core.useTheme(am4themesAnimated)

export default defineComponent({
  props: {
    ...dataProperties,
    name: { type: String, required: true },
    value: { type: String, required: true },
    children: { type: String, required: true },
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
      onChartMounted,
    } = useChart(Sunburst, props, context, parentConfig)

    actionsConfig(sb => ({
      name: [sb, 'dataFields.name'],
      value: [sb, 'dataFields.value'],
      children: [sb, 'dataFields.children'],
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
.sunburst-diagram {
  width: 100%;
  height: 800px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
