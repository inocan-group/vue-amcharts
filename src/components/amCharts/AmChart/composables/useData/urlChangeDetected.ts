import { IUrlInfo, IDataMetaForUrlDrivenChart } from './use-data-types'
import { api } from './api'
import { Ref } from '@vue/composition-api'

export const urlChangeDetected = <TData>(dataMeta: Ref<IDataMetaForUrlDrivenChart<TData>>) => (
  current: IUrlInfo<TData>,
  prior: IUrlInfo<TData>,
) => {
  const { urlPostHook, urlPreHook } = dataMeta.value.hooks

  console.log(`starting URL change detection [${dataMeta.value.sourceClass}]`, {
    current,
    prior,
    urlPostHook,
    urlPreHook,
  })

  if (!urlPreHook(current, prior)) return

  if (current && current.url) {
    console.log('url change', { who: dataMeta.value.sourceClass, dataMeta, current, prior })
    dataMeta.value.urlConfig = current
    if (prior && prior.url && prior.url === current.url) {
      // no-op
    } else {
      console.log('making URL request', current.url, { prior: prior.url, meta: dataMeta.value.urlConfig })
      api<TData>(dataMeta)
    }
  }

  urlPostHook(current, prior)
}
