import { IUrlInfo, IApiConfig, IUrlProperty } from './use-data-types'
import { watch, ref, Ref } from '@vue/composition-api'
import { IDictionary, url } from 'common-types'
import { unbox } from '../../shared'

/**
 * Takes URL info from `props.url` and converts into a structured `IUrlInfo` object
 */
function decomposeUrl<T>(prop?: IUrlProperty<T>): IUrlInfo<T> {
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

export function setupWatchers<TProps extends IDictionary, TData>(
  props: TProps,
  onDataChange: (current: TData[], prior: TData[]) => void,
  onUrlChange: (current: IUrlInfo<TData>, prior: IUrlInfo<TData>) => void,
) {
  // DATA
  watch(
    () => ref(props.data),
    (current, prior) => {
      console.log('Data change:', { current, prior })

      onDataChange(current?.value as TData[], prior?.value as TData[])
    },
  )

  // URL
  watch(
    () => ref(props.url as IUrlProperty<TData>),
    (current, prior) => {
      console.log('URL changed', current, prior)
      const c = decomposeUrl<TData>(unbox(current))
      const p = decomposeUrl<TData>(unbox(prior))

      onUrlChange(c, p)
    },
  )
}
