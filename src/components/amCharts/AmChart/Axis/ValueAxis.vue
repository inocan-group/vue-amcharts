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
    const { register, done } = useRegistry<ValueAxis>(props, context)
    const instance = new ValueAxis()

    const onRegistration = (chart: IChart) => {
      const axis = props.dimension === 'x' ? chart.xAxis : chart.yAxis
      axis.push(instance)
      done()
    }

    console.log(`registering ValueAxis on ${props.dimension}`)

    // props.dimension === 'x'
    //   ? register(ChartType.xAxis, props.name, { constructor: ValueAxis, instance }, onRegistration)
    //   : register(ChartType.yAxis, props.name, { constructor: ValueAxis, instance }, onRegistration)

    return { ValueAxis, axis: instance }
  },
})
</script>

<style scoped>
.value-axis {
  opacity: 1;
}
</style>
