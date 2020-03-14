import { IChart } from '../ChartTypes/chart-types'
import { onMounted, ref, Ref, reactive, onBeforeUnmount, computed } from '@vue/composition-api'
import * as am4core from '@amcharts/amcharts4/core'
import { Chart } from '@amcharts/amcharts4/charts'
import { IDictionary } from 'common-types'

type Legend = import('@amcharts/amcharts4/charts').Legend

export function useChart<T extends Chart>(name: string, chartType: new () => T, props: IDictionary) {
  const chartdiv: Ref<HTMLElement | null> = ref(null)
  const chart: Ref<T | null> = ref(null)
  const legend: Ref<null | Legend> = ref(null)

  const chartData = computed(() => {
    return chart.value && chart.value.data ? chart.value.data : []
  })

  const drawChart = () => {
    chart.value = am4core.create<T>(chartdiv.value as HTMLElement, chartType)
    // legend.value = chart.value?.legend ? chart.value.legend : null
  }

  onBeforeUnmount(() => {
    chart.value?.dispose()
  })

  return {
    chart,
    chartData,
    chartdiv,
    drawChart,
    legend,
  }
}
