<template>
  <div class="venn-diagram">
    <div class="chart" ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import { useTheme } from '@amcharts/amcharts4/core'
import { VennDiagram } from '@amcharts/amcharts4/plugins/venn'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import { defineComponent, SetupContext } from '@vue/composition-api'
import { useChart } from '../composables'
import { IDictionary } from 'common-types'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { removeProperties } from '../shared'
import { dataProperties } from '../composables/useData'

useTheme(am4themesAnimated)

export default defineComponent({
  props: {
    ...removeProperties(dataProperties, 'dataIdProp', 'dataProperties'),
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
      actionsConfig,
      onChartMounted,
    } = useChart(VennDiagram, props, context, parentConfig)

    actionsConfig(vd => ({}))

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
.venn-diagram {
  width: 100%;
  height: 800px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
