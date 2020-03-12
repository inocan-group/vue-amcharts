<template>
  <div class="line-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { LineSeries } from '@amcharts/amcharts4/charts'
import { useSeries } from '../composables'

export default defineComponent({
  name: 'LineSeries',

  props: {
    name: {
      type: String,
      default: 'default',
    },
    xProp: {
      type: String,
      default: '',
    },
    xAxis: {
      type: String,
      default: 'default',
    },
    yProp: {
      type: String,
      default: '',
    },
    yAxis: {
      type: String,
      default: 'default',
    },
  },

  setup(props, context) {
    const { register } = useSeries(props, context)
    const options = { xProp: props.xProp, yProp: props.yProp, xAxis: props.xAxis, yAxis: props.yAxis }
    const series = register(LineSeries, options)

    series.dataFields.dateX = props.xProp
    series.dataFields.valueY = props.yProp

    return { LineSeries, series }
  },
})
</script>

<style scoped>
.line-series {
  opacity: 1;
}
</style>
