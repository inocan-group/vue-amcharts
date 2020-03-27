<template>
  <div class="date-axis" />
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { useRegistry, useProps } from '../composables'
import { IChart } from '../ChartTypes'
import { DateAxis } from '@amcharts/amcharts4/charts'
import { ChartType } from '..'
import { IDictionary } from 'common-types'
import { capitalize } from '@amcharts/amcharts4/.internal/core/utils/Utils'

export default defineComponent({
  name: 'DateAxis',
  props: {
    id: {
      type: String,
      default: 'primary',
    },
    name: {
      type: String,
      default: undefined,
    },
    dimension: {
      validator: v => ['y', 'x', 'z'].includes(v),
    },
    dateFormat: {
      type: String,
      default: 'MMM YYYY',
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const { register, howMany, onChartConfig, addToRegistration, childReady, getChart } = useRegistry(props, context)
    const axis: Ref<DateAxis> = ref(new DateAxis())
    const dim = props.dimension === 'x' ? 'xAxis' : 'yAxis'
    const notFirstOnAxis = howMany(dim) > 0
    const { actionsConfig, initializeProps } = useProps(props, axis, getChart)

    register(ChartType[dim], props.id, DateAxis, axis)

    actionsConfig(a => ({
      dateFormat: [a, 'tooltipDateFormat'],
      opposite: [a, 'renderer.opposite', (v: boolean) => (v === undefined ? (notFirstOnAxis ? true : false) : v)],
    }))

    onChartConfig((chart: IChart) => {
      addToRegistration('dataSource', axis.value.dataSource.uid)
      addToRegistration('data', axis.value.data)

      initializeProps()

      const dimension = props.dimension === 'x' ? chart.xAxes : chart.yAxes
      dimension.push(axis.value)
    })

    addToRegistration('dataField', `date${capitalize(props.dimension)}`)

    childReady()

    return {
      instance: axis,
      axis: `${props.dimension}Axis`,
      dataField: `date${capitalize(props.dimension)}`,
    }
  },
})
</script>

<style scoped>
.date-axis {
  opacity: 1;
}
</style>
