import { Ref, isRef } from '@vue/composition-api'

export function unbox<T>(obj: T | Ref<T>): T {
  console.log('unboxing', obj)

  return isRef(obj) ? obj.value : obj
}
