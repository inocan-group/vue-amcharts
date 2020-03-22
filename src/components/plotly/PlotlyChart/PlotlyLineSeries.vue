<script lang="ts">
import { defineComponent, PropType, computed, Ref } from '@vue/composition-api'
import { PlotData } from 'plotly.js-dist'
import { useSetupPlotlySeries } from '@/composables/plotly'

export default defineComponent({
  props: {
    seriesData: { type: Object as PropType<Partial<PlotData>>, required: true },
  },
  /**
   * Do not destructure context or you'll lose reactivity. This is a bug in the composition API plugin.
   * See https://github.com/vuejs/composition-api/issues/264
   */
  setup(props, context) {
    const series = computed(() => ({
      x: props.seriesData.x,
      y: props.seriesData.y,
      ...context.attrs,
      type: 'scatter',
      mode: context.attrs.mode ?? 'lines',
    })) as Ref<Partial<PlotData>>

    useSetupPlotlySeries(series)
  },
  render(h) {
    return h()
  },
})
</script>
