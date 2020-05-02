import { Axis } from '@amcharts/amcharts4/charts'
import { AxisDimension } from '../ChartTypes/chart-types'

export interface IAxisApi<T extends Axis> {
  /**
   * When the chart becomes mounted, it will signal to the axis that it is
   * ready and pass all of it's Vue reactive properties along with
   */
  ready(): T
}

export interface IValueAxisProps {
  name: string
  dimension: keyof typeof AxisDimension
}
