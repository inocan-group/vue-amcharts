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
import { defineComponent, ref, Ref, reactive, onMounted, computed, isRef } from '@vue/composition-api'
import { useChart, useRegistry } from '../composables'
import { IDictionary } from 'common-types'
import {
  IAxisDefinition,
  ISeriesDefinition,
  ILegendDefinition,
  IChartChildApi,
  IXyChartSlotProps,
  XyChart,
} from '../ChartTypes'

am4core.useTheme(am4themesAnimated)

export default defineComponent({
  props: {
    data: {
      type: [String, Array],
      default: [],
    },
    license: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'animated',
    },
  },

  setup(props, context): IDictionary {
    const { registerAsParent } = useRegistry<XYChart>(props, context)

    const {
      registrants,
      acceptChildRegistration,
      acceptChildMessage,
      depSequence,
      readyForChildren,
    } = registerAsParent([
      [1, null, 'xAxis'],
      [1, null, 'yAxis'],
      [1, null, 'series'],
      [0, 1, 'legend'],
      [0, null, 'features'],
    ])

    const {
      chart,
      chartData,
      chartdiv,
      drawChart,
      // configAxis,
      // configSeries,
      // configLegend,
      // addFeature,
      // features,
    } = useChart<XYChart>('xy-chart', XYChart, props)

    onMounted(() => {
      drawChart()
      const c = chart.value as XYChart
      c.height = 800
      c.contentHeight = 800
      readyForChildren(c)

      if (typeof props.data === 'string') {
        c.dataSource.url = props.data
      } else {
        c.data = props.data as IDictionary[]
      }

      // Object.keys(xAxis).forEach(name => {
      //   const instance = new xAxis[name].constructor()
      //   c.xAxes.push(instance)
      //   xAxis[name].instance = ref(instance)
      //   const cb = xAxis[name].callback
      //   if (cb) {
      //     cb(instance)
      //   }
      // })

      // Object.keys(yAxis).forEach(name => {
      //   const instance = new yAxis[name].constructor()
      //   c.yAxes.push(instance) // push to chart
      //   yAxis[name].instance = ref(instance) // make instance referencable to
      //   const cb = yAxis[name].callback
      //   if (cb) {
      //     cb(instance)
      //   }
      // })

      // Object.keys(series).forEach(name => {
      //   const info = series[name]
      //   const instance = new info.constructor()
      //   c.series.push(instance) // push to chart
      //   info.instance = ref(instance) // make instance referencable to
      //   const cb = info.callback
      //   if (cb) {
      //     cb(instance)
      //   }
      //   instance.dataFields.dateX = info.options.xProp
      //   instance.dataFields.valueY = info.options.yProp
      // })
    })

    return {
      chart,
      chartData,
      chartdiv,
      // addAxis,
      // addSeries,
      // addLegend,
      // addFeature,
      // features,
      // xAxis,
      // yAxis,
      // series,
      // legend,
      registrants,
      acceptChildRegistration,
      acceptChildMessage,
      depSequence,
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
