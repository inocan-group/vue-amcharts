import { ref, Ref, onBeforeUnmount, onMounted, SetupContext } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { useRegistry, useProps } from '../index'
import { ConstructorFor } from '../useRegistry/registry-types'
import { useData, removeEventClass, IPropertyMeta } from '../useData'
import { useInitialize } from '../useInitialize'
import { unbox } from '../../shared'
import { IRegistryOptions, noRegistrationOptions } from './chart-types'
import { create, Percent } from '@amcharts/amcharts4/core'
import { toNumberOrPercent } from '@/components/helpers'

type Chart = import('@amcharts/amcharts4/charts').Chart

export function useChart<TChart extends Chart, TProps extends IDictionary>(
  chartType: ConstructorFor<TChart>,
  props: TProps,
  context: SetupContext,
  parentConfig: IRegistryOptions,
  propMeta?: IPropertyMeta<TProps>,
) {
  const { registerAsParent } = useRegistry<TChart>(props, context)
  const {
    configureChildren,
    acceptChildRegistration,
    acceptChildMessage,
    registrants,
    cardinality,
    depSequence,
  } = registerAsParent(
    noRegistrationOptions(parentConfig) ? parentConfig : parentConfig.cardinality,
    noRegistrationOptions(parentConfig)
      ? { fixedValues: {}, defaultValues: {}, parentContext: {} }
      : parentConfig.options,
  )

  const chartdiv: Ref<HTMLElement | null> = ref(null)
  const chart: Ref<TChart | null> = ref(null) // fake value; to be replaced onMounted
  const { dataReady, dataMeta, chartData, postDataChange, postUrlChange } = useData<TProps, TChart>(props)
  const { onPropChange, respondTo, actionsConfig, initializeProps } = useProps(props, chart as Ref<TChart>, () => {
    const c = unbox(chart)

    return c === null ? {} : c
  })
  let chartMountedCallback: (chart: TChart) => void | Promise<void>

  onMounted(async () => {
    chart.value = create(chartdiv.value as HTMLElement, chartType)
    dataReady(chart.value as TChart, propMeta)
    chart.value.width = props.width ? (toNumberOrPercent(props.width) as number | Percent) : new Percent(100)
    chart.value.height = props.height ? (toNumberOrPercent(props.height) as number | Percent) : new Percent(100)
    initializeProps()
    if (props.initialize) {
      useInitialize(props, chart)
    }
    await configureChildren(chart.value)
    if (chartMountedCallback) {
      chartMountedCallback(chart.value as TChart)
    }
  })

  /**
   * Allows the chart component to do work once it is ensured
   * that the chart object now resides in the DOM and all children
   * are configured
   */
  const onChartMounted = (fn: (chart: TChart) => void | Promise<void>) => {
    chartMountedCallback = fn
  }

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
    respondTo,
  }
}
