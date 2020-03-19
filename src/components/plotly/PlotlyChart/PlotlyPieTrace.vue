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
      values: props.traceData.values,
      labels: props.traceData.labels,
      ...context.attrs,
      type: 'pie',
    })) as Ref<Partial<PlotData>>

    useSetupPlotlyTrace(trace)
  },
  render(h) {
    return h()
  },
})
</script>
