<template>
  <div class="line-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { LineSeries, ValueAxis, Axis, ILineSeriesDataFields } from '@amcharts/amcharts4/charts'
import { useSeries, useRegistry } from '../composables'
import { IChart } from '..'
import { ChartType } from '../types'
import { IDictionary } from 'common-types'

export default defineComponent({
  name: 'LineSeries',

  props: {
    id: {
      type: String,
      default: 'default',
    },
    name: {
      type: String,
      default: '',
    },
    xProp: {
      type: String,
      default: '',
    },
    xAxis: {
      type: String,
      default: undefined,
    },
    yProp: {
      type: String,
      default: undefined,
      required: true,
    },
    yAxis: {
      type: String,
      default: undefined,
    },
    /** the text of the tooltip, which can include { variable } names too */
    tooltipText: {
      type: String,
      default: '',
    },
    /** the width of the line */
    strokeWidth: {
      type: [Number, String],
      default: 1,
    },
  },

  setup(props, context) {
    const { register, getComponent, getRegistration, addToRegistration } = useRegistry(props, context, LineSeries)
    const { setupAxes } = useSeries(props, context)
    const series: Ref<LineSeries> = ref(new LineSeries())
    const axisConfig: Ref<IDictionary> = ref({})

    const configure = async (chart: IChart) => {
      axisConfig.value = setupAxes(series)
      // const axisY: Axis = getComponent('yAxis', props.yAxis)
      // const dataFieldY: string = getRegistration('yAxis', props.yAxis).dataField

      // series.value.dataFields.dateX = props.xProp

      // if (props.yAxis) series.value.yAxis = axisY

      // yAxisUid.value = axisY.uid
      // addToRegistration('yAxis', axisY.uid)
      // console.log(`The ValueAxis "${props.id}" has yAxis of ${axisY.uid}, uses prop ${props.yProp}`)
      // // get named xAxis or first defined xAxis
      // const axisX = getComponent('xAxis', props.xAxis)

      // // series.value.xAxis = (axis as unknown) as Axis<any>
      // // xAxis.value = axis.uid
      // addToRegistration('xAxis', axisX.uid)
      // console.log(`The ValueAxis "${props.id}" has xAxis of ${axisX.uid}, uses prop ${props.xProp}`)

      series.value = chart.series.push(series.value)
      series.value.name = props.name
      series.value.strokeWidth = Number(props.strokeWidth)
      // series.value.dataFields.valueY = props.yProp
      // series.value.dataFields.dateX = props.xProp
      series.value.tooltipText = props.tooltipText
      if (props.tooltipText && !getRegistration('cursor')) {
        console.warn(
          `You have some tooltip text for the ${props.name} LineSeries component but there is no Cursor on this chart so it will not be displayed!`,
        )
      }
    }

    register(ChartType.series, props.id, configure, { instance: series })

    return { LineSeries, series, axisConfig }
  },
})
</script>

<style scoped>
.line-series {
  opacity: 1;
}
</style>
