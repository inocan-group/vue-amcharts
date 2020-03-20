import { IDictionary, ms } from 'common-types'
import { CSVParser, JSONParser, DataSource } from '@amcharts/amcharts4/core'
import { ILooksLikeChart, IUrlInfo } from '../composables'
import { Ref } from '@vue/composition-api'
import get from 'lodash.get'

export interface IApiConfig<TData = IDictionary[], TOutput = TData> {
  format?: 'json' | 'csv'
  /**
   * If you want to only process a child node of the returned dataset you can state
   * a "dotted" path to the starting point for data.
   *
   * ```typescript
   * {
   *   offset: 'results.2020-03-10.details'
   * }
   * ```
   * would isolate the results to just the `{ results: { "2020-03-10": { details: { ... } }}}`
   * results that come back from the API endpoint
   */
  offset?: string
  /**
   * What the results should be in the case that the API endpoint is empty. Default is `[]`.
   */
  emptyAs?: any
  /**
   * Fields/properties in the data which should be converted to numbers where possible
   */
  dateFields?: string[]
  /**
   * By default, string dates will be assumed to be in the `yyyy-MM-dd` format but you can override
   * this to values that conform to the [dateFormatter](https://www.amcharts.com/docs/v4/concepts/formatters/formatting-date-time/)
   * specification.
   */
  dateFormat?: string
  /**
   * Will try to convert fields/properties in the loaded structure into
   */
  numberFields?: string[]
  /**
   * Allows for processing the API results that are returned from the endpoint into whatever shape/form
   * you prefer.
   *
   * **Note:** if there is an `offset` property set, this will be applied _before_ the transform is
   * called.
   */
  transform?: (data: TData) => TOutput
  /**
   * Handle errors thrown as a result of the endpoint request
   */
  onError?: (error: Error) => void
  /**
   * Have the URL reloaded repetitively to update the data
   */
  reloadFrequency?: ms
  /**
   * if you are reloading the URL for new data and the payload truely represently only
   * _new_ data then you can set `incremental` to **true** (default is false) for a much
   * more efficient network and update process.
   */
  incremental?: boolean
  /**
   * Traditionally the data loader would replace the full data set (or add to the end if
   * _incremental_ is set) but with this flag set the chart's data will be updated and new
   * values will be animated into place.
   *
   * Due to the utility of this flag, the default will be set to `true` as a default.
   */
  updateCurrentData?: boolean
}

export async function api<TData>(chart: ILooksLikeChart<any>, urlConfig: IUrlInfo<TData>) {
  if (!chart) return
  const { url, config: options } = urlConfig

  chart.dataSource.parser = options.format === 'csv' ? new CSVParser() : new JSONParser()
  chart.dataSource.parser.options.emptyAs = options.emptyAs
  chart.dataSource.parser.options.dateFormat = options.dateFormat
  chart.dataSource.parser.options.dateFields = options.dateFields

  chart.dataSource.url = url
  if (options.reloadFrequency) {
    chart.dataSource.reloadFrequency = options.reloadFrequency
    if (options.incremental !== undefined) chart.dataSource.incremental = options.incremental
    if (options.updateCurrentData !== undefined) chart.dataSource.updateCurrentData = options.updateCurrentData
  }
}
