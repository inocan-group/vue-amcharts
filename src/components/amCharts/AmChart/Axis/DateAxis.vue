<template>
  <div class="date-axis" />
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { useAxis, useRegistry } from '../composables'
import { IChart } from '../ChartTypes'
import { DateAxis } from '@amcharts/amcharts4/charts'
import { ChartType } from '..'
import { Configuration } from '../composables/useRegistry/registry-types'
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
      default: undefined,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    // TODO: There is opportunity to make Axis leverage reusable code
    const { register, howMany, addToRegistration } = useRegistry(props, context)
    const axis: Ref<DateAxis> = ref(new DateAxis())
    const dim = props.dimension === 'x' ? 'xAxis' : 'yAxis'
    const notFirstOnAxis = howMany(dim) > 0

    const configure: Configuration<IChart> = async chart => {
      axis.value.tooltipDateFormat = 'MMM YYYY'
      if (notFirstOnAxis) {
        axis.value.renderer.opposite = true
      }
      const dimension = props.dimension === 'x' ? chart.xAxes : chart.yAxes
      dimension.push(axis.value)
      addToRegistration('id', props.id || props.name)
      addToRegistration('dataSource', axis.value.dataSource.uid)
    }

    register(ChartType[dim], props.id, configure, { instance: axis.value })
    addToRegistration('dataField', `date${capitalize(props.dimension)}`)

    // TODO: investigate means to make this information dynamic
    const zoomFactor = ref(axis.value.zoomFactor)

    return {
      instance: axis,
      zoomFactor,
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
