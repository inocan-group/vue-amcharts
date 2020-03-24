<template>
  <div class="chart-legend"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Ref, ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { useRegistry, IActionConfiguration, useProps } from '@/components/amCharts/AmChart/composables'
import { ChartType, IChart } from '@/components/amCharts/AmChart'
import { Legend } from '@amcharts/amcharts4/charts'

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
    const { register, onChartConfig } = useRegistry(props, context)
    const { onPropChange, respondTo, initializeProps } = useProps(props)
    const legend: Ref<Legend> = ref(new Legend())

    register(ChartType.legend, 'legend', legend)
    const actionsConfig: IActionConfiguration = () => ({
      show: () => {
        console.log('running')
      },
    })

    onChartConfig(async (chart: IChart) => {
      legend.value.position = props.position
      if (['left', 'right'].includes(props.position)) {
        legend.value.valign = props.positionAlt
      } else if (['top', 'bottom'].includes(props.position)) {
        legend.value.contentAlign = props.positionAlt
      }
      chart.legend = legend.value
      if (props.show) {
        legend.value.show()
      } else {
        legend.value.hide()
      }
      // TODO: figure out why the show/hide logic can't be done in the actionsConfig
      initializeProps(actionsConfig)
    })

    onPropChange((prop, value) => {
      console.log(`${prop} changed`)
      if (props.show) {
        legend.value.show()
      } else {
        legend.value.hide()
      }
      respondTo(prop, value, actionsConfig)
    })

    return { legend }
  },
})
</script>

<style scoped>
.chart-legend {
  opacity: 1;
}
</style>
