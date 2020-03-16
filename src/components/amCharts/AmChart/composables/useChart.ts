import { IChart } from '../ChartTypes/chart-types'
import { ref, Ref, onBeforeUnmount, computed } from '@vue/composition-api'
import * as am4core from '@amcharts/amcharts4/core'
import { Chart } from '@amcharts/amcharts4/charts'
import { IDictionary } from 'common-types'

export function useChart<T extends Chart>(name: string, chartType: new () => T, props: IDictionary) {
  const chartdiv: Ref<HTMLElement | null> = ref(null)
  const chart: Ref<T | null> = ref(null)

  const chartData = computed(() => {
    return chart.value && chart.value.data ? chart.value.data : []
  })

  const drawChart = () => {
    chart.value = am4core.create<T>(chartdiv.value as HTMLElement, chartType)
  }

  onBeforeUnmount(() => {
    chart.value?.dispose()
  })

  return {
    chart,
    chartData,
    chartdiv,
    drawChart,
  }
}
