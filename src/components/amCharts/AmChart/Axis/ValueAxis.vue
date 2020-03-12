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
  },

  setup(props, context) {
    const { register } = useRegistry(props, context, ValueAxis)
    const instance = new ValueAxis()

    const configure = async (chart: IChart) => {
      const axis = props.dimension === 'x' ? chart.xAxes : chart.yAxes
      console.log(`registering ValueAxis on ${props.dimension}`, { chart, axis })
      axis.push(instance)
    }

    props.dimension === 'x'
      ? register(ChartType.xAxis, props.name, configure)
      : register(ChartType.yAxis, props.name, configure)

    return { ValueAxis, axis: instance }
  },
})
</script>

<style scoped>
.value-axis {
  opacity: 1;
}
</style>
