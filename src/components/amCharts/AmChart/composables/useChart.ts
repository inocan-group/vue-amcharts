import { IChartConfigApi, IChart } from '../ChartTypes/chart-types'
import { onMounted, ref, Ref, reactive, onBeforeUnmount, computed } from '@vue/composition-api'
import * as am4core from '@amcharts/amcharts4/core'
import { Chart } from '@amcharts/amcharts4/charts'
import { IDictionary } from 'common-types'

export function useChart<T extends Chart>(name: string, chartType: new () => T, props: IDictionary) {
  const chartdiv: Ref<HTMLElement | null> = ref(null)
  const chart: Ref<T | null> = ref(null)

  const chartData = computed(() => {
    return chart.value && chart.value.data ? chart.value.data : []
  })

  // const configAxis: IChartConfigApi<T>['configAxis'] = (storage, config) => (
  //   name,
  //   constructor,
  //   dimension,
  //   callback,
  //   options = {},
  // ) => {
  //   console.log(`Configuring ${name} axis on dimension ${dimension}`, storage)
  //   storage[dimension][name] = {
  //     constructor,
  //     options,
  //     callback,
  //   }
  // }

  // const configSeries: IChartConfigApi<T>['configSeries'] = (storage, config) => (
  //   name,
  //   constructor,
  //   callback,
  //   options,
  // ) => {
  //   console.log(`Configuring ${name} series with the following options`, options)
  //   const instance = new constructor()
  //   storage[name] = {
  //     constructor,
  //     instance,
  //     callback,
  //     options,
  //   }

  //   return instance
  // }

  // const features: IDictionary<{ type: string; constructor: new () => any; options: IDictionary }> = reactive({})

  // /**
  //  *
  //  */
  // const addFeature = (name, type, constructor, options) => {
  //   features[name] = { type, constructor, options }
  //   return chart as Ref<IChart>
  // }

  // const configLegend: IChartConfigApi<T>['configLegend'] = options => config => {
  //   //
  // }

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
    // configAxis,
    // configSeries,
    // configLegend,
    drawChart,
    // features,
    // addFeature,
  }
}
