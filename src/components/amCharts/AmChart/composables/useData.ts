import { Ref, watch, ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import diff from 'hyperdiff'

function hasCurrentValue<T>(current: Ref<T[] | undefined>): current is Ref<T[]> {
  return current && current.value && Array.isArray(current.value) ? true : false
}

function hasPriorValue<T>(prior: Ref<T[] | undefined>): prior is Ref<T[]> {
  return prior && prior.value && Array.isArray(prior.value) ? true : false
}

/**
 *
 * @param prop
 */
export function useData<T extends IDictionary = IDictionary, K extends keyof T = keyof T>(
  /**
   * a reactive array of data; this data will be monitored for change and updated in the best way
   * to provide graceful animation.
   */
  data: Ref<T[]>,
  /** provide META about the various properties in the data array <T> */
  properties: { id: K; dataProps: K[]; labelProps: K[] },
  /** either the chart or series object */
  source: IDictionary & {
    data: T[]
    invalidateData: () => void
    invalidateRawData: () => void
    addData(add: T[], remove?: T[]): void
  },
) {
  // manage the data change
  const dataChangeDetected = (current: Ref<T[] | undefined>, prior: Ref<T[] | undefined>) => {
    let added: T[]
    let removed: T[]
    let updated: T[]
    const currentExists = current.value && current.value.length > 0
    const priorExists = prior.value && prior.value.length > 0

    if (hasCurrentValue(current) && !hasPriorValue(prior)) {
      // All data is new
      source.data = current.value
      if (Array.isArray(prior.value)) {
        source.invalidateData()
      }
    } else if (!hasCurrentValue(current) && hasPriorValue(prior)) {
      // All data has been removed
      source.data = []
      source.invalidateData()
    } else if (hasCurrentValue(current) && hasPriorValue(prior)) {
      // Data has changed
      const difference = diff<T>(current.value, prior.value, properties.id)
      source.addData(difference.added, difference.removed)
      // deal with remaining overlap
      const changedData = difference.common.reduce(
        (agg: { dataChanged: T[]; propsChanged: T[] }, rec: T) => {
          const priorRec = prior.value.find(i => rec[properties.id] === i[properties.id]) as T
          if (!properties.dataProps.every(i => priorRec[i] === rec[i])) {
            agg.dataChanged.push(rec)
          }
          if (properties.labelProps.every(i => priorRec[i] === rec[i])) {
            agg.propsChanged.push(rec)
          }
          return agg
        },
        { dataChanged: [], propsChanged: [] },
      )

      if (changedData.propsChanged.length > 0) {
        source.data = current.value
        source.invalidateData()
      } else {
        changedData.dataChanged.forEach(datum => {
          const pk = datum[properties.id]
          const index = source.data.indexOf(i => i[properties.id] === pk)
          if (index !== -1) {
            source.data
          }
        })
      }
    }
  }

  watch(
    () => ref(data),
    (current, prior) => dataChangeDetected(current, prior),
  )
}
