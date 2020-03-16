import { IDictionary } from 'common-types'
import { watch, toRefs, Ref, ref } from '@vue/composition-api'
import { diff } from 'deep-object-diff'

export interface IPropsOnChange<T> {
  (prop: string, current: T, old: T | undefined): Promise<void>
}

function unbox<T>(obj: IDictionary) {
  return Object.keys(obj || {}).reduce((agg, key) => {
    const value = obj[key].value
    agg[key as keyof T] = typeof value === 'object' ? { ...value } : value
    return agg
  }, {} as T)
}

export function useProps<T extends IDictionary = IDictionary<unknown>>(props: T) {
  let registeredOnChangeEvent: IPropsOnChange<T>

  /**
   * An async function which is called when property changes are detected
   */
  const onChange = (fn: IPropsOnChange<T>) => {
    registeredOnChangeEvent = fn
  }

  /**
   * Detects changes
   * @param prop the property which has changed
   */
  const onPropChange = (prop: string, current: any, old: any) => {
    const difference = diff(current, old)
    if (registeredOnChangeEvent) {
      registeredOnChangeEvent(prop, current, old)
    }
  }

  Object.keys(props).forEach(prop => {
    watch(
      () => ref(props[prop]),
      (current, old) => {
        onPropChange(prop, current ? current.value : undefined, old ? old.value : undefined)
      },
    )
  })

  return { onChange }
}
