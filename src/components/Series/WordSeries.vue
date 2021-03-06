<template>
  <div class="word-series"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Ref, ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { WordCloudSeries, WordCloud } from '@amcharts/amcharts4/plugins/wordCloud'
import { useSeries, useEvents } from '../composables'
import { ChartType } from '..'
import { toNumberOrPercent } from '../helpers'

export default defineComponent({
  name: 'WordCloudSeries',
  props: {
    text: {
      type: String,
    },
    excludeWords: {
      type: Array,
      default: () => ['the', 'an', 'to'],
    },
    maxCount: {
      type: Number,
      number: 100,
    },
    minValue: {
      type: Number,
      default: 1,
    },
    minFontSize: {
      type: [Number, String],
      default: '2%',
    },
    maxFontSize: {
      type: [Number, String],
      default: '20%',
    },
    minWordLength: {
      type: Number,
      default: 2,
    },
    rotationalThreshold: {
      type: Number,
      default: 0.7,
      validator: v => v >= 0 && v <= 1,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const series: Ref<WordCloudSeries> = ref(new WordCloudSeries())
    const {
      register,
      childReady,
      chartData,
      onChartConfig,
      dataReady,
      dataMeta,
      actionsConfig,
      initializeProps,
    } = useSeries(props, context, series, WordCloud)
    register(ChartType.series, props.id, WordCloudSeries, series)
    dataReady(series)

    useEvents(series, context, {
      arrangestarted: 'onArrangeStarted',
      arrangeended: 'onArrangeEnded',
      arrangeprogress: 'onArrangeProgress',
    })

    actionsConfig(s => ({
      text: s,
      excludeWords: s,
      maxCount: [s, v => Number(v)],
      minValue: [s, v => Number(v)],
      minWordLength: [s, v => Number(v)],
      wordProp: [s, 'dataFields.word'],
      weightProp: [s, 'dataFields.value'],
      minFontSize: [s, v => toNumberOrPercent(v)],
      maxFontSize: [s, v => toNumberOrPercent(v)],
    }))

    onChartConfig(chart => {
      initializeProps()
      series.value = chart.series.push(series.value)
    })

    childReady()

    return { series, dataMeta, chartData }
  },
})
</script>

<style scoped>
.word-series {
  opacity: 1;
}
</style>
