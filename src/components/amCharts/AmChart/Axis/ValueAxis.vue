<template>
  <div class="value-axis"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { IValueAxisProps } from './index'
import { useAxis, useRegistry } from '../composables'
import { IDictionary } from 'common-types'
import { AxisDimension, IChart } from '../ChartTypes'
import { ValueAxis } from '@amcharts/amcharts4/charts'
import { ChartType } from '../types'

export default defineComponent({
  name: 'ValueAxis',
  props: {
    name: {
      type: String,
      default: 'values',
    },
    dimension: {
      type: String,
      default: 'y',
    },
    options: {
      type: Object,
      default: {},
    },
  },

  setup(props, context) {
    const { register } = useRegistry(props, context, ValueAxis)
    const axis: Ref<ValueAxis | null> = ref(null)

    const configure = async (chart: IChart) => {
      axis.value = new ValueAxis()
      if (axis.value.tooltip) {
        axis.value.tooltip.disabled
      }
      const dimension = props.dimension === 'x' ? chart.xAxes : chart.yAxes
      dimension.push(axis.value)
    }

    props.dimension === 'x'
      ? register(ChartType.xAxis, props.name, configure, { instance: axis.value })
      : register(ChartType.yAxis, props.name, configure, { instance: axis.value })

    return { ValueAxis, axis }
  },
})
</script>

<style scoped>
.value-axis {
  opacity: 1;
}
</style>
