import {
  LineSeries,
  ColumnSeries,
  CandlestickSeries,
  OHLCSeries,
  ColumnSeries3D,
  ConeSeries,
  CurvedColumnSeries,
  StepLineSeries,
} from '@amcharts/amcharts4/charts'

export interface XYSeriesOptions {
  xAxis: string
  yAxis: string
}

export type IChartSeries =
  | LineSeries
  | ColumnSeries
  | CandlestickSeries
  | OHLCSeries
  | ColumnSeries3D
  | ConeSeries
  | CurvedColumnSeries
  | StepLineSeries
