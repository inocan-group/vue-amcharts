import { Ref } from '@vue/composition-api'
import { Axis } from '@amcharts/amcharts4/charts'
import { IDictionary } from 'common-types'
import { IChartSeries } from '..'
import { XyChart, PieChart } from '.'

export interface IChartChildApi<T> {
  chartdiv: Ref<HTMLElement | null>
  chart: Ref<T | null>
  /**
   * Allows an axis component to register itself with the chart
   */
  addAxis<A>(
    name: string,
    constructor: new () => A,
    dimension: AxisDimension,
    callback?: (axis: A) => any,
    options?: IDictionary,
  ): void
  /**
   * The series
   */
  addSeries<S extends IChartSeries>(
    name: string,
    constructor: new () => S,
    callback?: (series: S) => any,
    options?: IDictionary,
  ): S
  /**
   * Allows an axis component to register itself with the chart
   */
  addLegend(options?: IDictionary): void

  addFeature(name: string, type: new () => any, instance: any): Ref<IChart>

  series: IDictionary<ISeriesDefinition<any>>
}

export type IChart = XyChart | PieChart

export interface IXyChartSlotProps {
  xAxis: IDictionary<IAxisDefinition<any>>
  yAxis: IDictionary<IAxisDefinition<any>>
  series: IDictionary<ISeriesDefinition<any>>
  legend: ILegendDefinition
}

export interface IChartConfigApi<T> {
  configAxis<A>(
    storage: ByAxisDimension<IDictionary<IAxisDefinition<any>>>,
    config: IDictionary,
  ): IChartChildApi<T>['addAxis']
  configSeries<S>(storage: IDictionary<ISeriesDefinition<S>>, config: IDictionary): IChartChildApi<T>['addSeries']
  configLegend(config?: IDictionary): IChartChildApi<T>['addLegend']
}

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

export interface IAxisDefinition<A extends Axis> {
  name: string
  /** the class constructor for this type of axis */
  constructor: new () => A
  /** the instance of the axis class which is being used to represent this axis */
  instance?: Ref<A>
  options: IDictionary
  dimension: AxisDimension
  callback?: (axis: A) => any
}

export interface IAxisStorageConfig<A> {
  x?: IDictionary<IAxisDefinition<any>>
  y?: IDictionary<IAxisDefinition<any>>
  z?: IDictionary<IAxisDefinition<any>>
}

export type ByAxisDimension<T> = { x: T } | { y: T } | { z: T }

export interface ISeriesDefinition<S> {
  options: IDictionary<any>
  constructor: new () => S
  /** an instance of the _series_ class defined by `S` */
  instance: S
  /** a callback back to the component which passes back the instance once it's ready */
  callback?: (series: IChartSeries) => any
}

export interface ILegendDefinition {
  foo?: string
}
