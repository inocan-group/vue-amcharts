<template>
  <div class="column-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { useSeries } from '../composables'
import { ForceDirectedSeries } from '@amcharts/amcharts4/plugins/forceDirected'
import { IDictionary } from 'common-types'
import { ChartType } from '../index'
import { toNumber, toNumberOrPercent } from '../helpers'
import { color, Image, Sprite } from '@amcharts/amcharts4/core'
import { AmchartError } from '../errors'

const ICON_DEFAULT = {
  horizontalCenter: 'middle',
  verticalCenter: 'middle',
  width: 50,
  height: 50,
}

export default defineComponent({
  name: 'ForceDirectedSeries',
  props: {
    idProp: {
      type: String,
      default: undefined,
    },
    nameProp: {
      type: String,
      default: 'name',
    },
    valueProp: {
      type: String,
      default: 'value',
    },
    childrenProp: {
      type: String,
      default: undefined,
    },
    linkProp: {
      type: String,
      default: undefined,
    },
    colorProp: {
      type: String,
      default: undefined,
    },
    fixedProp: {
      type: String,
      default: undefined,
    },
    hiddenInLegendProp: {
      type: String,
      default: undefined,
    },
    collapsedProp: {
      type: String,
      defualt: undefined,
    },
    iconProp: {
      type: String,
      default: undefined,
    },

    iconConfig: {
      type: Object,
      default: () => ICON_DEFAULT,
    },

    fontSize: {
      type: [String, Number],
      default: undefined,
    },
    minRadius: {
      type: [String, Number],
      default: '1%',
    },
    maxRadius: {
      type: [String, Number],
      default: '8%',
    },

    centerStrength: {
      type: [String, Number],
      default: undefined,
    },

    /**
     * Relative strength with which each node attracts (positive value) or
     * pushes away (negative value) other nodes.
     */
    manyBodyStrength: {
      type: [String, Number],
      default: -12,
    },

    linkStrength: {
      type: [String, Number],
      default: 2,
    },

    label: {
      type: String,
      default: '{name}',
    },

    maxLevels: {
      type: Number,
      default: undefined,
    },

    /** the initial X-position of a nodes can be set with a property field */
    xProp: {
      type: String,
      default: undefined,
    },
    /** the initial Y-position of a nodes can be set with a property field */
    yProp: {
      type: String,
      default: undefined,
    },

    linkWidth: {
      type: [String, Number],
      default: undefined,
    },
    linkOpacity: {
      type: [String, Number],
      default: 1,
    },
    distance: {
      type: [String, Number],
      default: 1.5,
    },
    disableLinks: {
      type: Boolean,
      default: false,
    },

    labelFill: {
      type: String,
      default: undefined,
    },
    labelVAlign: {
      type: String,
      default: undefined,
    },
    labelDy: {
      type: [String, Number],
      default: undefined,
    },

    tooltipText: {
      type: String,
      default: undefined,
    },

    disableCircle: {
      type: Boolean,
      default: false,
    },
    disableOuterCircle: {
      type: Boolean,
      default: false,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const series: Ref<ForceDirectedSeries> = ref(new ForceDirectedSeries())
    const { actionsConfig, register, onChartConfig, initializeProps, childReady, dataReady } = useSeries(
      props,
      context,
      series,
    )
    // const icon: Ref<Icon
    dataReady(series)

    register(ChartType.series, props.id, ForceDirectedSeries, series)

    actionsConfig(s => ({
      idProp: [s, 'dataFields.id'],
      nameProp: [s, 'dataFields.name'],
      valueProp: [s, 'dataFields.value'],
      linkProp: [s, 'dataFields.linkWith'],
      colorProp: [s, 'dataFields.color'],
      childrenProp: [s, 'dataFields.children'],
      imageProp: [
        s,
        v => {
          if (v) {
            console.log('setting image prop')

            const icon = s.nodes.template.createChild(Image)
            const iconConfig = { ...ICON_DEFAULT, ...props.iconConfig }
            icon.propertyFields.href = props.imageProp
            icon.horizontalCenter = iconConfig.horizontalCenter
            icon.verticalCenter = iconConfig.verticalCenter
            icon.width = iconConfig.width
            icon.height = iconConfig.height
          }
        },
      ],

      pathProp: [
        s,
        v => {
          if (v) {
            console.log('setting svg path prop')
            if (props.imageProp && props.pathProp) {
              throw new AmchartError(
                `The container has set values for both pathProp and imageProp! Only one can be set at a time!`,
                `not-allowed`,
              )
            }

            const icon = s.nodes.template.createChild(Sprite)
            const iconConfig = { ...ICON_DEFAULT, ...props.iconConfig }
            icon.propertyFields.path = props.pathProp
            icon.horizontalCenter = iconConfig.horizontalCenter
            icon.verticalCenter = iconConfig.verticalCenter
            icon.width = iconConfig.width
            icon.height = iconConfig.height
          }
        },
      ],

      fontSize: [s, v => toNumber(v)],
      minRadius: [s, v => toNumberOrPercent(v, '1%')],
      maxRadius: [s, v => toNumberOrPercent(v, '8%')],
      centerStrength: [s, v => toNumber(v, 0.8)],
      maxLevels: [s, v => toNumber(v, undefined)],
      xProp: [s, 'nodes.template.propertyFields.x'],
      yProp: [s, 'nodes.template.propertyFields.y'],
      linkWidth: [s, 'links.template.strokeWidth', v => toNumber(v, undefined)],
      linkOpacity: [s, 'links.template.strokeOpacity', v => toNumber(v, 1)],
      distance: [s, 'links.template.distance', v => toNumber(v, 1.5)],
      disableLinks: [s, 'links.template.disabled'],
      manyBodyStrength: [s, v => toNumber(v, -12)],
      linkStrength: [s, 'links.template.strength', v => toNumber(v, 2)],

      label: [s, 'nodes.template.label.text'],
      labelFill: [s, 'nodes.template.label.fill', v => color(v)],
      labelDy: [s, 'nodes.template.label.dy', v => toNumber(v)],
      labelVAlign: [s, 'nodes.template.label.valign'],

      tooltipText: [s, 'nodes/template.tooltipText'],

      disableCircle: [s, 'nodes.template.circle.disabled'],
      disableOuterCircle: [s, 'nodes.template.outerCircle.disabled'],
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
