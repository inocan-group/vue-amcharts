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
    const { register, addToRegistration, howMany, onChartConfig } = useRegistry(props, context)
    const { onPropChange } = useProps(props)
    const axis: Ref<ValueAxis> = ref(new ValueAxis())
    const dim = props.dimension === 'x' ? 'xAxis' : 'yAxis'
    const notFirstOnAxis = howMany(dim) > 0
    const dataSource: Ref<string> = ref('')
    const instanceId: Ref<string> = ref('')

    const accessibility = { axis: `${props.dimension}Axis`, dataField: `value${capitalize(props.dimension)}` }

    register(ChartType[dim], props.id, axis)
    addToRegistration(accessibility)

    onPropChange(async (prop, current) => {
      if (prop === 'name') {
        axis.value.title.text = current
      }
      if (prop === 'min' || prop === 'max') {
        axis.value[prop] = Number(current)
        axis.value.invalidateRawData()
      }
    })

    onChartConfig((chart: IChart) => {
      axis.value.title.text = props.name === '' ? '' : props.name || props.id
      axis.value.logarithmic = Boolean(props.logarithmic)

      if (axis.value.tooltip) {
        axis.value.tooltip.disabled
      }

      const min = props.min === '' ? undefined : props.min
      const max = props.max === '' ? undefined : props.max
      axis.value.min = min === undefined ? ((undefined as unknown) as number) : Number(min)
      axis.value.max = max === undefined ? ((undefined as unknown) as number) : Number(max)

      const dimension = props.dimension === 'x' ? chart.xAxes : chart.yAxes
      dimension.push(axis.value)

      // When secondary axis are added; we have certain default behavior
      // (assuming there isn't an explicit definition)
      if (notFirstOnAxis && !props.secondaryAxes) {
        axis.value.renderer.opposite = true
        axis.value.renderer.grid.template.strokeOpacity = 0
      } else if (props.secondaryAxes !== undefined) {
        // TODO: implement this
      }
      if (props.numberFormat !== undefined)
        axis.value.renderer.axis.numberFormatter.outputFormat = String(props.numberFormat)

      addToRegistration('id', axis.value.uid)
      addToRegistration('dataSource', axis.value.dataSource.uid)
      addToRegistration('data', axis.value.data)
      dataSource.value = axis.value.dataSource.uid
      instanceId.value = axis.value.uid
    })

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
