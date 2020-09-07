<template>
  <div class="chart-legend"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Ref, ref } from 'vue'
import { IDictionary } from 'common-types'
import { useRegistry, useProps } from '../composables'
import { ChartType } from '../types'
import { Legend } from '@amcharts/amcharts4/charts'

type Chart = import('@amcharts/amcharts4/charts').Chart

export default defineComponent({
  name: 'ChartLegend',
  props: {
    position: {
      validator: v => ['left', 'right', 'top', 'bottom', 'absolute'].includes(v),
      default: 'bottom',
    },
    /**
     * Gives positioning info for alternative axis; depends on left/right versus top/bottom
     * position.
     */
    positionAlt: {
      validator: v => ['start', 'center', 'end'].includes(v),
      default: 'center',
    },
    show: {
      type: Boolean,
      default: true,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const { register, onChartConfig, childReady, getChart } = useRegistry<Chart>(props, context)
    const legend: Ref<Legend> = ref(new Legend())
    const { actionsConfig, initializeProps } = useProps<Chart>(props, legend, getChart)

    register(ChartType.legend, 'legend', Legend, legend)

    onChartConfig(chart => {
      initializeProps()
      chart.legend = legend.value
    })

    actionsConfig((l, c, deltas) => ({
      show: () => {
        const conditional = deltas ? deltas.current : props.show
        if (conditional) {
          l.show()
          if (['left', 'right'].includes(props.position)) {
            l.valign = props.positionAlt
          } else if (['top', 'bottom'].includes(props.position)) {
            l.contentAlign = props.positionAlt
          }
        } else {
          l.hide()
        }
      },
      position: l,
      positionAlt: l,
    }))

    childReady()
    return { legend }
  },
})
</script>

<style scoped>
.chart-legend {
  opacity: 1;
}
</style>
