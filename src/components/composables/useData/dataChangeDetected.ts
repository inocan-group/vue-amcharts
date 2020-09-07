import { IDataMetaReady } from './use-data-types'

import diff from 'hyperdiff'
import { Ref } from 'vue'

function hasCurrentValue<T>(current: T[] | undefined): current is T[] {
  return current && current && Array.isArray(current) ? true : false
}

function hasPriorValue<T>(prior: T[] | undefined): prior is T[] {
  return prior && prior && Array.isArray(prior) ? true : false
}

export const dataChangeDetected = <TData, K extends keyof TData = keyof TData>(
  chartData: Ref<TData[]>,
  dataMeta: Ref<IDataMetaReady<TData>>,
) => (current: TData[], prior: TData[]) => {
  const { dataPostHook, dataPreHook } = dataMeta.value.hooks
  if (typeof current === 'undefined' && typeof prior === 'undefined') return
  // pre hook
  const continueExecution = dataPreHook(current, prior)
  if (!continueExecution) {
    return
  }

  if (current && current.length > 0) {
    const currentKeys = Object.keys(current[0]) as Array<K & string>
    const otherKeys: Array<K & string> = currentKeys.filter(i => !dataMeta.value.propMeta.dataProps.includes(i))
    dataMeta.value.propMeta.labelProps = otherKeys
  }

  if (hasCurrentValue(current) && (!hasPriorValue(prior) || prior.length === 0)) {
    // All data is new
    if (Array.isArray(current)) {
      current.forEach(i => dataMeta.value.source.addData(i))
    } else {
      dataMeta.value.source.data = current
      chartData = current
      dataMeta.value.source.invalidateData()
    }
  } else if ((!hasCurrentValue(current) || current.length === 0) && hasPriorValue(prior)) {
    // All data has been removed
    dataMeta.value.source.data = []
    chartData.value = []
    dataMeta.value.source.invalidateData()
  } else if (hasCurrentValue(current) && hasPriorValue(prior)) {
    // Data has changed; address add/remove
    const difference = diff<TData>(dataMeta.value.source.data, current, dataMeta.value.propMeta.id)
    if (difference.added.length === 0 && difference.removed.length === 0) {
      console.log('no add/remove; processing differences', difference, dataMeta.value.source.data)
    } else if (difference.added.length === 0) {
      console.log(
        `${difference.removed.length} removed; processing differences`,
        difference,
        dataMeta.value.source.data,
      )
    } else {
      console.log('processing differences', difference)
    }
    if (difference.added.length > 0) {
      dataMeta.value.source.addData(difference.added)
      chartData.value = dataMeta.value.source.data
    }
    difference.removed.forEach(i => {
      const idProp = dataMeta.value.propMeta.id
      const pk = i[idProp]
      const index = (dataMeta.value.source.data as TData[]).findIndex(i => i?.[idProp] === pk)
      if (index !== -1) {
        // ;(dataMeta.value.source.data.data as TData[]).splice(index, 1)
        delete dataMeta.value.source.data[index]
        dataMeta.value.source.invalidateData()
        delete dataMeta.value.source.data[index]
        chartData.value = dataMeta.value.source.data
        console.log(`Remove datum`, i, current.length, dataMeta.value.source.data.length)
      } else {
        console.warn(`A property was removed but it was NOT found in the source data structure`, i)
      }
    })
    // deal with remaining overlap
    const changedData = difference.common.reduce(
      (agg: { dataChanged: TData[]; labelsChanged: TData[] }, rec: TData) => {
        const currentRec = current.find(i => rec[dataMeta.value.propMeta.id] === i[dataMeta.value.propMeta.id]) as TData
        // check each data property for change
        if (!dataMeta.value.propMeta.dataProps.every(i => currentRec[i] === rec[i])) {
          agg.dataChanged.push(currentRec)
        }
        if (!dataMeta.value.propMeta.labelProps.every(i => currentRec[i] === rec[i])) {
          agg.labelsChanged.push(rec)
        }
        return agg
      },
      { dataChanged: [], labelsChanged: [] },
    )

    if (changedData.labelsChanged.length > 0) {
      dataMeta.value.source.data = current
      chartData.value = current
      dataMeta.value.source.invalidateData()
    } else if (changedData.dataChanged.length > 1) {
      dataMeta.value.source.data.forEach((item, index) => {
        const pk = item[dataMeta.value.propMeta.id]
        const changedRecord = changedData.dataChanged.find(i => i[dataMeta.value.propMeta.id] === pk)
        if (changedRecord) {
          dataMeta.value.propMeta.dataProps.forEach(p => {
            console.log(
              `changing property [${index}][${p}]`,
              changedRecord[p],
              `from ${dataMeta.value.source.data[index][p]}`,
            )

            dataMeta.value.source.data[index][p] = changedRecord[p]
          })
          dataMeta.value.source.invalidateRawData()
        }
      })
    } else {
      console.debug(`There were common props between current/prior but nothing seems to have changed`, {
        current,
        prior,
        difference: difference.common,
      })
    }
  }
  console.log(`about to call post hook for ${dataMeta.value.sourceClass}`, dataPostHook)

  dataPostHook(current, prior)
}
