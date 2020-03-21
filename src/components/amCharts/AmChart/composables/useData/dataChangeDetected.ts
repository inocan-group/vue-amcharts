import { IDataMetaReady } from './use-data-types'

import diff from 'hyperdiff'
import { Ref } from '@vue/composition-api'

function hasCurrentValue<T>(current: T[] | undefined): current is T[] {
  return current && current && Array.isArray(current) ? true : false
}

function hasPriorValue<T>(prior: T[] | undefined): prior is T[] {
  return prior && prior && Array.isArray(prior) ? true : false
}

export const dataChangeDetected = <TData, K extends keyof TData = keyof TData>(
  dataMeta: Ref<IDataMetaReady<TData>>,
  preHook: (current: TData[], old: TData[]) => Promise<boolean> | boolean,
  postHook: (current: TData[], old: TData[]) => Promise<void> | void,
) => (current: TData[], prior: TData[]) => {
  const { source, propMeta } = dataMeta.value
  if (typeof current === 'undefined' && typeof prior === 'undefined') return
  console.log(`dataChangeDetected [${typeof current}/${typeof prior}]`, current)

  const continueExecution = preHook ? preHook(current, prior) : true

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
    const difference = diff<TData>(prior, current, propMeta.id)
    console.log('data is different', difference, source)
    source.addData(difference.added)
    difference.removed.forEach(i => {
      const pk = i[propMeta.id]
      const index = (source.data as TData[]).findIndex(i => i[propMeta.id] === pk)
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
        const currentRec = current.find(i => rec[propMeta.id] === i[propMeta.id]) as TData
        if (!propMeta.dataProps.every(i => currentRec[i] === rec[i])) {
          agg.dataChanged.push(rec)
        }
        if (!propMeta.labelProps.every(i => currentRec[i] === rec[i])) {
          agg.labelsChanged.push(rec)
        }
        return agg
      },
      { dataChanged: [], labelsChanged: [] },
    )
    console.log({ changedData, meta: { dataProps: propMeta.dataProps, labelProps: propMeta.labelProps } })

    if (changedData.labelsChanged.length > 0) {
      source.data = current
      source.invalidate()
    } else if (changedData.dataChanged.length > 1) {
      ;(source.data as TData[]).forEach((item, index) => {
        const pk = item[propMeta.id]
        const changedRecord = changedData.dataChanged.find(i => i[propMeta.id] === pk)
        if (changedRecord) {
          propMeta.dataProps.forEach(p => {
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
    if (postHook) postHook(current, prior)
  }
}
