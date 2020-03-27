<template>
  <div class="word-series"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Ref, ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { WordCloudSeries, WordCloud } from '@amcharts/amcharts4/plugins/wordCloud'
import { useSeries, useEvents } from '../composables'
import { ChartType } from '..'

export default defineComponent({
  name: 'WordCloudSeries',
  props: {
    rotationalThreshold: {
      type: Number,
      default: 0.7,
      validator: v => v >= 0 && v <= 1,
    },
    color: {
      type: String,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const series: Ref<WordCloudSeries> = ref(new WordCloudSeries())
    const { register, childReady, chartData, onChartConfig, dataReady, dataMeta, actionsConfig } = useSeries(
      props,
      context,
      series,
      WordCloud,
    )
    register(ChartType.series, props.id, WordCloudSeries, series)
    dataReady(series)

    useEvents(series, context, {
      arrangestarted: 'onArrangeStarted',
      arrangeended: 'onArrangeEnded',
      arrangeprogress: 'onArrangeProgress',
    })

    const fontSize = (value: string | number) => {
      return value ? (typeof value === 'number' ? value : value.slice(-1) === '%' ? value : Number(value)) : undefined
    }

    actionsConfig(s => ({
      wordProp: [s, 'dataFields.word'],
      weightProp: [s, 'dataFields.value'],
      minFontSize: [s, fontSize],
      maxFontSize: [s, fontSize],
    }))

    onChartConfig(chart => {
      chart.series.push(series.value)
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
