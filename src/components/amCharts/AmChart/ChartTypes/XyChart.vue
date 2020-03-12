<template>
  <div class="xy-chart">
    <div ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import * as am4core from '@amcharts/amcharts4/core'
import { XYChart } from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import { defineComponent, ref, Ref, reactive, onMounted, computed, isRef } from '@vue/composition-api'
import { useChart } from '../composables/useChart'
import { IDictionary } from 'common-types'
import { IAxisDefinition, ISeriesDefinition, ILegendDefinition, IChartChildApi, IXyChartSlotProps } from '../ChartTypes'

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

  setup(props, context): IChartChildApi<XYChart> & IXyChartSlotProps & IDictionary {
    const {
      chart,
      chartData,
      chartdiv,
      configAxis,
      configSeries,
      configLegend,
      drawChart,
      addFeature,
      features,
    } = useChart<XYChart>('xy-chart', XYChart, props)

    /**
     * the _named_ **xAxis**'s which have been registered with the XY Chart.
     */
    const xAxis: IDictionary<IAxisDefinition<any>> = reactive({})
    /**
     * the _named_ **yAxis**'s which have been registered with the XY Chart.
     */
    const yAxis: IDictionary<IAxisDefinition<any>> = reactive({})
    /**
     * A _named_ dictionary of data series
     */
    const series: IDictionary<ISeriesDefinition<any>> = reactive({})

    const legend: ILegendDefinition = reactive({})

    /** allows _axis_ components to register themselves to a chart */
    const addAxis = configAxis({ x: xAxis, y: yAxis }, { xMin: 1, xMax: 10, yMin: 1, yMax: 10 })
    /** allows _series_ components to register themselves to a chart */
    const addSeries = configSeries(series, { min: 1, max: 100 })
    /** allows a _legend_ component to register themselves to a chart */
    const addLegend = configLegend(legend)

    onMounted(() => {
      drawChart()
      const c = chart.value as XYChart
      if (typeof props.data === 'string') {
        c.dataSource.url = props.data
      } else {
        c.data = props.data as IDictionary[]
      }

      Object.keys(xAxis).forEach(name => {
        const instance = new xAxis[name].constructor()
        c.xAxes.push(instance)
        xAxis[name].instance = ref(instance)
        const cb = xAxis[name].callback
        if (cb) {
          cb(instance)
        }
      })

      Object.keys(yAxis).forEach(name => {
        const instance = new yAxis[name].constructor()
        c.yAxes.push(instance) // push to chart
        yAxis[name].instance = ref(instance) // make instance referencable to
        const cb = yAxis[name].callback
        if (cb) {
          cb(instance)
        }
      })

      Object.keys(series).forEach(name => {
        const info = series[name]
        const instance = new info.constructor()
        c.series.push(instance) // push to chart
        info.instance = ref(instance) // make instance referencable to
        const cb = info.callback
        if (cb) {
          cb(instance)
        }
        instance.dataFields.dateX = info.options.xProp
        instance.dataFields.valueY = info.options.yProp
      })
    })

    return {
      chart,
      chartData,
      chartdiv,
      addAxis,
      addSeries,
      addLegend,
      addFeature,
      features,
      xAxis,
      yAxis,
      series,
      legend,
    }
  },
})
</script>

<style scoped></style>
