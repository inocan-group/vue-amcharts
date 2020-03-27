import { ref, Ref, onBeforeUnmount, onMounted, SetupContext } from '@vue/composition-api'
import * as am4core from '@amcharts/amcharts4/core'
import { IDictionary } from 'common-types'
import { useRegistry, useProps } from './index'
import type { Chart } from '@amcharts/amcharts4/charts'
import { IChildWithCardinality, ConstructorFor } from './useRegistry/registry-types'
import { useData, removeEventClass } from './useData'
import { unbox } from '../shared'
import { AmchartError } from '../errors'

export function useChart<TChart extends Chart, TProps extends IDictionary>(chartType: ConstructorFor<TChart>, props: TProps, context: SetupContext, parentConfig: IChildWithCardinality[]) {
  const { registerAsParent } = useRegistry<TChart>(props, context)
  const { configureChildren, acceptChildRegistration, acceptChildMessage, registrants, cardinality, depSequence } = registerAsParent( parentConfig )

  const chartdiv: Ref<HTMLElement | null> = ref(null)
  const chart: Ref<TChart | null> = ref(null) // fake value; to be replaced onMounted
  const { dataReady, dataMeta, chartData, postDataChange, postUrlChange } = useData<TProps, TChart>(props)
  const { onPropChange, respondTo, actionsConfig } = useProps(props, chart as Ref<TChart>, () => {
    const c = unbox(chart)

    return c === null ? {} : c
  })
  let chartMountedCallback: (chart: TChart) => void | Promise<void>

  onMounted(async () => {
    chart.value = am4core.create(chartdiv.value as HTMLElement, chartType)
    dataReady(chart.value as TChart)
    await configureChildren(chart.value)
    if(chartMountedCallback) {
      chartMountedCallback(chart.value as TChart)
    }
  })

  /**
   * Allows the chart component to do work once it is ensured
   * that the chart object now resides in the DOM and all children
   * are configured
   */
  const onChartMounted = ((fn: (chart: TChart) => void | Promise<void>) => {
    chartMountedCallback = fn
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
    postUrlChange,
    onChartMounted,
    onPropChange,
    actionsConfig,
    respondTo
  }
}
