import { Ref, ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { unbox } from '../../shared'
import { api } from './api'
import { AmchartError } from '../../errors'
import {
  IUrlInfo,
  ILooksLikeChart,
  setupEvents,
  setupWatchers,
  urlChangeDetected,
  dataChangeDetected,
  fakeContainer,
} from './index'
import { IPropertyMeta, IDataMeta, IDataMetaReady, IDataMetaForUrlDrivenChart } from './use-data-types'

/**
 * Helps manage chart data so that whether you are passing in a URL or raw data to the `data`/`url`
 * properties, you get reactive responses as well as smooth animation.
 *
 * @param prop expects that there will be a prop named `data` as part of the dictionary
 */
export function useData<
  /** typing for the `props` dictionary */
  TProps extends IDictionary,
  /** typing for a single record of data */
  TData extends IDictionary = IDictionary,
  /** keys of the record data */
  K extends keyof TData & string = keyof TData & string
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
) {
  if (props.data && props.url) {
    throw new AmchartError(`Attach properties to either "data" or "url" but not both!`, `not-allowed`)
  }

  /** the user's optionally registered pre-check for change */
  let dataPreHook: (current: TData[], old: TData[]) => Promise<boolean> | boolean
  /** the user's optionally registered post-change hook */
  let dataPostHook: (current: TData[], old: TData[]) => Promise<void> | void
  let urlPreHook: (current: IUrlInfo<TProps>, old: IUrlInfo<TProps>) => Promise<boolean> | boolean
  let urlPostHook: (current: IUrlInfo<TProps>, old: IUrlInfo<TProps>) => Promise<void> | void
  /**
   * Get called immediately prior to data changing; return value determines
   * whether the data change is accepted.
   */
  const preDataChange = (fn: (current: TData[], old: TData[]) => Promise<boolean> | boolean) => {
    dataPreHook = fn
  }
  /**
   * Execution/hook that is called immediately following a data change; this data
   * change can be _either_ a result of the `data` property passed in changing
   * -- or more likely -- the chart getting updated due to some user event or
   * an async data loading event.
   */
  const postDataChange = (fn: (current: TData[], old: TData[]) => Promise<void> | void) => {
    dataPostHook = fn
  }
  /**
   * Hook which allows execution immediately prior to the `url` property being changed.
   * Because this event is triggered explicitly by the consuming component, this hook
   * is probably best used for debugging purposes only.
   */
  const preUrlChange = (fn: (current: IUrlInfo<TProps>, old: IUrlInfo<TProps>) => Promise<boolean> | boolean) => {
    urlPreHook = fn
  }
  const postUrlChange = (fn: (current: IUrlInfo<TProps>, old: IUrlInfo<TProps>) => Promise<void> | void) => {
    urlPostHook = fn
  }

  // determine meta definition
  const initialMeta: IDataMeta<TData> = {
    containerName: '',
    strategy: props.url ? 'load from API' : props.data === undefined ? 'undefined' : 'pass via prop',
    idProp: props.dataIdProp,
    source: fakeContainer,
    chartData: fakeContainer.data,
  }

  const dataMeta: Ref<IDataMeta<TData>> = ref(initialMeta)
  if (props.url) {
    dataMeta.value.urlConfig = { url: undefined, config: {} }
  }

  /**
   * Once the container is ready to receive data, we set up events and watchers
   * and optionally send an API request
   */
  const dataIsReady = (
    source: ILooksLikeChart<TData>,
    propMeta: IPropertyMeta<TData> = { id: 'id', dataProps: [], labelProps: [] },
  ) => {
    dataMeta.value.source = source
    dataMeta.value.chartData = source.data
    dataMeta.value.propMeta = propMeta
    dataMeta.value.containerName = source?.constructor?.name || 'unknown'

    setupEvents(dataMeta as Ref<IDataMetaReady<TData>>)
    setupWatchers(
      props,
      dataChangeDetected(dataMeta as Ref<IDataMetaReady<TData>>, dataPreHook, dataPostHook),
      urlChangeDetected(dataMeta as Ref<IDataMetaForUrlDrivenChart<TData>>, urlPreHook, urlPostHook),
    )

    if (dataMeta.value?.urlConfig?.url) {
      api<TData>(dataMeta as Ref<IDataMetaForUrlDrivenChart<TData>>)
    }
  }

  /**
   * Indicate to data handler that the component is ready
   * to receive data
   */
  const dataReady = (
    source: ILooksLikeChart<TData>,
    /** provide META about the various properties in the data array <T> */
    propMeta?: { id: K; dataProps: K[]; labelProps: K[] },
  ) => {
    dataIsReady(source, propMeta)

    return { preDataChange, postDataChange, preUrlChange, postUrlChange }
  }

  return { dataReady, dataMeta }
}
