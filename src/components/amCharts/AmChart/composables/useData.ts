import { Ref, watch, ref } from '@vue/composition-api'
import { addedDiff, deletedDiff, updatedDiff } from 'deep-object-diff'
import { IDictionary } from 'common-types'

/**
 *
 * @param prop
 */
export function useData<T extends IDictionary = IDictionary, K extends keyof T = keyof T>(
  base: any,
  data: Ref<T[]>,
  idProp: K,
) {
  // manage the data change
  const dataChangeDetected = (current: Ref<T[]>, prior: Ref<T[]> | undefined) => {
    let added: T[]
    let removed: T[]
    let updated: T[]
    const currentExists = current.value && current.value.length > 0
    const priorExists = prior.value && prior.value.length > 0

    if (currentExists && !priorExists) {
      //
    } else if (!currentExists && priorExists) {
      //
    } else {
      added = addedDiff(prior.value, current.value)
    }
  }

  watch(
    () => ref(data),
    (current, prior) => dataChangeDetected(current, prior),
  )
}
