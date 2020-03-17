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
    const { register } = useRegistry(props, context)
    const { onPropChange, respondTo } = useProps(props)
    const cursor: Ref<Cursor> = ref(new Cursor())

    onPropChange(async (prop: string, current) => {
      const c = cursor.value
      respondTo(prop, current, {
        maxTooltipDistance: c,
      })
    })

    const configure = async (chart: IChart) => {
      chart.cursor = cursor.value
      chart.cursor.maxTooltipDistance =
        props.maxTooltipDistance === undefined ? undefined : Number(props.maxTooltipDistance)

      if (props.fullWidthX) {
        // chart.cursor.xAxis = getComponent('xAxis')
        // chart.cursor.fullWidthLineX = Boolean(props.fullWidthX)
        // chart.cursor.lineX.strokeWidth = 0
        // chart.cursor.lineX.fill = color('#8F3985')
        // chart.cursor.lineX.fillOpacity = 0.1
      }
    }

    register(ChartType.cursor, 'cursor', configure)

    return { ChartCursor: Cursor, cursor }
  },
})
</script>

<style scoped>
.chart-cursor {
  opacity: 1;
}
</style>
