<template>
  <div class="column-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { ColumnSeries } from '@amcharts/amcharts4/charts'
import { useSeries, seriesProps, useRegistry } from '../composables'
import { IDictionary } from 'common-types'
import { IChart, ChartType } from '..'

export default defineComponent({
  name: 'ColumnSeries',
  props: {
    ...seriesProps,
  },

  setup(props: IDictionary, context: SetupContext) {
    const { register } = useRegistry(props, context)
    const { setupAxes } = useSeries(props, context)
    const series: Ref<ColumnSeries> = ref(new ColumnSeries())
    const axisConfig: Ref<IDictionary> = ref({})

    const configure = async (chart: IChart) => {
      axisConfig.value = setupAxes(series)
      series.value = chart.series.push(series.value)
      series.value.name = props.name
      // series.value.strokeWidth = Number(props.strokeWidth)

      if (props.tooltipText) {
        console.warn(
          `You have configured tooltip text for the ${props.name} LineSeries component but there is no Cursor on this chart so it will not be displayed!`,
        )
      }
    }

    register(ChartType.series, props.id, configure, { instance: series })

    return { instance: series, axisConfig }
  },
})
</script>

<style scoped>
.column-series {
  opacity: 1;
}
</style>
