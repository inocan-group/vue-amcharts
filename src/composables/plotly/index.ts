import { Ref, inject, watch } from '@vue/composition-api'
import { PlotData } from 'plotly.js-dist'
import { plotDataSymbol } from '@/shared/plotly'

export const useSetupPlotlySeries = (series: Ref<Partial<PlotData> & { id?: number }>) => {
  const plotData = inject(plotDataSymbol) as Ref<(Partial<PlotData> & { id?: number })[]>
  const id = plotData.value.length

  series.value.id = id

  plotData.value.push(series.value)

  watch(series, newSeries => {
    newSeries.id = id
    const index = plotData.value.findIndex(t => t.id === id)
    plotData.value.splice(index, 1, newSeries)
  })
}
