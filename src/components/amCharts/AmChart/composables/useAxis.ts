import { IChartChildApi, AxisDimension } from '../ChartTypes/chart-types'
import { onMounted, ref, Ref, SetupContext } from '@vue/composition-api'
import { Axis, Chart, IAxisProperties } from '@amcharts/amcharts4/charts'
import { IDictionary } from 'common-types'

export function useAxis<T extends Axis>(props: IDictionary, context: SetupContext) {
  const parent = context.parent as IChartChildApi<any>
  const chart: Ref<Chart> = parent.chart
  const axis: Ref<T | null> = ref(null)

  const register = (constructor: new () => T) => {
    parent.addAxis(props.name, constructor, props.dimension as AxisDimension, (ax: T) => {
      axis.value = ax
    })
  }

  return {
    register,
    chart,
    axis,
  }
}
