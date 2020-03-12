<template>
  <div class="value-axis"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { IValueAxisProps } from './index'
import { useAxis } from '../composables/useAxis'
import { IDictionary } from 'common-types'
import { AxisDimension } from '../ChartTypes'
import { ValueAxis } from '@amcharts/amcharts4/charts'

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
    const { register, axis } = useAxis(props, context)
    register(ValueAxis)

    return { ValueAxis, axis }
  },
})
</script>

<style scoped>
.value-axis {
  opacity: 1;
}
</style>
