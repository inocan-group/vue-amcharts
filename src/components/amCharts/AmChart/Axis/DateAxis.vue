<template>
  <div class="date-axis" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useAxis } from '../composables/useAxis'
import { IChartChildApi, AxisDimension } from '../ChartTypes'
import { DateAxis } from '@amcharts/amcharts4/charts'

export default defineComponent({
  name: 'DateAxis',
  props: {
    name: {
      type: String,
      default: 'dates',
    },
    dimension: {
      type: String,
      default: 'x',
    },
  },

  setup(props, context) {
    const { register, axis } = useAxis(props, context)
    register(DateAxis)

    return { DateAxis, axis }
  },
})
</script>

<style scoped>
.date-axis {
  opacity: 1;
}
</style>
