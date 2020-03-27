<template>
  <div class="word-cloud">
    <div class="chart" ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, onMounted } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { WordCloud } from '@amcharts/amcharts4/plugins/wordCloud'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { useChart, useEvents, IActionConfiguration } from '../composables'

export default defineComponent({
  name: 'WordCloud',
  props: {
    text: {
      type: String,
    },
    excludeWords: {
      type: Array,
      default: ['the', 'an', 'to'],
    },
    maxCount: {
      type: Number,
      number: 100,
    },
    minValue: {
      type: Number,
      default: 1,
    },
    minWordLength: {
      type: Number,
      default: 2,
    },
    /** the property which has the word (when passing an array directly to "data") */
    wordProp: {
      type: String,
    },
    weightProp: {
      type: String,
    },
    minFontSize: {
      type: [String, Number],
      default: () => '2%',
    },
    maxFontSize: {
      type: [String, Number],
      default: () => '20%',
    },
    accuracy: {
      type: [String, Number],
      default: 5,
      validator: v => Number(v) >= 0 && Number(v) <= 5,
    },
    randomness: {
      type: [Number, String],
      default: 0.2,
      validator: v => Number(v) >= 0 && Number(v) <= 1,
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

    const fontSize = (value: string | number) => {
      return typeof value === 'number' ? value : value.slice(-1) === '%' ? value : Number(value)
    }

    actionsConfig(wc => ({
      text: wc,
      excludeWords: wc,
      maxCount: [wc, v => Number(v)],
      minValue: [wc, v => Number(v)],
      minWordLength: [wc, v => Number(v)],
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

<style scoped></style>
