<template>
  <div class="candlestick-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { CandlestickSeries } from '@amcharts/amcharts4/charts'
import { useSeries, seriesProps, useRegistry, useProps, useData, dataProperties } from '../composables'
import { IDictionary } from 'common-types'
import { IChart, ChartType } from '..'
import { color } from '@amcharts/amcharts4/core'
import { removeProperties } from '../shared'
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
    props = { dataIdProp: props.dateProp, ...props }
    const { register, onChartConfig } = useRegistry(props, context)
    useSeries(props, context)

    const { onPropChange, respondTo, initializeProps } = useProps(props)
    const series: Ref<CandlestickSeries> = ref(new CandlestickSeries())
    series.value.dataFields = {
      dateX: props.dateProp,
      valueY: props.closingProp,
      openValueY: props.openningProp,
      lowValueY: props.lowProp,
      highValueY: props.highProp,
    }
    const { postDataChange, dataMeta } = useData(props, series, {
      id: 'date',
      dataProps: ['price'],
      labelProps: ['date'],
    })

    register(ChartType.series, props.id, { instance: series })

    postDataChange(() => {
      console.log('candlestick post data change')
    })
    series.value.invalidateData

    const actionConfig = {
      name: series.value,
      tooltipText: series.value,
      show: () => {
        if (props.show) {
          series.value.show()
          series.value.invalidate()
        } else {
          series.value.hide()
          series.value.invalidate()
        }
      },
      stroke: () => {
        if (props.stroke !== undefined) {
          series.value.stroke = color(props.stroke)
          series.value.invalidate()
        }
      },
      fill: () => {
        series.value.fill = color(props.fill)
        series.value.invalidate()
      },
      strokeWidth: series.value,
      dateProp: series.value,
      openningProp: series.value,
      closingProp: series.value,
      lowProp: series.value,
      highProp: series.value,
    }

    onPropChange((prop, value) => {
      respondTo(prop, value, actionConfig)
    })

    onChartConfig((chart: IChart) => {
      // axisConfig.value = setupAxes(series)
      series.value = chart.series.push(series.value)
      initializeProps(actionConfig)

      if (props.tooltipText) {
        console.warn(
          `You have configured tooltip text for the ${props.name} LineSeries component but there is no Cursor on this chart so it will not be displayed!`,
        )
      }
    })

    return { instance: series, dataMeta }
  },
})
</script>

<style scoped>
.candlestick-series {
  opacity: 1;
}
</style>
