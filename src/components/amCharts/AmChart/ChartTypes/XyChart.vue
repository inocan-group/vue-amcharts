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
import { defineComponent, onMounted, SetupContext } from '@vue/composition-api'
import { useChart, useProps, IActionConfiguration } from '../composables'
import { IDictionary } from 'common-types'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { dataProperties } from '../composables/useData'

am4core.useTheme(am4themesAnimated)

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
  },

  setup(props: IDictionary, context: SetupContext): IDictionary {
    const { onPropChange, respondTo } = useProps(props)
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
      postDataChange,
    } = useChart(XYChart, props, context, parentConfig)

    postDataChange(() => {
      console.log(`XY Chart has data loaded`, props.data)
    })

    const actionsConfig: IActionConfiguration = () => {
      if (chart.value) {
        return {
          responsive: chart,
        }
      } else {
        return {}
      }
    }

    // postDataChange((current: unknown) => {
    //   console.log('back from data change:', current, chart.value.data)
    // })

    onPropChange((prop, value, old) => {
      respondTo(prop, value, actionsConfig(prop, value, old))
    })

    onMounted(async () => {
      const c = chart.value as XYChart
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
.xy-chart {
  width: 100%;
  height: 800px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
