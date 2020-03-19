<script lang="ts">
import { defineComponent, PropType, computed, Ref } from '@vue/composition-api'
import { PlotData } from 'plotly.js-dist'
import { useSetupPlotlyTrace } from '@/composables/plotly'

export default defineComponent({
  props: {
    traceData: { type: Object as PropType<Partial<PlotData>>, required: true },
  },
  /**
   * Do not destructure context or you'll lose reactivity. This is a bug in the composition API plugin.
   * See https://github.com/vuejs/composition-api/issues/264
   */
  setup(props, context) {
    const trace = computed(() => ({
      x: props.traceData.x,
      y: props.traceData.y,
      ...context.attrs,
      type: 'scatter',
      mode: context.attrs.mode ?? 'markers',
    })) as Ref<Partial<PlotData>>

    useSetupPlotlyTrace(trace)
  },
  render(h) {
    return h()
  },
})
</script>
