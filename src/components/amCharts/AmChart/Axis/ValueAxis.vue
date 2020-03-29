<template>
  <div class="value-axis"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { useRegistry, useProps } from '../composables'
import { IDictionary } from 'common-types'
import { IChart } from '../ChartTypes'
import { ValueAxis } from '@amcharts/amcharts4/charts'
import { ChartType } from '../types'
import { capitalize } from '@amcharts/amcharts4/.internal/core/utils/Utils'

export default defineComponent({
  name: 'ValueAxis',
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
    min: {
      type: [String, Number],
      default: undefined,
    },
    max: {
      type: [String, Number],
      default: undefined,
    },
    logarithmic: {
      type: [String, Boolean],
      default: () => Boolean(false),
    },
    numberFormat: {
      type: String,
      default: undefined,
    },
    secondaryAxes: {
      type: [Function, Object],
      default: undefined,
    },

    options: {
      type: Object,
      default: () => {},
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const axis: Ref<ValueAxis> = ref(new ValueAxis())
    const { register, addToRegistration, howMany, onChartConfig, getChart, childReady } = useRegistry(props, context)
    const { actionsConfig, initializeProps } = useProps(props, axis, getChart)
    const dim = props.dimension === 'x' ? 'xAxis' : 'yAxis'
    const { onPropChange } = useProps(props, axis, getChart)
    const notFirstOnAxis = howMany(dim) > 0
    const dataSource: Ref<string> = ref('')
    const instanceId: Ref<string> = ref('')

    const accessibility = { axis: `${props.dimension}Axis`, dataField: `value${capitalize(props.dimension)}` }

    register(ChartType[dim], props.id, ValueAxis, axis)
    addToRegistration(accessibility)

    actionsConfig((a, chart, deltas) => ({
      name: [a, 'title.text'],
      logarithmic: [a, (v: boolean) => Boolean(v)],
      min: () => {
        const value = deltas ? deltas.current : props.min
        a.min = value === undefined ? value : Number(value)
        a.invalidateRawData()
      },
      max: () => {
        const value = deltas ? deltas.current : props.max
        a.max = value === undefined ? value : Number(value)
        a.invalidateRawData()
      },
      // numberFormat: [a, 'renderer.axis.numberFormatter.outputFormat'],
    }))

    onChartConfig((chart: IChart) => {
      console.log('value axis entering config', chart)

      const dimension = props.dimension === 'x' ? chart.xAxes : chart.yAxes
      axis.value = dimension.push(axis.value)
      initializeProps()
      console.log(`value axis renderer`, axis.value.renderer)

      // When secondary axis are added; we have certain default behavior
      // (assuming there isn't an explicit definition)
      if (notFirstOnAxis && !props.secondaryAxes) {
        axis.value.renderer.opposite = true
        axis.value.renderer.grid.template.strokeOpacity = 0
      } else if (props.secondaryAxes !== undefined) {
        // TODO: implement this
      }

      addToRegistration('id', axis.value.uid)
      addToRegistration('dataSource', axis.value.dataSource.uid)
      addToRegistration('data', axis.value.data)
      dataSource.value = axis.value.dataSource.uid
      instanceId.value = axis.value.uid
    })

    childReady()

    return {
      instance: axis,
      dataSource,
      instanceId,
      ...accessibility,
    }
  },
})
</script>

<style scoped>
.value-axis {
  opacity: 1;
}
</style>
