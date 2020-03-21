import { IDictionary, ms } from 'common-types'
import { Ref } from '@vue/composition-api'

/**
 * Properties for components which can receive DATA
 */
export const dataProperties = {
  /**
   * If passing in data directly set the `data` property; this is typically
   * an array of some data structure but can be any Object or Array data structure.
   *
   * **Note:** should you want to load data from an API/URL, then use the `url` property
   * instead of the `data` property (do not use both)
   */
  data: {
    type: [Object, Array],
  },
  /**
   * Provide an API endpoint and optionally an options hash used to
   * handle the results
   */
  url: {
    type: [String, Array],
    validator: (v: any) =>
      (typeof v === 'string' && v.slice(0, 4) === 'http') ||
      (Array.isArray(v) && v.length === 2 && typeof v[0] === 'string' && typeof v[1] === 'object'),
  },
  /**
   * Allows consumers to state which property in the data is considered the `id` and aids in ensuring that
   * data _updates_ are done in a smooth animated fashion
   */
  dataIdProp: {
    type: String,
  },
}

export interface ILooksLikeChart<TData> extends IDictionary {
  data: TData[]
  invalidateData: () => void
  invalidateRawData: () => void
  addData(rawDataItem: TData[], removeCount?: number): void
}

export interface IUrlInfo<T> {
  url?: string
  config: IApiConfig<T>
}

export interface IPropertyMeta<T extends IDictionary, K extends keyof T = keyof T> {
  id: K
  dataProps: K[]
  labelProps: K[]
}

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

export interface IDataMeta<T> {
  containerName: string
  strategy: 'load from API' | 'undefined' | 'pass via prop'
  /** the property which acts as the primary key for data/records */
  idProp: string
  /** reference to the actual data container (chart/series) that is the source of the data */
  source: ILooksLikeChart<T>
  /** the current chart data which is being used by the chart */
  chartData: T[]
  /** structured info on what is provided in `props.url` */
  urlConfig?: IUrlInfo<T>
  /** the meta information used by amCharts to manage data change events */
  propMeta?: IPropertyMeta<T>
}

export type IDataMetaReady<T> = IDataMeta<T> & { propMeta: IPropertyMeta<T> }
export type IDataMetaForUrlDrivenChart<T> = IDataMetaReady<T> & { urlConfig: IUrlInfo<T> }

export type IUrlProperty<T> = string | [string, IApiConfig<T>]
