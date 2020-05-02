<template>
  <div class="date-axis" />
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { useRegistry, useProps } from '../composables'
import { DateAxis } from '@amcharts/amcharts4/charts'
import { ChartType } from '..'
import { IDictionary } from 'common-types'
import { capitalize } from '@amcharts/amcharts4/.internal/core/utils/Utils'

export type XYChart = import('@amcharts/amcharts4/charts').XYChart
export type XYChart3D = import('@amcharts/amcharts4/charts').XYChart3D

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
    disableAxisLine: {
      type: Boolean,
    },
    cursorToolTipEnabled: {
      type: Boolean,
      default: true,
    },
    minZoomCount: {
      type: Number,
      default: 1,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const { register, howMany, onChartConfig, addToRegistration, childReady, getChart } = useRegistry<
      XYChart | XYChart3D
    >(props, context)
    const axis: Ref<DateAxis> = ref(new DateAxis())
    const dim = props.dimension === 'x' ? 'xAxis' : 'yAxis'
    const notFirstOnAxis = howMany(dim) > 0
    const { actionsConfig, initializeProps } = useProps<XYChart | XYChart3D>(props, axis, getChart)

    register(ChartType[dim], props.id, DateAxis, axis)

    actionsConfig(a => ({
      dateFormat: [a, 'tooltipDateFormat', v => (v === undefined ? 'MMM YYYY' : v)],
      opposite: [a, 'renderer.opposite', v => (v === undefined ? (notFirstOnAxis ? true : false) : v)],
      disableAxisLine: [a, 'renderer.line.disabled'],
      cursorToolTipEnabled: a,
      minZoomCount: a, // find out if this property could be made reactive
    }))

    onChartConfig(c => {
      addToRegistration('dataSource', axis.value.dataSource.uid)
      addToRegistration('data', axis.value.data)

      const dimension = props.dimension === 'x' ? c.xAxes : c.yAxes
      axis.value = dimension.push(axis.value)

      initializeProps()
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
