<template>
  <div class="pie-chart">
    <div class="chart" ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, onMounted } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { useProps, useChart, IActionConfiguration } from '../composables'
import { PieChart } from '@amcharts/amcharts4/charts'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { dataProperties } from '../composables/useData'
import { percent } from '@amcharts/amcharts4/core'

export default defineComponent({
  name: 'PieChart',
  props: {
    ...dataProperties,
    innerRadius: {
      type: [String, Number],
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const { onPropChange, respondTo } = useProps(props)
    const parentConfig: IChildWithCardinality[] = [
      [1, null, 'series'],
      [0, 1, 'legend'],
      [0, null, 'features'],
    ]
    const {
      chart,
      chartIsReady,
      chartdiv,
      acceptChildMessage,
      acceptChildRegistration,
      registrants,
      dataMeta,
      chartData,
    } = useChart(PieChart, props, context, parentConfig)

    onMounted(async () => {
      const c = chart.value as PieChart
      // c.height = 800
      // c.contentHeight = 800
      c.responsive.enabled = props.responsive
    })

    const actionsConfig: IActionConfiguration = () => {
      if (chartIsReady(chart)) {
        return {
          responsive: chart,
          innerRadius: () => {
            if (typeof props.innerRadius === 'string') {
              chart.value.innerRadius =
                props.innerRadius.slice(-1) === '%'
                  ? percent(Number(props.innerRadius.replace('%', '')))
                  : Number(props.innerRadius.replace(/\s*px/, ''))
            } else {
              chart.value.innerRadius = props.innerRadius
            }
            chart.value.invalidateData()
          },
        }
      } else {
        return {}
      }
    }

    onPropChange((prop, value, old) => {
      respondTo(prop, value, actionsConfig(prop, value, old))
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

<style scoped></style>
