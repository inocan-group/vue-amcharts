<template>
  <div class="chart-cursor"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Ref, ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { useRegistry, useProps } from '@/components/amCharts/AmChart/composables'
import { ChartType, IChart } from '@/components/amCharts/AmChart'
import { Cursor } from '@amcharts/amcharts4/charts'
import { color } from '@amcharts/amcharts4/core'

export default defineComponent({
  name: 'ChartCursor',
  props: {
    fullWidthX: {
      type: [String, Boolean],
      default: Boolean(false),
    },
    fullWidthY: {
      type: [String, Boolean],
      default: Boolean(false),
    },
    maxTooltipDistance: {
      type: [Number, String],
      default: undefined,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const { register, onChartConfig, childReady, getChart, getComponent } = useRegistry(props, context)
    const cursor: Ref<Cursor> = ref(new Cursor())
    const { actionsConfig, initializeProps } = useProps(props, cursor, getChart)

    register(ChartType.cursor, 'cursor', Cursor, cursor)

    actionsConfig((c, chart) => ({
      maxTooltipDistance: [c, v => (undefined ? undefined : Number(v))],
      fullWidthX: v => {
        if (v) {
          chart.cursor.xAxis = getComponent('xAxis')
          chart.cursor.fullWidthLineX = Boolean(v)
          chart.cursor.lineX.strokeWidth = 0
          chart.cursor.lineX.fill = color('#8F3985')
          chart.cursor.lineX.fillOpacity = 0.1
        }
      },
    }))

    onChartConfig((chart: IChart) => {
      chart.cursor = cursor.value
      initializeProps()
    })

    childReady()

    return { Cursor, cursor }
  },
})
</script>

<style scoped>
.chart-cursor {
  opacity: 1;
}
</style>
