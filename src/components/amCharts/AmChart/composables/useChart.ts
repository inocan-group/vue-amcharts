import { ref, Ref, onBeforeUnmount, onMounted, SetupContext } from '@vue/composition-api'
import * as am4core from '@amcharts/amcharts4/core'
import { IDictionary } from 'common-types'
import { useRegistry } from '.'
import type { Chart } from '@amcharts/amcharts4/charts'
import { IChildWithCardinality } from './useRegistry/registry-types'
import { useData, IDataAfterChange, IUrlAfterChange } from './useData'

export function useChart<TChart extends Chart, TProps extends IDictionary>(chartType: new () => TChart, props: TProps, context: SetupContext, parentConfig: IChildWithCardinality[]) {
  const { registerAsParent } = useRegistry<TChart>(props, context)
  const { configureChildren, acceptChildRegistration, acceptChildMessage, registrants, cardinality, depSequence } = registerAsParent(parentConfig)
  const chartdiv: Ref<HTMLElement | null> = ref(null)
  const chart: Ref<TChart | null> = ref(null) // fake value; to be replaced onMounted
  const { dataReady, dataMeta } = useData<TProps, TChart>(props)
  const postDataChange: Ref<((fn: IDataAfterChange<TChart>)=> void) | null> = ref(null)
  const postUrlChange: Ref<((fn: IUrlAfterChange<TChart>)=> void) | null> = ref(null)

  onMounted(async () => {
    chart.value = am4core.create(chartdiv.value as HTMLElement, chartType)
    const data = dataReady(chart.value as TChart)
    // postDataChange.value = data.postDataChange
    // postUrlChange.value = data.postUrlChange
    await configureChildren(chart.value)
  })

  onBeforeUnmount(() => {
    chart.value?.dispose()
  })

  return {
    chart,
    chartdiv,
    dataMeta,
    acceptChildRegistration, 
    acceptChildMessage,
    registrants,
    cardinality,
    depSequence,
    postDataChange,
    postUrlChange
  }
}
