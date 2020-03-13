<template>
  <div class="date-axis" />
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { useAxis, useRegistry } from '../composables'
import { IChartChildApi, AxisDimension, IChart } from '../ChartTypes'
import { DateAxis } from '@amcharts/amcharts4/charts'
import { ChartType } from '..'
import { Configuration } from '../composables/useRegistry/registry-types'

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
    const { register } = useRegistry(props, context, DateAxis)
    const axis: Ref<DateAxis> = ref(new DateAxis())

    const configure: Configuration<IChart> = async chart => {
      const dimension = props.dimension === 'x' ? chart.xAxes : chart.yAxes
      dimension.push(axis.value)
    }

    props.dimension === 'x'
      ? register(ChartType.xAxis, props.name, configure, { instance: axis.value })
      : register(ChartType.yAxis, props.name, configure, { instance: axis.value })

    return { DateAxis, axis }
  },
})
</script>

<style scoped>
.date-axis {
  opacity: 1;
}
</style>
