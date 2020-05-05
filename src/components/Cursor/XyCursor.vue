<template>
  <div class="xy-cursor"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Ref, ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { useRegistry, useProps } from '@/components/composables'
import { ChartType } from '@/components'
import { XYCursor } from '@amcharts/amcharts4/charts'
import { color } from '@amcharts/amcharts4/core'

type XYChart = import('@amcharts/amcharts4/charts').XYChart

export default defineComponent({
  name: 'XyCursor',
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
    const { register, onChartConfig, childReady, getChart, getComponent } = useRegistry<XYChart>(props, context)
    const cursor: Ref<XYCursor> = ref(new XYCursor())
    const { actionsConfig, initializeProps } = useProps<XYChart>(props, cursor, getChart)

    register(ChartType.cursor, 'cursor', XYCursor, cursor)

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

    onChartConfig(chart => {
      chart.cursor = cursor.value
      initializeProps()
    })

    childReady()

    return { cursor }
  },
})
</script>

<style scoped>
.xy-cursor {
  opacity: 1;
}
</style>
