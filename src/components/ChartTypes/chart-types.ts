import type { XYChart, PieChart } from '@amcharts/amcharts4/charts'

export type IChart = XYChart | PieChart



export interface IChartReceiveRegistration<T> {
  foo?: string
}

export enum ChartChildren {
  axis = 'axis',
  series = 'series',
  legend = 'legend',
  cursor = 'cursor',
  addons = 'addon',
  adaptor = 'adaptor',
}

export enum AxisDimension {
  x = 'x',
  y = 'y',
  z = 'z',
}

export type ByAxisDimension<T> = { x: T } | { y: T } | { z: T }

export interface ILegendDefinition {
  foo?: string
}
