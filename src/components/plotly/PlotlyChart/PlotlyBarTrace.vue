<script lang="ts">
import { defineComponent, Ref, computed, watch, inject } from '@vue/composition-api'
import { PlotData } from 'plotly.js-dist'
import { plotDataSymbol } from '@/shared/plotly'

export default defineComponent({
  props: {
    traceData: { type: Object as () => Partial<PlotData>, required: true },
  },
  /**
   * Do not destructure context or you'll lose reactivity. This is a bug in the composition API plugin.
   * See https://github.com/vuejs/composition-api/issues/264
   */
  setup(props, context) {
    const plotData = inject(plotDataSymbol) as Ref<(Partial<PlotData> & { id: number })[]>
    const id = plotData.value.length

    const trace = computed(() => ({
      id,
      x: props.traceData.x,
      y: props.traceData.y,
      ...context.attrs,
      type: 'bar',
    })) as Ref<Partial<PlotData> & { id: number }>

    plotData.value.push(trace.value)

    watch(trace, newTrace => {
      const index = plotData.value.findIndex(t => t.id === id)
      plotData.value.splice(index, 1, newTrace)
    })
  },
  render(h) {
    return h()
  },
})
</script>
