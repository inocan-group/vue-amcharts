<script lang="ts">
import { defineComponent, PropType, computed, Ref } from '@vue/composition-api'
import { useSetupPlotlySeries } from '@/composables/plotly'
import { IPlotData, IPlotlyChart } from '@/@types/plotly'

export default defineComponent({
  props: {
    seriesData: { type: Object as PropType<Pick<IPlotData, 'x' | 'y'>>, required: true },
  },
  /**
   * Do not destructure context or you'll lose reactivity. This is a bug in the composition API plugin.
   * See https://github.com/vuejs/composition-api/issues/264
   */
  setup(props, context) {
    const plotData = (context.parent as Vue & IPlotlyChart).plotData

    const series = computed(() => ({
      x: props.seriesData.x,
      y: props.seriesData.y,
      ...context.attrs,
      type: 'bar',
    })) as Ref<IPlotData>

    useSetupPlotlySeries(series, plotData)
  },
  render(h) {
    return h()
  },
})
</script>
