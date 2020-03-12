import { IChartConfigApi, IChart } from '../ChartTypes/chart-types'
import { onMounted, ref, Ref, reactive, onBeforeUnmount, computed } from '@vue/composition-api'
import * as am4core from '@amcharts/amcharts4/core'
import { Chart, Series } from '@amcharts/amcharts4/charts'
import { IDictionary } from 'common-types'
import { getChartData } from '../shared'

export function useChart<T extends Chart>(name: string, chartType: new () => T, props: IDictionary) {
  const chartdiv: Ref<HTMLElement | null> = ref(null)
  const chart: Ref<T | null> = ref(null)

  /** data which has been remotely loaded by chart */
  // const remoteData: Ref<IDictionary[]> = ref([])

  /**
   * Gets the chart data regardless of whether it came from the user of this
   * component directly or whether the consumer passed in a URL (and the
   * data needed to be loaded)
   */
  // const chartData = computed(() => {
  //   if (Array.isArray(props.data)) {
  //     return props.data as IDictionary[]
  //   }

  //   if (remoteData.value.length === 0) {
  //     getChartData(remoteData, props.data) // async get the data
  //   }

  //   return remoteData.value
  // })

  const chartData = computed(() => {
    return chart.value && chart.value.data ? chart.value.data : []
  })

  const configAxis: IChartConfigApi<T>['configAxis'] = (storage, config) => (
    name,
    constructor,
    dimension,
    callback,
    options = {},
  ) => {
    console.log(`Configuring ${name} axis on dimension ${dimension}`, storage)
    storage[dimension][name] = {
      constructor,
      options,
      callback,
    }
  }

  const configSeries: IChartConfigApi<T>['configSeries'] = (storage, config) => (
    name,
    constructor,
    callback,
    options,
  ) => {
    console.log(`Configuring ${name} series with the following options`, options)
    const instance = new constructor()
    storage[name] = {
      constructor,
      instance,
      callback,
      options,
    }

    return instance
  }

  const features: IDictionary<{ type: string; constructor: new () => any; options: IDictionary }> = reactive({})

  /**
   *
   */
  const addFeature = (name, type, constructor, options) => {
    features[name] = { type, constructor, options }
    return chart as Ref<IChart>
  }

  const configLegend: IChartConfigApi<T>['configLegend'] = options => config => {
    //
  }

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
    configAxis,
    configSeries,
    configLegend,
    drawChart,
    features,
    addFeature,
  }
}
