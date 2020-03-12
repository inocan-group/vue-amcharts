import { IChartChildApi, AxisDimension } from '../ChartTypes/chart-types'
import { ref, Ref, SetupContext } from '@vue/composition-api'
import { Chart } from '@amcharts/amcharts4/charts'
import { IDictionary } from 'common-types'
import { IChartSeries } from '../Series'

export function useSeries(props: IDictionary, context: SetupContext) {
  const parent = context.parent as IChartChildApi<any>
  const chart: Ref<Chart> = parent.chart

  const register = <T extends IChartSeries>(constructor: new () => T, options: IDictionary) => {
    let series: Ref<T>

    return parent.addSeries(
      props.name,
      constructor,
      (seriesInstance: T) => {
        series = ref(seriesInstance)
      },
      options,
    )
  }

  return {
    register,
    chart,
  }
}
