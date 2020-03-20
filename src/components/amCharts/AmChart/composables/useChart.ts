import { IChart } from '../ChartTypes/chart-types'
import { ref, Ref, onBeforeUnmount, computed } from '@vue/composition-api'
import * as am4core from '@amcharts/amcharts4/core'
import { Chart } from '@amcharts/amcharts4/charts'
import { IDictionary } from 'common-types'

export function useChart<T extends Chart>(name: string, chartType: new () => T, props: IDictionary) {
  const chartdiv: Ref<HTMLElement | null> = ref(null)
  const chart: Ref<T> = ref({} as T) // fake value; to be replaced onMounted

  const drawChart = () => {
    const earlyData = chart.value.data
    if (earlyData) console.log('Early data', earlyData)

    chart.value = am4core.create<T>(chartdiv.value as HTMLElement, chartType)
    if (earlyData) {
      chart.value.data = earlyData
    }
  }

  onBeforeUnmount(() => {
    chart.value?.dispose()
  })

  return {
    chart,
    chartdiv,
    drawChart,
  }
}
