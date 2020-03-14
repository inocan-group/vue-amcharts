<template>
  <div class="chart-legend"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Ref, ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { useRegistry } from '@/components/amCharts/AmChart/composables'
import { ChartType, IChart } from '@/components/amCharts/AmChart'
import { Legend } from '@amcharts/amcharts4/charts'

export default defineComponent({
  name: 'ChartLegend',
  props: {
    position: {
      validator: v => ['left', 'right', 'top', 'bottom', 'absolute'].includes(v),
      default: 'bottom',
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const { register } = useRegistry(props, context, Legend)
    const legend: Ref<Legend> = ref(new Legend())

    const configure = async (chart: IChart) => {
      legend.value.position = props.position
      chart.legend = legend.value
    }

    register(ChartType.legend, 'legend', configure, { instance: legend.value })

    return { Legend, legend }
  },
})
</script>

<style scoped>
.chart-legend {
  opacity: 1;
}
</style>
