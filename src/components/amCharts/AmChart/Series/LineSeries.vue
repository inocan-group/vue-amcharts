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
    const series: Ref<LineSeries | null> = ref(null)

    const configure = async (chart: IChart) => {
      series.value = chart.series.push(new LineSeries())
      if (series.value) {
        series.value.dataFields.valueY = props.yProp
        series.value.dataFields.dateX = props.xProp
      }
    }

    register(ChartType.series, props.name, configure)

    return { LineSeries }
  },
})
</script>

<style scoped>
.line-series {
  opacity: 1;
}
</style>
