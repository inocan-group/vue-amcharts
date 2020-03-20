import { Ref, watch, ref, onMounted, reactive } from '@vue/composition-api'
import { IDictionary, url } from 'common-types'
import diff from 'hyperdiff'
import { unbox } from '../shared'
import { IApiConfig, api } from '../shared/api'
import { AmchartError } from '../errors'
import { DataSource } from '@amcharts/amcharts4/core'
import get from 'lodash.get'

function hasCurrentValue<T>(current: T[] | undefined): current is T[] {
  return current && current && Array.isArray(current) ? true : false
}

function hasPriorValue<T>(prior: T[] | undefined): prior is T[] {
  return prior && prior && Array.isArray(prior) ? true : false
}

function decomposeUrl<T>(prop?: url | [url, IApiConfig<T>]): IUrlInfo<T> {
  const defaultOptions: IApiConfig = {
    format: 'json',
    emptyAs: [],
    dateFormat: 'yyyy-MM-dd',
    dateFields: [],
    numberFields: [],
    incremental: false,
    updateCurrentData: true,
  }
  if (!prop) {
    return { url: undefined, config: (defaultOptions as unknown) as IApiConfig<T> }
  }

  const url = Array.isArray(prop) ? prop[0] : prop
  const config: IApiConfig<T> = Array.isArray(prop)
    ? ({ ...defaultOptions, ...prop[1] } as IApiConfig<T>)
    : ((defaultOptions as unknown) as IApiConfig<T>)

  return { url, config }
}

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

/**
 * A hook to allow execution _before_ a change to data has taken place; returning
 * a `true` value allows the `useData` handlers to continue, passing back false
 * stops the change from being carried out.
 */
export type IDataBeforeChange<T extends IDictionary> = (
  current: T[] | undefined,
  old: T[] | undefined,
) => Promise<boolean> | boolean

/**
 * A hook to allow execution _after_ a change to data has taken place
 */
export type IDataAfterChange<T extends IDictionary> = (current: T[], old: T[] | undefined) => Promise<void> | void

export interface IUrlInfo<T> {
  url?: string
  config: IApiConfig<T>
}

export type IUrlBeforeChange<T extends IDictionary> = (
  current: IUrlInfo<T> | undefined,
  prior: IUrlInfo<T> | undefined,
) => Promise<boolean> | boolean

export type IUrlAfterChange<T extends IDictionary> = (
  current?: IUrlInfo<T>,
  prior?: IUrlInfo<T>,
) => Promise<void> | void

/**
 * Helps manage chart data so that whether you are passing in a URL or raw data to the `data`/`url`
 * properties, you get reactive responses as well as smooth animation.
 *
 * @param prop expects that there will be a prop named `data` as part of the dictionary
 */
export function useData<
  TProps extends IDictionary,
  TData extends IDictionary = IDictionary,
  K extends keyof TData = keyof TData
