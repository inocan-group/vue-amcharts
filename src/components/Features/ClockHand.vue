<template>
  <div class="gauge-hand"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { ClockHand } from '@amcharts/amcharts4/charts'
import { percent, color } from '@amcharts/amcharts4/core'
import { useRegistry, useProps } from '../composables'
import { ChartType } from '../types'
import { IDictionary } from 'common-types'

type GaugeChart = import('@amcharts/amcharts4/charts').GaugeChart

export default defineComponent({
  name: 'ClockHand',
  props: {
    /**
     * The current value clock hand is pointing to.
     */
    value: {
      type: Number,
      required: true,
    },
    fill: { type: String },
    stroke: { type: String },
    /**
     * Radius of the hand's inner end.
     */
    innerRadius: {
      type: Number,
      default: 0,
    },
    /**
     * Radius of the hand's outer end.
     */
    radius: {
      type: Number,
      default: 100,
    },
    /**
     * Width, in pixels, of the clock hand's base.
     */
    startWidth: {
      type: Number,
      default: 5,
    },
    /**
     * Width, in pixels, of the clock hand's outer end. (tip)
     */
    endWidth: {
      type: Number,
      default: 1,
    },
    disablePin: { type: Boolean, default: false },
    disableHand: { type: Boolean, default: false },
  },

  setup(props: IDictionary, context: SetupContext) {
    const { register, getComponent, onChartConfig, childReady, getChart } = useRegistry<GaugeChart>(props, context)
    const clockHand: Ref<ClockHand> = ref(new ClockHand())
    const { actionsConfig, initializeProps } = useProps<GaugeChart>(props, clockHand, getChart)

    register(ChartType.features, 'clockhand', ClockHand, clockHand)

    actionsConfig(ch => ({
      value: [ch, 'value', v => v],
      fill: [ch, 'fill', (v: string) => color(v)],
      stroke: [ch, 'stroke', (v: string) => color(v)],
      innerRadius: [ch, 'innerRadius', (v: number) => percent(v)],
      radius: [ch, 'radius', (v: number) => percent(v)],
      startWidth: [ch, 'startWidth', v => v],
      endWidth: [ch, 'endWidth', v => v],
      // TODO: Find out why `disablePin` and `disableHand` don't work!
      // disablePin: [ch, 'pin.disabled', v => v],
      // disableHand: [ch, 'hand.disabled', v => v],
    }))

    onChartConfig(chart => {
      initializeProps()
      chart.hands.push(clockHand.value)
      clockHand.value.value = props.value
      // clockHand.value.pin.disabled = props.disablePin
      // clockHand.value.hand.disabled = props.disableHand
    })

    childReady()

    return { clockHand }
  },
})
</script>

<style scoped></style>
