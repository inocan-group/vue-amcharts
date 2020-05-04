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
import { IRegistrationInfo } from '../composables/useRegistry/registry-types'

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
    /**
     * 'x', 'y' or 'z'.
     */
    dimension: {
      validator: v => ['y', 'x', 'z'].includes(v),
    },
    /**
     * A special date format to apply to axis tooltips.
     */
    dateFormat: {
      type: String,
      default: 'MMM YYYY',
    },
    /**
     * Disable (hide) the axis line.
     */
    disableAxisLine: {
      type: Boolean,
    },
    /**
     * Indicates if cusor's tooltip should be shown on this Axis.
     */
    cursorToolTipEnabled: {
      type: Boolean,
      default: true,
    },
    /**
     * Allows restricting zoom in beyond a certain number of base intervals.
     */
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
    const { actionsConfig, initializeProps } = useProps<XYChart | XYChart3D>(props, axis, getChart)

    const registeredAxis = (opt: IRegistrationInfo['parentOptions']) =>
      opt.fixedValues?.dimension ? `${opt.fixedValues.dimension}Axis` : props.dimension === 'x' ? 'xAxis' : 'yAxis'

    const response = register(registeredAxis, props.id, DateAxis, axis)
    const notFirstOnAxis = howMany(response.type) > 1

    if (response.type !== `${props.dimension}Axis` && props.dimension) {
      console.warn(
        `Attempted to set dimension as '${props.dimension}' but this component always uses the 'x' dimension.`,
      )
    }

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

    const registeredType = response.type
    addToRegistration('dataField', `date${capitalize(capitalize(registeredType[0]))}`)
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
