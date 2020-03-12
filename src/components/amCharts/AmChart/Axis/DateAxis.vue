<template>
  <div class="date-axis" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useAxis, useRegistry } from '../composables'
import { IChartChildApi, AxisDimension, IChart } from '../ChartTypes'
import { DateAxis } from '@amcharts/amcharts4/charts'
import { ChartType } from '..'

export default defineComponent({
  name: 'DateAxis',
  props: {
    name: {
      type: String,
      default: 'dates',
    },
    dimension: {
      type: String,
      default: 'x',
    },
  },

  setup(props, context) {
    const { register } = useRegistry<DateAxis>(props, context)
    const instance = new DateAxis()

    const configure = async (chart: IChart) => {
      const axis = props.dimension === 'x' ? chart.xAxes : chart.yAxes
      console.log(`registering DateAxis on ${props.dimension}`, { chart, axis })
      axis.push(instance)
    }

    props.dimension === 'x'
      ? register(ChartType.xAxis, props.name, configure)
      : register(ChartType.yAxis, props.name, configure)

    return { DateAxis, axis: instance }
  },
})
</script>

<style scoped>
.date-axis {
  opacity: 1;
}
</style>
