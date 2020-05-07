<template>
  <div class="word-cloud">
    <div class="chart" ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { WordCloud } from '@amcharts/amcharts4/plugins/wordCloud'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { useChart, useEvents } from '../composables'

export default defineComponent({
  name: 'WordCloud',
  props: {
    /** the property which has the word (when passing an array directly to "data") */
    wordProp: {
      type: String,
    },
    weightProp: {
      type: String,
    },
    minFontSize: {
      type: [String, Number],
      // default: () => '2%',
    },
    maxFontSize: {
      type: [String, Number],
      // default: () => '20%',
    },
    accuracy: {
      type: [String, Number],
      // default: 5,
      validator: v => Number(v) >= 0 && Number(v) <= 5,
    },
    randomness: {
      type: [Number, String],
      // default: 0.2,
      validator: v => Number(v) >= 0 && Number(v) <= 1,
    },
    initialize: {
      type: Function,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const parentConfig: IChildWithCardinality[] = [
      [1, null, 'series'],
      [0, null, 'features'],
    ]
    const {
      chart,
      chartdiv,
      acceptChildMessage,
      acceptChildRegistration,
      registrants,
      dataMeta,
      chartData,
      actionsConfig,
      onChartMounted,
    } = useChart(WordCloud, props, context, parentConfig)

    actionsConfig(wc => ({
      accuracy: [wc, v => Number(v)],
      randomness: [wc, v => Number(v)],
    }))

    onChartMounted(c => {
      console.log('chart mounted')

      useEvents(c, context, {
        arrangestarted: 'onArrangeStarted',
        arrangeended: 'onArrangeEnded',
        arrangeprogress: 'onArrangeProgress',
      })
    })

    return { chart, chartdiv, acceptChildMessage, acceptChildRegistration, dataMeta, chartData, registrants }
  },
})
</script>

<style scoped>
.word-cloud {
  width: 100%;
  height: 800px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
