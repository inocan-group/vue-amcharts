import { Ref, inject, watch } from '@vue/composition-api'
import { PlotData } from 'plotly.js-dist'
import { plotDataSymbol } from '@/shared/plotly'

export const useSetupPlotlyTrace = (trace: Ref<Partial<PlotData> & { id?: number }>) => {
  const plotData = inject(plotDataSymbol) as Ref<(Partial<PlotData> & { id?: number })[]>
  const id = plotData.value.length

  trace.value.id = id

  plotData.value.push(trace.value)

  watch(trace, newTrace => {
    newTrace.id = id
    const index = plotData.value.findIndex(t => t.id === id)
    plotData.value.splice(index, 1, newTrace)
  })
}
