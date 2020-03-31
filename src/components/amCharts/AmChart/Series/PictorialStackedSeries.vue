<template>
  <div class="pictorial-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { useSeries } from '../composables'
import { IDictionary } from 'common-types'
import { ChartType } from '../index'
import { PictorialStackedSeries, SlicedChart } from '@amcharts/amcharts4/charts'
import { toNumberOrPercent } from '../helpers'

export default defineComponent({
  name: 'PictorialStackedSeries',
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
     * By default, the value of the Pyramid slice is represented by the actual area of the slice.
     * From the data visualization standpoint, this is a correct behavior.
     */
    valueIs: {
      type: String,
      default: 'area',
      validator: v => ['area', 'height'].includes(v),
    },

    topWidth: {
      type: [String, Number],
      default: 0,
    },
    bottomWidth: {
      type: [String, Number],
      default: '100%',
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
  },

  setup(props: IDictionary, context: SetupContext) {
    const series: Ref<PictorialStackedSeries> = ref(new PictorialStackedSeries())
    const { actionsConfig, register, onChartConfig, initializeProps, childReady, dataReady } = useSeries(
      props,
      context,
      series,
      SlicedChart,
    )

    dataReady(series)

    register(ChartType.series, props.id, PictorialStackedSeries, series)

    actionsConfig(s => ({
      valueProp: [s, 'dataFields.value'],
      categoryProp: [s, 'dataFields.category'],
      topWidth: [s, v => toNumberOrPercent(v, 0)],
      bottomWidth: [s, v => toNumberOrPercent(v, '100%')],

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
.pictorial-series {
  opacity: 1;
}
</style>
