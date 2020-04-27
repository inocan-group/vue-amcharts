import { Ref, SetupContext, onBeforeUnmount } from '@vue/composition-api'
import { Axis, LineSeries, ColumnSeries, Series } from '@amcharts/amcharts4/charts'
import { IDictionary } from 'common-types'
import { useRegistry } from './useRegistry/useRegistry'
import { AmchartError } from '../errors'
import { useData, removeEventClass, ILooksLikeChart } from './useData'
import { useProps } from '.'

export const seriesProps = {
  id: {
    type: String,
    default: 'default',
  },
  name: {
    type: String,
    default: '',
  },
  xProp: {
    type: String,
    default: '',
  },
  xAxis: {
    type: String,
    default: undefined,
  },
  yProp: {
    type: String,
    default: undefined,
  },
  yAxis: {
    type: String,
    default: undefined,
  },
  /** the text of the tooltip, which can include { variable } names too */
  tooltipText: {
    type: String,
    default: '',
  },
  show: {
    validator: (v: string | boolean) => [true, false].includes(Boolean(v)),
    default: true,
  },
  stroke: {
    type: String,
    default: undefined,
  },
  fill: {
    type: String,
    default: undefined,
  },
  fillOpacity: {
    type: Number,
    default: 1,
  },
  strokeWidth: {
    type: Number,
    default: undefined,
  },
  strokeOpacity: {
    type: Number,
    default: 1,
  },
  /**
   * Hook into the chart object prior to being added to the
   * DOM. Function will receive a reactive object of the
   * form `(chart: Ref<SeriesObject>): void`.
   *
   * The function will effect change by changing the reactive object and
   * this will automatically update the object which will be used. You _could_
   * keep a reference to this object and manage state after the initialization
   * but this is strongly discouraged; instead users should leverage the
   * `addProperty` functionality
   */
  initialize: {
    type: Function,
    default: undefined,
  },
}

/**
 * Takes the following actions for series components:
 *
 * - registers as a child (passes back registry functions and lifecycle hooks)
 * - handles unmounting/disposing amChart series component when removed from DOM
 * - provides a `setupAxes` method for XY series
 *
 * @param props the reactive _props_ dictionary passed into the Vue component
 * @param context the `SetupContext` provided to every Vue component
 * @param series the working instance of a _series_ class
 */
export function useSeries<
  TProps extends IDictionary,
  TComponent,
  TChart extends ILooksLikeChart<any> = ILooksLikeChart<any>
>(
  props: TProps,
  context: SetupContext,
  series: Ref<TComponent>,
  /** if the parent chart object is a KNOWN type then pass in the constructor for typing benefits */
  chartConstructor?: new () => TChart,
) {
  const {
    register,
    onChartConfig,
    getRegistration,
    getComponent,
    firstComponentName,
    addToRegistration,
    getChart,
    childReady,
  } = useRegistry<TChart, TComponent>(props, context)
  const { onPropChange, respondTo, actionsConfig, initializeProps } = useProps(props, series, getChart)
  const { dataReady, dataMeta, postDataChange, postUrlChange, chartData } = useData(props)

  const setupAxes = (series: Ref<LineSeries | ColumnSeries>) => {
    // data validation
    if (!props.xProp && series.value.className !== 'CandlestickSeries') {
      throw new AmchartError(`The ${props.id} series does not define a "xProp" property!`, 'no-data-field')
    }
    if (!props.yProp && series.value.className !== 'CandlestickSeries') {
      throw new AmchartError(`The ${props.id} series does not define a "yProp" property!`, 'no-data-field')
    }

    // get axis, even if just the default axis
    const y = getRegistration('yAxis', props.yAxis)
    const x = getRegistration('xAxis', props.xAxis)

    // assign the axis to the series
    const xAxis: Axis = getComponent<Axis>('xAxis', props.xAxis)
    series.value.xAxis = xAxis
    const yAxis: Axis = getComponent<Axis>('yAxis', props.yAxis)
    series.value.yAxis = yAxis

    // validate that the Axis is providing a dataField
    if (!x.dataField) {
      throw new AmchartError(
        `While trying to associate the ${
          props.id
        } series with the x-Axis; noticed that the Axis does not expose the "dataField" field in its registration! Properties exposed: ${Object.keys(
          x,
        )}`,
        `invalid-registry`,
      )
    }
    if (!y.dataField) {
      throw new AmchartError(
        `While trying to associate the ${props.id} series with the y-Axis; noticed that the Axis does not expose the "dataField" field in its registration! `,
        `invalid-registry`,
      )
    }

    // associate series props to appropriate dataField
    if (series.value.className !== 'CandlestickSeries') {
      switch (y.dataField) {
        case 'valueY':
          series.value.dataFields.valueY = props.yProp
          break
        case 'dateY':
          series.value.dataFields.dateY = props.yProp
          break
        case 'categoryY':
          series.value.dataFields.categoryY = props.yProp
          break
        default:
          throw new AmchartError(
            `The dataField type of "${y.dataField}" for the Y-axis is unknown!`,
            'unknown-data-field',
          )
      }

      switch (x.dataField) {
        case 'valueX':
          series.value.dataFields.valueX = props.xProp
          break
        case 'dateX':
          series.value.dataFields.dateX = props.xProp
          break
        case 'categoryX':
          series.value.dataFields.categoryX = props.xProp
          break
        default:
          console.warn(`The dataField type of "${x.dataField}" for the Y axis is unknown!`)
      }
    }

    return {
      x: {
        axisUid: xAxis?.uid,
        dataSource: xAxis.dataSource?.uid,
        dataField: x.dataField,
        opposite: xAxis.renderer.opposite,
        dataProp: props.xProp,
        axisId: props.yAxis || firstComponentName('xAxis'),
      },
      y: {
        axisUid: yAxis?.uid,
        dataSource: yAxis.dataSource?.uid,
        dataField: y.dataField,
        opposite: yAxis.renderer.opposite,
        dataProp: props.yProp,
        axisId: props.yAxis || firstComponentName('yAxis'),
      },
    }
  }

  onBeforeUnmount(() => {
    removeEventClass(dataMeta.value.sourceClass)
    if (dataMeta.value?.source?.dispose) dataMeta.value.source.dispose()
  })

  return {
    dataReady,
    getChart,
    chartData,
    childReady,
    setupAxes,
    addToRegistration,
    register,
    onChartConfig,
    dataMeta,
    postDataChange,
    postUrlChange,
    onPropChange,
    respondTo,
    initializeProps,
    actionsConfig,
    getRegistration,
    getComponent,
  }
}
