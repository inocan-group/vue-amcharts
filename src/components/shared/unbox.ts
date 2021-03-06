import { Ref, isRef } from '@vue/composition-api'

export function unbox<T>(obj: T | Ref<T>): T {
  return isRef(obj) ? obj.value : obj
}
