import { IUrlProperty, IUrlInfo, IApiConfig } from './index'

/**
 * Takes URL info from `props.url` and converts into a structured `IUrlInfo` object
 */
export function decomposeUrl<T>(prop?: IUrlProperty<T>): IUrlInfo<T> {
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
