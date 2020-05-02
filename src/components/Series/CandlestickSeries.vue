<template>
  <div class="candlestick-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { CandlestickSeries } from '@amcharts/amcharts4/charts'
import { useSeries, seriesProps } from '../composables'
import { IDictionary } from 'common-types'
import { ChartType } from '..'
import { color } from '@amcharts/amcharts4/core'
import { removeProperties } from '../shared'
import { dataProperties } from '../composables/useData'
export default defineComponent({
  name: 'CandlestickSeries',
  props: {
    ...removeProperties(seriesProps, 'xProp', 'yProp'),
    ...removeProperties(dataProperties, 'dataIdProp'),
    /** property in dataset which has openning price */
    openningProp: {
      type: String,
      required: true,
    },
    /** property in dataset which has closing price */
    closingProp: {
      type: String,
      required: true,
    },
    /** property in dataset which has low price for day */
    lowProp: {
      type: String,
      required: true,
    },
    /** property in dataset which has high price for day */
    highProp: {
      type: String,
      required: true,
    },
    /** property in dataset which has day of trading activity */
    dateProp: {
      type: String,
      required: true,
    },
    /**
     * Use "professional candlesticks" which have a particular styling to them.
     * For more see [docs](https://www.amcharts.com/docs/v4/tutorials/taming-candlestick-series/#Professional_candlesticks).
     */
    professional: {
      type: [String, Boolean],
      default: false,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    props.dataIdProp = props.dateProp
    const series: Ref<CandlestickSeries> = ref(new CandlestickSeries())
    const {
      register,
      chartData,
      onChartConfig,
      dataReady,
      dataMeta,
      postDataChange,
      postUrlChange,
      setupAxes,
      addToRegistration,
      actionsConfig,
      childReady,
      initializeProps,
    } = useSeries(props, context, series)
    const axisConfig: Ref<IDictionary> = ref({})
    register(ChartType.series, props.id, CandlestickSeries, series)

    dataReady(series, {
      id: 'date',
      dataProps: ['price'],
      labelProps: ['date'],
    })

    series.value.dataFields = {
      dateX: props.dateProp,
      valueY: props.closingProp,
      openValueY: props.openningProp,
      lowValueY: props.lowProp,
      highValueY: props.highProp,
    }

    postDataChange(() => {
      console.log('candlestick post data', {
        data: series.value.data,
        dp: series.value.dataProvider,
        source: series.value.dataSource,
        sets: series.value.dataSets,
      })

      series.value.dataProvider = series.value
      series.value.invalidateData()
      console.log('candlestick post data change', {
        provider: series.value.dataProvider,
        source: series.value.dataSource,
        data: series.value.data,
      })
    })

    postUrlChange(() => {
      console.log('candlestick post url change')
    })

    actionsConfig(s => ({
      name: s,
      tooltipText: s,
      show: () => {
        if (props.show) {
          s.show()
          s.invalidate()
        } else {
          s.hide()
          s.invalidate()
        }
      },
      stroke: () => {
        if (props.stroke !== undefined) {
          s.stroke = color(props.stroke)
          s.invalidate()
        }
      },
      fill: () => {
        s.fill = color(props.fill)
        s.invalidate()
      },
      strokeWidth: s,
      dateProp: s,
      openningProp: s,
      closingProp: s,
      lowProp: s,
      highProp: s,
    }))

    onChartConfig(chart => {
      console.log('candlestick config started')
      initializeProps()
      chart.series.push(series.value)
      axisConfig.value = setupAxes(series)

      if (props.tooltipText) {
        console.warn(
          `You have configured tooltip text for the ${props.name} LineSeries component but there is no Cursor on this chart so it will not be displayed!`,
        )
      }

      addToRegistration('data', series.value.data)
    })

    childReady()

    return { series, dataMeta, chartData, axisConfig }
  },
})
</script>

<style scoped>
.candlestick-series {
  opacity: 1;
}
</style>
