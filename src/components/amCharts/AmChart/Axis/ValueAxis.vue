<template>
  <div class="value-axis"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { useRegistry } from '../composables'
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
    const { register, addToRegistration, howMany } = useRegistry(props, context)
    const axis: Ref<ValueAxis> = ref(new ValueAxis())
    const dim = props.dimension === 'x' ? 'xAxis' : 'yAxis'
    const notFirstOnAxis = howMany(dim) > 0
    const dataSource: Ref<string> = ref('')
    const instanceId: Ref<string> = ref('')

    const configure = async (chart: IChart) => {
      axis.value.title.text = props.name || props.name === undefined ? props.id : ''
      axis.value.logarithmic = Boolean(props.logarithmic)

      if (axis.value.tooltip) {
        axis.value.tooltip.disabled
      }
      if (props.min !== undefined) axis.value.min = Number(props.min)
      if (props.max !== undefined) axis.value.max = Number(props.max)

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
      dataSource.value = axis.value.dataSource.uid
      instanceId.value = axis.value.uid
    }

    const accessibility = { axis: `${props.dimension}Axis`, dataField: `value${capitalize(props.dimension)}` }

    register(ChartType[dim], props.id, configure, { instance: axis.value, ...accessibility })

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
