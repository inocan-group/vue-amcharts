<template>
  <div class="pie-chart" style="width: 100%; height: 100%">
    <div class="chart" ref="chartdiv" style="width: 100%; height: 100%" />
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from 'vue'
import { IDictionary } from 'common-types'
import { useChart, chartProperties } from '../composables'
import { PieChart } from '@amcharts/amcharts4/charts'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { dataProperties } from '../composables/useData'
import { percent } from '@amcharts/amcharts4/core'

export default defineComponent({
  name: 'PieChart',
  props: {
    ...dataProperties,
    ...chartProperties,
    innerRadius: {
      type: [String, Number],
      default: 0,
    },
    initialize: {
      type: Function,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
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
    } = useChart(PieChart, props, context, parentConfig)

    actionsConfig(c => ({
      innerRadius: () => {
        if (typeof props.innerRadius === 'string') {
          c.innerRadius =
            props.innerRadius.slice(-1) === '%'
              ? percent(Number(props.innerRadius.replace('%', '')))
              : Number(props.innerRadius.replace(/\s*px/, ''))
        } else {
          c.innerRadius = props.innerRadius
        }
        c.invalidateData()
      },
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

<style scoped></style>
