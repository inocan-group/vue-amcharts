
import { Ref, SetupContext } from '@vue/composition-api'
import type { Axis, LineSeries, ColumnSeries } from '@amcharts/amcharts4/charts'
import { IDictionary } from 'common-types'
import { useRegistry } from './useRegistry/useRegistry'
import { AmchartError } from '../errors'

export function useSeries(props: IDictionary, context: SetupContext) {
  const { getRegistration, getComponent, firstComponentName } = useRegistry(props, context)

  const setupAxes = (series: Ref<LineSeries | ColumnSeries>) => {
    // data validation
    if (!props.xProp) {
      throw new AmchartError(`The ${props.id} series does not define a "xProp" property!`, 'no-data-field')
    }
    if (!props.yProp) {
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
    if(!x.dataField) {
      throw new AmchartError(`While trying to associate the ${props.id} series with the x-Axis; noticed that the Axis does not expose the "dataField" field in its registration! Properties exposed: ${Object.keys(x)}`,`invalid-registry`)
    }
    if(!y.dataField) {
      throw new AmchartError(`While trying to associate the ${props.id} series with the y-Axis; noticed that the Axis does not expose the "dataField" field in its registration! `,`invalid-registry`)
    }

    // associate series props to appropriate dataField
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
        throw new AmchartError(`The dataField type of "${y.dataField}" for the Y-axis is unknown!`, 'unknown-data-field')
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

    (series.value as LineSeries).events.once("dataitemsvalidated", (e)=> {
      console.log(`Data items validated for series ${props.id}:`, {data: e.target.data, dataSetId: e.target.currentDataSetId, isInvalid: e.target.dataInvalid, parent: e.target.parent?.config, theSame: e.target === series.value})
      
    })

    return {
      x: { axisUid: xAxis.uid, dataSource: xAxis.dataSource.uid, dataField: x.dataField, opposite: xAxis.renderer.opposite, dataProp: props.xProp, axisId: props.yAxis || firstComponentName('xAxis') },
      y: { axisUid: yAxis.uid, dataSource: yAxis.dataSource.uid, dataField: y.dataField, opposite: yAxis.renderer.opposite, dataProp: props.yProp, axisId: props.yAxis || firstComponentName('yAxis') },
    }

  }

  return { setupAxes }
}
