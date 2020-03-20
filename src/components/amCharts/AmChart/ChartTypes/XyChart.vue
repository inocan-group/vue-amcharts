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
import { defineComponent, onMounted, onBeforeUnmount, SetupContext } from '@vue/composition-api'
import { useChart, useRegistry, useProps, IActionConfiguration, useData, dataProperties } from '../composables'
import { IDictionary } from 'common-types'
import { unbox } from '../shared'

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
    const { registerAsParent } = useRegistry<XYChart>(props, context)
    const { onPropChange, respondTo } = useProps(props)
    const { chart, chartdiv, drawChart } = useChart<XYChart>('xy-chart', XYChart, props)
    const { registrants, acceptChildRegistration, acceptChildMessage, configureChildren } = registerAsParent([
      [1, null, 'xAxis'],
      [1, null, 'yAxis'],
      [1, null, 'series'],
      [0, 1, 'cursor'],
      [0, 1, 'legend'],
      [0, null, 'features'],
    ])

    console.log({ acceptChildRegistration, acceptChildMessage })

    // const { postDataChange } = useData(props, chart, { id: 'date', dataProps: ['price'], labelProps: ['date'] })

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
      drawChart()
      const c = chart.value as XYChart
      c.height = 800
      c.contentHeight = 800

      if (typeof props.data === 'string') {
        console.log('url is', props.data)

        c.dataSource.url = props.data
      } else {
        const d = unbox(props.data)
        if (d !== undefined) c.data = d
      }

      c.responsive.enabled = props.responsive
      console.log('deferring to children')

      await configureChildren(c)
    })

    onBeforeUnmount(() => {
      if (chart.value) chart.value.dispose()
    })

    return {
      chart,
      chartdiv,
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
