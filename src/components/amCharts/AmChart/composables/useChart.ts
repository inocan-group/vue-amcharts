import { ref, Ref, onBeforeUnmount, onMounted, SetupContext } from '@vue/composition-api'
import * as am4core from '@amcharts/amcharts4/core'
import { IDictionary } from 'common-types'
import { useRegistry } from '.'
import type { Chart } from '@amcharts/amcharts4/charts'
import { IChildWithCardinality } from './useRegistry/registry-types'
import { useData, removeEventClass } from './useData'

export function useChart<TChart extends Chart, TProps extends IDictionary>(chartType: new () => TChart, props: TProps, context: SetupContext, parentConfig: IChildWithCardinality[]) {
  const { registerAsParent } = useRegistry<TChart>(props, context)
  const { configureChildren, acceptChildRegistration, acceptChildMessage, registrants, cardinality, depSequence } = registerAsParent(parentConfig)
  const chartdiv: Ref<HTMLElement | null> = ref(null)
  const chart: Ref<TChart | null> = ref(null) // fake value; to be replaced onMounted
  const { dataReady, dataMeta, chartData, postDataChange, postUrlChange } = useData<TProps, TChart>(props)

  onMounted(async () => {
    chart.value = am4core.create(chartdiv.value as HTMLElement, chartType)
    
    await configureChildren(chart.value)
    dataReady(chart.value as TChart)
  })

  onBeforeUnmount(() => {
    chart.value?.dispose()
    removeEventClass(dataMeta.value.sourceClass)
  })

  const chartIsReady = (c: Ref<TChart | null>): c is Ref<TChart> => {
    return c.value !== null
  }

  return {
    chart,
    chartIsReady,
    chartdiv,
    dataMeta,
    chartData,
    acceptChildRegistration, 
    acceptChildMessage,
    registrants,
    cardinality,
    depSequence,
    postDataChange,
    postUrlChange
  }
}
