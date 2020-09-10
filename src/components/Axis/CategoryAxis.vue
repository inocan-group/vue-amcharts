<template>
  <div class="category-axis"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'
import { useRegistry, useProps } from '../composables'
import { IDictionary } from 'common-types'
import { CategoryAxis } from '@amcharts/amcharts4/charts'
import { percent } from '@amcharts/amcharts4/core'
import { allowUndefined } from '../helpers'
import { IRegistrationInfo } from '../composables/useRegistry/registry-types'
import { capitalize } from '../shared'

type XYChart = import('@amcharts/amcharts4/charts').XYChart

export default defineComponent({
  name: 'CategoryAxis',
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
      validator: v => ['y', 'x', 'z'].includes(v),
    },
    /**
     * The field in a dataset that holds category names.
     */
    category: {
      type: String,
    },
    secondaryAxes: {
      type: [Function, Object],
      default: undefined,
    },
    /**
     * Horizontal tension for the spline. Used by the line smoothing algorithm.
     */
    tensionX: {
      type: Number,
      default: 1,
    },
    /**
     *  Vertical tension for the spline. Used by the line smoothing algorithm.
     */
    tensionY: {
      type: Number,
      default: 1,
    },
    /**
     * Minimum distance in pixels between grid elements.
     */
    minGridDistance: {
      type: Number,
    },
    disableGrid: {
      type: Boolean,
      default: false,
    },
    controlPoints: {
      type: Array,
    },
    radius: {
      type: [Number, Object],
      default: () => percent(100),
    },
    innerRadius: {
      type: Number,
    },

    options: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const axis: Ref<CategoryAxis> = ref(new CategoryAxis())
    const { register, addToRegistration, howMany, onChartConfig, getChart, childReady } = useRegistry<XYChart>(
      props,
      context,
    )
    const { actionsConfig, initializeProps } = useProps<XYChart>(props, axis, getChart)
    const dataSource: Ref<string> = ref('')
    const instanceId: Ref<string> = ref('')
    const registeredAxis = (opt: IRegistrationInfo['parentOptions']) =>
      opt.fixedValues?.dimension ? `${opt.fixedValues.dimension}Axis` : props.dimension === 'x' ? 'xAxis' : 'yAxis'

    const response = register(registeredAxis, props.id, CategoryAxis, axis)
    const notFirstOnAxis = howMany(response.type) > 1

    if (response.type !== `${props.dimension}Axis` && props.dimension) {
      console.warn(
        `Attempted to set dimension as '${props.dimension}' but this component always uses the 'x' dimension.`,
      )
    }

    actionsConfig(a => ({
      name: [a, 'title.text'],
      category: [a, 'dataFields.category'],
      disableGrid: [a, 'renderer.grid.template.disabled'],
      tensionX: [a, 'renderer.polyspline.tensionX', v => v, () => a.invalidateData()],
      tensionY: [a, 'renderer.polyspline.tensionY', v => v, () => a.invalidateData()],
      controlPoints: [a, 'renderer.points', v => v, () => a.invalidateData()],
      radius: [a, 'renderer.radius', v => allowUndefined(v), () => a.invalidate()],
      innerRadius: [a, 'renderer.innerRadius', v => allowUndefined(v), () => a.invalidate()],
    }))

    onChartConfig(chart => {
      const registeredType = response.type
      const dimension = props.dimension === 'x' ? chart.xAxes : chart.yAxes
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

      const accessibility = { axis: `${props.dimension}Axis`, dataField: `category${capitalize(registeredType[0])}` }
      addToRegistration(accessibility)
      addToRegistration('id', axis.value.uid)
      addToRegistration('dataSource', axis.value.dataSource.uid)
      addToRegistration('data', axis.value.data)
      addToRegistration('category', axis.value.dataFields.category)
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
.category-axis {
  opacity: 1;
}
</style>
