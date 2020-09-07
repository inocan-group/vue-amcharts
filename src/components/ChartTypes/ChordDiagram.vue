<template>
  <div class="chord-diagram" style="height: 100%; width: 100%">
    <div class="chart" style="height: 100%; width: 100%" ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, ref } from 'vue'
import { IDictionary } from 'common-types'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { useChart, chartProperties } from '../composables'
import { ChordDiagram } from '@amcharts/amcharts4/charts'
import { dataProperties } from '../composables/useData'
import { Percent, color } from '@amcharts/amcharts4/core'
import { toNumberOrPercent, toNumber } from '../helpers'
import { removeProperties } from '../shared'

export default defineComponent({
  name: 'ChordDiagram',
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

    innerRadius: {
      type: [String, Number],
      default: 15,
    },

    sliceStroke: {
      type: String,
      default: undefined,
    },
    sliceStrokeColor: {
      type: String,
      default: undefined,
    },
    sliceStrokeOpacity: {
      type: String,
      default: undefined,
    },
    sliceStrokeWidth: {
      type: String,
      default: undefined,
    },
    sliceCornerRadius: {
      type: String,
      default: undefined,
    },
    sliceInnerCornerRadius: {
      type: String,
      default: undefined,
    },

    labelFontSize: {
      type: Number,
      default: undefined,
    },
    labelFill: {
      type: String,
      default: undefined,
    },

    linkGradientMode: {
      type: Boolean,
      default: false,
    },
    linkFillOpacity: {
      type: [String, Number],
      default: undefined,
    },

    /**
     * In cases where we don't want the ribbon based lines, we can take control
     * over the width of the lines
     */
    linkStrokeWidth: {
      type: [String, Number],
      default: undefined,
    },
    /**
     * Similarly to `linkStrokeWidth`, where we don't want the normal ribbon based lines, we can take control
     * over the opacity of the lines
     */
    linkStrokeOpacity: {
      type: [String, Number],
      default: undefined,
    },
    initialize: {
      type: Function,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const parentConfig: IChildWithCardinality[] = [
      [1, null, 'series'],
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
    } = useChart(ChordDiagram, props, context, parentConfig, {
      id: props.valueProp,
      dataProps: [props.valueProp],
    })

    actionsConfig(cd => ({
      valueProp: [cd, 'dataFields.value'],
      fromProp: [cd, 'dataFields.fromName'],
      toProp: [cd, 'dataFields.toName'],
      colorProp: [cd, 'dataFields.color'],
      innerRadius: [cd, v => toNumberOrPercent(v, 15)],
      sliceCornerRadius: [cd, 'nodes.template.slice.cornerRadius'],
      sliceInnerCornerRadius: [cd, 'nodes.template.slice.innerCornerRadius'],
      sliceStrokeColor: [cd, 'nodes.template.slice.stroke'],
      sliceStrokeOpacity: [cd, 'nodes.template.slice.strokeOpacity'],

      labelFontSize: [cd, 'nodes.template.label.fontSize', v => toNumber(v)],
      labelFill: [cd, 'nodes.template.label.fontSize', v => color(v)],

      linkGradientMode: [cd, 'links.template.link.colorMode', v => (v ? 'gradient' : undefined)],
      linkFillOpacity: [cd, 'links.template.link.fillOpacity', v => toNumber(v)],

      linkStrokeWidth: [
        cd,
        v => {
          const value = toNumber(v, undefined)
          console.log(`setting width to "${toNumber(v)}"; typeof value is ${typeof v}`, v)
          cd.links.template.middleLine.strokeWidth = toNumber(v, undefined)
          if (value && value > 0) {
            console.log('non-ribbon because width', typeof v, v)
            cd.nonRibbon = true
          } else if (!props.linkStrokeOpacity) {
            cd.links.template.middleLine.strokeWidth = (undefined as unknown) as number
            // note that, just setting "nonRibbon" to undefined does NOT work
            console.log('deleting nonRibbon')
            delete cd.nonRibbon
          } else {
            console.log('some other condition', v)
          }
          cd.invalidateData()
        },
      ],
      linkStrokeOpacity: [
        cd,
        v => {
          cd.links.template.middleLine.strokeOpacity = toNumber(v, undefined)
          if (v) {
            console.log('non-ribbon because opacity')
            cd.nonRibbon = true
          } else if (!props.linkStrokeWidth) {
            // note that, just setting "nonRibbon" to undefined does NOT work
            delete cd.nonRibbon
          }
        },
      ],
    }))

    onChartMounted(c => {
      c.width = new Percent(100)
      c.height = new Percent(100)
      // c.contentHeight = 800
      c.responsive.enabled = props.responsive
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
