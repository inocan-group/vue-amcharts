import { IUrlInfo, IDataMetaForUrlDrivenChart } from './use-data-types'
import { api } from './api'
import { Ref } from '@vue/composition-api'

export const urlChangeDetected = <TData>(
  dataMeta: Ref<IDataMetaForUrlDrivenChart<TData>>,
  preHook: (current: IUrlInfo<TData>, old: IUrlInfo<TData>) => Promise<boolean> | boolean,
  postHook: (current: IUrlInfo<TData>, old: IUrlInfo<TData>) => Promise<void> | void,
) => (current: IUrlInfo<TData>, prior: IUrlInfo<TData>) => {
  console.log('url change detected', dataMeta.value.containerName, current, prior)

  if (preHook) {
    if (!preHook(current, prior)) return
  }
  dataMeta.value.urlConfig = current

  if (current.url && prior && current.url !== prior.url) {
    api<TData>(dataMeta)
  }

  if (postHook) postHook(current, prior)
}
