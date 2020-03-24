import { PlotData } from 'plotly.js-dist'

export type IPlotData = PlotData & { id?: number }

export interface IPlotlyChart {
  plotData: IPlotData[]
}
