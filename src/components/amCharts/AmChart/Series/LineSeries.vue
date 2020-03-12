<template>
  <div class="line-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { LineSeries } from '@amcharts/amcharts4/charts'
import { useSeries, useRegistry } from '../composables'
import { IChart } from '..'
import { ChartType } from '../types'

export default defineComponent({
  name: 'LineSeries',

  props: {
    name: {
      type: String,
      default: 'default',
    },
    xProp: {
      type: String,
      default: '',
    },
    xAxis: {
      type: String,
      default: 'default',
    },
    yProp: {
      type: String,
      default: '',
    },
    yAxis: {
      type: String,
      default: 'default',
    },
  },

  setup(props, context) {
    const { register } = useRegistry(props, context, LineSeries)
    const instance = new LineSeries()

    const configure = async (chart: IChart) => {
      console.log('series', chart.series.dataFields, props.xProp, props.yProp)
      chart.series.push(new LineSeries())
      chart.series.dataFields.dateX = props.xProp
      chart.series.dataFields.valueY = props.yProp
    }

    register(ChartType.series, props.name, configure)

    return { LineSeries, series: instance }
  },
})
</script>

<style scoped>
.line-series {
  opacity: 1;
}
</style>
