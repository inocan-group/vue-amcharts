<template>
  <div class="value-axis"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { useRegistry, useProps } from '../composables'
import { IDictionary } from 'common-types'
import { ValueAxis } from '@amcharts/amcharts4/charts'
import { percent } from '@amcharts/amcharts4/core'
import { allowUndefined } from '../helpers'
import { IRegistrationInfo } from '../composables/useRegistry/registry-types'
import { capitalize } from '../shared'

type XYChart = import('@amcharts/amcharts4/charts').XYChart

export default defineComponent({
  name: 'ValueAxis',
  props: {
    id: {
      type: String,
      default: 'primary',
    },
    name: {
      type: String,
      default: undefined,
    },
    /**
     * 'x', 'y' or 'z'.
     */
    dimension: {
      type: String,
      validator: v => ['y', 'x', 'z'].includes(v),
    },
    /**
     * A minimum value for the axis scale.
     */
    min: {
      type: [String, Number],
      default: undefined,
    },
    /**
     * A maximum value for the axis scale.
     */
    max: {
      type: [String, Number],
      default: undefined,
    },
    /**
     * Whether the scale is logarithmic.
     */
    logarithmic: {
      type: [String, Boolean],
      default: false,
    },
    numberFormat: {
      type: String,
      default: undefined,
    },
    secondaryAxes: {
      type: [Function, Object],
      default: undefined,
    },
    radius: {
      type: [Number, Object],
      default: () => percent(100),
    },
    innerRadius: {
      type: Number,
    },
    /**
     * A grid type to display: “circles” or “polygons”.
     */
    gridType: {
      type: String,
      default: 'circles',
    },
    /**
     * Minimum distance in pixels between grid elements.
     */
    minGridDistance: {
      type: Number,
      default: 30,
    },
    disableGrid: {
      type: Boolean,
      default: false,
    },
    /**
     * Disable (hide) the axis labels.
     */
    disableLabels: {
      type: Boolean,
      default: false,
    },
    /**
     * The axis line's stroke opacity.
     */
    strokeOpacity: {
      type: Number,
      default: 0,
    },
    /**
     * A stroke-dasharray for the stroke (outline). “Dasharray” allows setting rules to make lines dashed, dotted, etc.
     */
    strokeDasharray: {
      type: String,
    },
    options: {
      type: Object,
      default: () => {},
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const axis: Ref<ValueAxis> = ref(new ValueAxis())
    const { register, addToRegistration, howMany, onChartConfig, getChart, childReady } = useRegistry<XYChart>(
      props,
      context,
    )
    const { actionsConfig, initializeProps } = useProps<XYChart>(props, axis, getChart)
    const dataSource: Ref<string> = ref('')
    const instanceId: Ref<string> = ref('')
    const registeredAxis = (opt: IRegistrationInfo['parentOptions']) =>
      opt.fixedValues?.dimension ? `${opt.fixedValues.dimension}Axis` : props.dimension === 'x' ? 'xAxis' : 'yAxis'

    const response = register(registeredAxis, props.id, ValueAxis, axis)
    const notFirstOnAxis = howMany(response.type) > 1

    if (response.type !== `${props.dimension}Axis` && props.dimension) {
      console.warn(
        `Attempted to set dimension as '${props.dimension}' but this component always uses the 'x' dimension.`,
      )
    }

    actionsConfig(a => ({
      name: [a, 'title.text'],
      logarithmic: [a, (v: boolean) => Boolean(v)],
      min: [a, v => allowUndefined(v), () => a.invalidateRawData()],
      max: [a, v => allowUndefined(v), () => a.invalidateRawData()],
      radius: [a, 'renderer.radius', v => allowUndefined(v), () => a.invalidate()],
      innerRadius: [a, 'renderer.innerRadius', v => allowUndefined(v), () => a.invalidate()],
      gridType: [a, 'renderer.gridType', v => v, () => a.invalidate()],
      minGridDistance: [a, 'renderer.minGridDistance', v => allowUndefined(v), () => a.invalidateData()],
      disableGrid: [a, 'renderer.grid.template.disabled'],
      disableLabels: [a, 'renderer.labels.template.disabled'],
      strokeOpacity: [a, 'renderer.line.strokeOpacity'],
      strokeDasharray: [a, 'renderer.line.strokeDasharray'],
      // numberFormat: [a, 'renderer.axis.numberFormatter.outputFormat'],
    }))

    onChartConfig(chart => {
      // const dimension = props.dimension === 'x' ? chart.xAxes : chart.yAxes
      const registeredType = response.type
      const dimension = registeredType === 'xAxis' ? chart.xAxes : chart.yAxes
      axis.value = dimension.push(axis.value)
      initializeProps()

      // When secondary axis are added; we have certain default behavior
      // (assuming there isn't an explicit definition)
      if (notFirstOnAxis && !props.secondaryAxes) {
        axis.value.renderer.opposite = true
        axis.value.renderer.grid.template.strokeOpacity = 0
      } else if (props.secondaryAxes !== undefined) {
        // TODO: implement this
      }

      const accessibility = { axis: registeredType, dataField: `value${capitalize(registeredType[0])}` }
      addToRegistration(accessibility)
      addToRegistration('id', axis.value.uid)
      addToRegistration('dataSource', axis.value.dataSource.uid)
      addToRegistration('data', axis.value.data)
      dataSource.value = axis.value.dataSource.uid
      instanceId.value = axis.value.uid
    })

    childReady()

    return {
      instance: axis,
      dataSource,
      instanceId,
    }
  },
})
</script>

<style scoped>
.value-axis {
  opacity: 1;
}
</style>
