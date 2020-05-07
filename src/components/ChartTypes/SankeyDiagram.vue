<template>
  <div class="chord-diagram" style="height: 100%; width: 100%">
    <div class="chart" style="height: 100%; width: 100%" ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, PropType } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { useChart, chartProperties } from '../composables'
import { SankeyDiagram } from '@amcharts/amcharts4/charts'
import { dataProperties } from '../composables/useData'
import { toNumber } from '../helpers'
import { removeProperties } from '../shared'

/**
 * So sankey!
 */
export default defineComponent({
  name: 'SankeyDiagram',
  props: {
    ...removeProperties(dataProperties, 'dataIdProp', 'dataProperties'),
    ...chartProperties,
    valueProp: {
      type: String,
      default: 'value',
    },
    fromProp: {
      type: String,
      default: 'from',
    },
    toProp: {
      type: String,
      default: 'to',
    },
    colorProp: {
      type: String,
    },

    sortBy: {
      type: String as PropType<'none' | 'name' | 'value'>,
      default: 'none',
    },

    linkWidth: {
      type: Number,
      default: 10,
    },

    strokeWidth: {
      type: Number,
      default: undefined,
    },
    strokeColor: {
      type: [Number, String],
      default: undefined,
    },

    clickable: {
      type: Boolean,
      default: true,
    },
    draggable: {
      type: Boolean,
      default: true,
    },
    initialize: {
      type: Function,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const parentConfig: IChildWithCardinality[] = [
      [0, 1, 'legend'],
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
      onChartMounted,
      actionsConfig,
    } = useChart(SankeyDiagram, props, context, parentConfig, {
      id: props.valueProp,
      dataProps: [props.valueProp],
    })

    actionsConfig(skd => ({
      valueProp: [skd, 'dataFields.value'],
      fromProp: [skd, 'dataFields.fromName'],
      toProp: [skd, 'dataFields.toName'],
      colorProp: [skd, 'dataFields.color'],

      sortBy: skd,
      linkWidth: [skd, 'nodes.template.width'],
      // strokeColor: [skd, 'nodes.template.stroke', v => (v ? color(v) : undefined)],
      strokeWidth: [skd, 'nodes.template.strokeWidth', v => toNumber(v)],
      clickable: [skd, 'nodes.template.clickable'],
      draggable: [skd, 'nodes.template.draggable'],
    }))

    onChartMounted(c => {
      console.log('Sankey diagrams are cool')
      console.log({ width: c.nodes.template.strokeWidth, color: c.nodes.template.stroke })

      // c.width = new Percent(100)
      // c.height = new Percent(100)
      // c.contentHeight = 800
      // c.responsive.enabled = props.responsive
    })

    return {
      chart,
      chartdiv,
      acceptChildMessage,
      acceptChildRegistration,
      dataMeta,
      chartData,
      registrants,
    }
  },
})
</script>

<style scoped>
.chord-diagram {
  opacity: 1;
}
</style>
