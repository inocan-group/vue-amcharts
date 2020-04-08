<template>
  <div class="funnel-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { useSeries } from '../composables'
import { IDictionary } from 'common-types'
import { ChartType, toNumber } from '../index'
import { FunnelSeries, SlicedChart } from '@amcharts/amcharts4/charts'
import { AmchartError } from '../errors'
import {
  LinearGradient,
  RadialGradient,
  LinearGradientModifier,
  RadialGradientModifier,
} from '@amcharts/amcharts4/core'

export default defineComponent({
  name: 'FunnelSeries',
  props: {
    valueProp: {
      type: String,
      required: true,
    },
    categoryProp: {
      type: String,
      required: true,
    },

    /**
     * 0 is a perfect rectangle, 1 will result in bottom being same width as next item's top, and
     * 0.5 will be half-way inbetween
     */
    bottomRatio: {
      type: [Number, String],
      defaultValue: 0,
    },

    labelText: {
      type: String,
      default: "{category}: {value.percent.formatNumber('#.0')}%",
    },
    alignLabels: {
      type: Boolean,
      default: false,
    },
    alignOpposite: {
      type: Boolean,
      default: false,
    },
    disableLabels: {
      type: Boolean,
      default: false,
    },

    tooltipText: {
      type: String,
      default: "[bold]{category}:[/] {value.percent.formatNumber('#.#')}% ({value.value})",
    },

    linksHeight: {
      type: [String, Number],
      default: 10,
    },
    linksOpacity: {
      type: [String, Number],
      default: 0.5,
    },

    orientation: {
      type: String,
      default: 'vertical',
      validator: v => ['vertical', 'horizontal'].includes(v),
    },

    /**
     * Does not -- by itself -- use a gradient but rather states the gradient's pattern. Values
     * are 'linear' and 'radial'
     */
    gradientType: {
      type: String,
      default: () => 'linear',
    },
    /**
     * When no elements are set then gradient is not implied but if you state three array elements:
     * [ start, mid, end ] then it will turn on gradient and use these values.
     */
    gradientBrightness: {
      type: Array,
      default: () => [],
    },
    /**
     * When no elements are set then gradient is not implied but if you state three array elements:
     * [ start, mid, end ] then it will turn on gradient and use these values.
     */
    gradientOffsets: {
      type: Array,
      default: () => [],
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const series: Ref<FunnelSeries> = ref(new FunnelSeries())
    const { actionsConfig, register, onChartConfig, initializeProps, childReady, dataReady } = useSeries(
      props,
      context,
      series,
      SlicedChart,
    )

    dataReady(series)

    register(ChartType.series, props.id, FunnelSeries, series)

    const showGradiant = () =>
      (props.gradientOffsets && props.gradientOffsets.length === 3) ||
      (props.gradiantBrightness && props.gradiantBrightness.length === 3)
        ? true
        : false

    const setupGradient = () => {
      const gradient = props.gradientType === 'linear' ? new LinearGradientModifier() : new RadialGradientModifier()
      if (props.gradientOffsets && props.gradientOffsets.length === 3) {
        gradient.offsets = props.gradientOffsets
      }

      if (props.gradientBrightness && props.gradientBrightness.length === 3) {
        gradient.offsets = props.gradientBrightness
      }

      series.value.slices.template.fillModifier = gradient
      series.value.invalidate()
    }
    const teardownGradient = () => {
      delete series.value.slices.template.fillModifier
    }

    actionsConfig(s => ({
      valueProp: [s, 'dataFields.value'],
      categoryProp: [s, 'dataFields.category'],
      bottomRatio: [s, v => toNumber(v, 0)],
      alignLabels: [s, v => v, () => s.invalidateLabels()],
      alignOpposite: [s, 'labelsOpposite', v => v, () => s.invalidate()],
      labelText: [s, 'labels.template.text'],
      disableLabels: [
        s,
        v => {
          s.labels.template.disabled = v
          s.ticks.template.disabled = v
          s.invalidate()
        },
      ],
      tooltipText: [s, 'slices.template.tooltipText'],

      linksHeight: [s, 'sliceLinks.template.height', v => toNumber(v, 10), () => s.invalidateLayout()],
      linksOpacity: [s, 'sliceLinks.template.fillOpacity', v => toNumber(v, 0.5), () => s.invalidateLayout()],
      orientation: [s, v => v, () => s.invalidate()],

      gradientOffsets: [
        s,
        () => {
          if (showGradiant()) setupGradient()
          else teardownGradient()
        },
      ],
      gradiantBrightness: [
        s,
        () => {
          if (showGradiant()) setupGradient()
          else teardownGradient()
        },
      ],
    }))

    onChartConfig(chart => {
      initializeProps()
      series.value = chart.series.push(series.value)
    })

    childReady()

    return { series }
  },
})
</script>

<style scoped>
.column-series {
  opacity: 1;
}
</style>
