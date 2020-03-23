import { Ref, watch } from '@vue/composition-api'
import { IPlotData } from '@/@types/plotly'

export const useSetupPlotlySeries = (series: Ref<IPlotData>, plotData: IPlotData[]) => {
  const id = plotData.length

  series.value.id = id

  plotData.push(series.value)

  watch(series, newSeries => {
    newSeries.id = id
    const index = plotData.findIndex(t => t.id === id)
    plotData.splice(index, 1, newSeries)
  })
}
