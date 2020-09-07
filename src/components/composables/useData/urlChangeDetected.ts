import { IUrlInfo, IDataMetaForUrlDrivenChart } from './use-data-types'
import { api } from './api'
import { Ref } from 'vue'

export const urlChangeDetected = <TData>(dataMeta: Ref<IDataMetaForUrlDrivenChart<TData>>) => (
  current: IUrlInfo<TData>,
  prior: IUrlInfo<TData>,
) => {
  const { urlPostHook, urlPreHook } = dataMeta.value.hooks

  if (!urlPreHook(current, prior)) return

  if (current && current.url) {
    dataMeta.value.urlConfig = current
    if (prior && prior.url && prior.url === current.url) {
      // no-op
    } else {
      api<TData>(dataMeta)
    }
  }

  urlPostHook(current, prior)
}