>(
  /**
   * The properties passed into the component; it is assumed that this includes the
   * property `data` which will be managed within this helper function.
   *
   * Note that the data property can either be an array of _data_ or it can be a URL string which
   * points to the data. These two situations are obviously very different but both have
   * _reactivity_ requirements.
   */
  props: TProps,
  /** either the chart or series object */
  sourceOrSourceRef: ILooksLikeChart<TData> | Ref<ILooksLikeChart<TData>>,
  /** provide META about the various properties in the data array <T> */
  properties: { id: K; dataProps: K[]; labelProps: K[] },
) {
  /** the config before the last change */
  const priorUrlConfig: Ref<IUrlInfo<TData>> = ref({ url: undefined, config: undefined })
  /** the current config of the URL */
  const urlConfig: Ref<IUrlInfo<TData>> = ref({ url: undefined, config: undefined })

  let hasMounted = false
  if (props.data && props.url) {
    throw new AmchartError(`Attach properties to either "data" or "url" but not both!`, `not-allowed`)
  }
  const chartData: Ref<TData[] | undefined> = ref(unbox(sourceOrSourceRef).data)

  /** the user's optionally registered pre-check for change */
  let userPreHook: IDataBeforeChange<TData>
  /** the user's optionally registered post-change hook */
  let userPostHook: IDataAfterChange<TData>

  let urlPreHook: IUrlBeforeChange<TData>
  let urlPostHook: IUrlAfterChange<TData>

  /**
   * Get called immediately prior to data changing; return value determines
   * whether the data change is accepted.
   */
  const preDataChange = (fn: IDataBeforeChange<TData>) => {
    userPreHook = fn
  }

  /**
   * Execution/hook that is called immediately following a data change; this data
   * change can be _either_ a result of the `data` property passed in changing
   * -- or more likely -- the chart getting updated due to some user event or
   * an async data loading event.
   */
  const postDataChange = (fn: IDataAfterChange<TData>) => {
    userPostHook = fn
  }

  /**
   * Hook which allows execution immediately prior to the `url` property being changed.
   * Because this event is triggered explicitly by the consuming component, this hook
   * is probably best used for debugging purposes only.
   */
  const preUrlChange = (fn: IUrlBeforeChange<TData>) => {
    urlPreHook = fn
  }

  const postUrlChange = (fn: IUrlAfterChange<TData>) => {
    urlPostHook = fn
  }

  // determine meta definition
  const dataMeta: Ref<IDictionary> = ref({
    strategy: props.url ? 'load from API' : props.data === undefined ? 'undefined' : 'pass via prop',
    idProp: props.dataIdProp,
    chartData,
  })
  if (props.url) {
    dataMeta.value.urlConfig = urlConfig
  }

  onMounted(() => {
    hasMounted = true
    if (urlConfig.value.url) {
      api<TData>(unbox(sourceOrSourceRef), unbox(urlConfig))
    }
  })

  //#region URL Change Detection
  const urlChangeDetected = () => {
    console.log('url changed', unbox(urlConfig))

    if (urlPreHook) {
      const cont = urlPreHook(unbox(urlConfig), unbox(priorUrlConfig))
      if (!cont) return
    }
    if (hasMounted && urlConfig.value.url && urlConfig.value.url !== priorUrlConfig.value.url) {
      api<TData>(unbox(sourceOrSourceRef), unbox(urlConfig))
    }
    if (urlPostHook) urlPostHook(unbox(urlConfig), unbox(priorUrlConfig))
  }

  // manage the data change
  const dataChangeDetected = (current: TData[] | undefined, prior: TData[] | undefined) => {
    chartData.value = current
    const source = unbox(sourceOrSourceRef)

    if (typeof current === 'undefined' && typeof prior === 'undefined') return
    console.log(`dataChangeDetected [${typeof current}/${typeof prior}]`)

    const continueExecution = userPreHook ? userPreHook(current, prior) : true

    if (!continueExecution) {
      return
    }
    console.log('continuing data change processing')

    if (hasCurrentValue(current) && !hasPriorValue(prior)) {
      // All data is new
      console.log('data is all new', current, source)

      source.data = current
      if (Array.isArray(prior)) {
        source.invalidateData()
      }
    } else if (!hasCurrentValue(current) && hasPriorValue(prior)) {
      // All data has been removed
      console.log('data is all removed')

      source.data = []
      source.invalidateData()
    } else if (hasCurrentValue(current) && hasPriorValue(prior)) {
      // Data has changed; address add/remove
      const difference = diff<TData>(prior, current, properties.id)
      console.log('data is different', difference, source)
      source.addData(difference.added)
      difference.removed.forEach(i => {
        const pk = i[properties.id]
        const index = (source.data as TData[]).findIndex(i => i[properties.id] === pk)
        if (index !== -1) {
          ;(source.data as TData[]).splice(index, 1)
          source.invalidateData()
          console.log(`Remove datum`, i, current.length, source.data.length)
        } else {
          console.warn(`A property was removed but it was NOT found in the source data structure`, i)
        }
      })
      // deal with remaining overlap
      const changedData = difference.common.reduce(
        (agg: { dataChanged: TData[]; labelsChanged: TData[] }, rec: TData) => {
          const currentRec = current.find(i => rec[properties.id] === i[properties.id]) as TData
          if (!properties.dataProps.every(i => currentRec[i] === rec[i])) {
            agg.dataChanged.push(rec)
          }
          if (!properties.labelProps.every(i => currentRec[i] === rec[i])) {
            agg.labelsChanged.push(rec)
          }
          return agg
        },
        { dataChanged: [], labelsChanged: [] },
      )
      console.log({ changedData, meta: { dataProps: properties.dataProps, labelProps: properties.labelProps } })

      if (changedData.labelsChanged.length > 0) {
        source.data = current
        source.invalidate()
      } else if (changedData.dataChanged.length > 1) {
        ;(source.data as TData[]).forEach((item, index) => {
          const pk = item[properties.id]
          const changedRecord = changedData.dataChanged.find(i => i[properties.id] === pk)
          if (changedRecord) {
            properties.dataProps.forEach(p => {
              console.log(`changing property [${index}][${p}]`, changedRecord[p])

              source.data[index][p] = changedRecord[p]
            })
            source.invalidateRawData()
          }
        })
      } else {
        console.debug(`There were common props between current/prior but nothing seems to have changed`, {
          current,
          prior,
          difference: difference.common,
        })
      }
      if (userPostHook) userPostHook(current, prior)
    }
  }
  //#endregion  URL Change Detection

  //#region  DATA EVENTS
  const s = unbox(sourceOrSourceRef)
  s.dataSource.events.on('parseended', (event: { type: string; target: DataSource }) => {
    const { target } = event
    console.log('parse ended', target)
    let data = target.data
    if (urlConfig.value.config.offset) {
      data = get(data, urlConfig.value.config.offset)
      if (!data && target.data) {
        console.warn(
          `The URL configuration used an offset property of "${urlConfig.value.config.offset}" on the API result but when applying this offset no results were found. The original results were:`,
          target.data,
        )
      }
    }

    data = urlConfig.value.config.transform ? urlConfig.value.config.transform(data) : data
    chartData.value = data
    target.data = data
  })
  //#endregion DATA EVENTS

  //#region WATCHERS (data, url)
  watch(
    () => ref(props.data),
    (current, prior) => {
      console.log('Data change:', {
        current: [typeof current, typeof current?.value, current],
        prior: [typeof prior, typeof prior?.value],
      })

      dataChangeDetected(current?.value as TData[], prior?.value as TData[])
    },
  )

  watch(
    () => ref(props.url),
    current => {
      console.log('URL changed', current)
      priorUrlConfig.value = urlConfig.value
      urlConfig.value = decomposeUrl(current.value)

      urlChangeDetected()
    },
  )
  //#endregion WATCHERS

  return { preDataChange, postDataChange, preUrlChange, postUrlChange, dataMeta }
}
