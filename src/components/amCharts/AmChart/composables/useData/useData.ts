import { Ref, ref, watch, toRefs, reactive } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { api } from './api'
import { AmchartError } from '../../errors'
import {
  IUrlInfo,
  ILooksLikeChart,
  setupEvents,
  setupPropertyWatchers,
  urlChangeDetected,
  dataChangeDetected,
  fakeContainer,
} from './index'
import { IPropertyMeta, IDataMeta, IDataMetaReady, IDataMetaForUrlDrivenChart } from './use-data-types'
import { decomposeUrl } from './decomposeUrl'
import { unbox } from '../../shared'

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

  //#region HOOKS

  //#endregion HOOKS

  //#region DATA SETUP
  const chartData: Ref<TData[]> = ref(fakeContainer.data)

  const dataProps = props.dataProperties
    ? typeof props.dataProperties === 'string'
      ? props.dataProperties.includes(',')
        ? props.dataProperties.split(',').map(i => i.trim())
        : [props.dataProperties]
      : props.dataProperties
    : []

  // determine meta definition
  const initialMeta: IDataMeta<TData> = {
    sourceClass: '',
    strategy: props.url ? 'load from API' : props.data === undefined ? 'undefined' : 'pass via prop',
    propMeta: {
      id: props.dataIdProp,
      dataProps,
      labelProps: [],
    },
    source: fakeContainer,
    uid: '',
    hooks: {
      dataPreHook: () => true,
      dataPostHook: () => undefined,
      urlPreHook: () => true,
      urlPostHook: () => undefined,
    },
  }

  const dataMeta: Ref<IDataMeta<TData>> = ref(initialMeta)
  if (props.url && props.url !== undefined) {
    dataMeta.value.urlConfig = decomposeUrl(props.url)
  }

  /**
   * Once the container is ready to receive data, we set up events and watchers
   * and optionally send an API request
   */
  const dataIsReady = (source: ILooksLikeChart<TData>, propMeta?: Partial<IPropertyMeta<TData>>) => {
    dataMeta.value.source = source
    chartData.value = source.data

    if (propMeta) {
      dataMeta.value.propMeta = {
        ...dataMeta.value.propMeta,
        ...propMeta,
      } as IPropertyMeta<TData>
    }
    dataMeta.value.sourceClass = source?.constructor?.name || 'unknown'

    const dataChange = dataChangeDetected(chartData, dataMeta as Ref<IDataMetaReady<TData>>)

    setupEvents(dataChange, dataMeta as Ref<IDataMetaReady<TData>>)
    setupPropertyWatchers(props, dataChange, urlChangeDetected(dataMeta as Ref<IDataMetaForUrlDrivenChart<TData>>))

    if (dataMeta.value?.urlConfig?.url) {
      console.log('calling api', dataMeta.value.sourceClass)
      api<TData>(dataMeta as Ref<IDataMetaForUrlDrivenChart<TData>>)
    }
  }

  /**
   * Indicate to data handler that the component is ready
   * to receive data
   */
  const dataReady = (
    source: ILooksLikeChart<TData> | Ref<ILooksLikeChart<TData>>,
    /** provide META about the various properties in the data array <T> */
    propMeta?: { id: K; dataProps: K[]; labelProps: K[] },
  ) => {
    source = unbox(source)
    dataMeta.value.uid = source.uid
    dataIsReady(source, propMeta)
  }

  /**
   * Get called immediately prior to data changing; return value determines
   * whether the data change is accepted.
   */
  const preDataChange = (fn: (current: TData[], old: TData[]) => Promise<boolean> | boolean) => {
    dataMeta.value.hooks.dataPreHook = fn
  }
  /**
   * Execution/hook that is called immediately following a data change; this data
   * change can be _either_ a result of the `data` property passed in changing
   * -- or more likely -- the chart getting updated due to some user event or
   * an async data loading event.
   */
  const postDataChange = (fn: (current: TData[], old: TData[]) => Promise<void> | void) => {
    console.log(`postDataChange has reassigned post hook in ${dataMeta.value.sourceClass}`, fn)
    dataMeta.value.hooks.dataPostHook = fn
  }
  /**
   * Hook which allows execution immediately prior to the `url` property being changed.
   * Because this event is triggered explicitly by the consuming component, this hook
   * is probably best used for debugging purposes only.
   */
  const preUrlChange = (fn: (current: IUrlInfo<TData>, old: IUrlInfo<TData>) => Promise<boolean> | boolean) => {
    dataMeta.value.hooks.urlPreHook = fn
  }
  const postUrlChange = (fn: (current: IUrlInfo<TData>, old: IUrlInfo<TData>) => Promise<void> | void) => {
    dataMeta.value.hooks.urlPostHook = fn
  }

  return { chartData, dataReady, dataMeta, preDataChange, postDataChange, preUrlChange, postUrlChange }
}
