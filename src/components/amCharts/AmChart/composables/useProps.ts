import { IDictionary } from 'common-types'
import { watch, Ref, ref, isRef } from '@vue/composition-api'
import { diff } from 'deep-object-diff'
import { AmchartError } from '../errors'
import set from 'lodash.set'

export type IPropsOnChange<T extends IDictionary, K extends keyof T = keyof T> = (
  prop: string & K,
  current: T[K],
  old: T[K] | undefined,
) => Promise<void> | void

export interface IActionConfiguration<T extends IDictionary, K extends keyof T & string = keyof T & string> {
  (prop: K, value: T, old: T | undefined): IDictionary
}

/** a dictionary with a dot-notation string offset */
export type IResponseOffset = [IDictionary, string]
/** a dictionary with a function */

/**
 * Get notified of any component properties which change by importing the `onPropChange` hook
 */
export function useProps<T extends IDictionary = IDictionary<unknown>, K extends keyof T = keyof T>(props: T) {
  let registeredOnChangeEvent: IPropsOnChange<T>

  const setProp = (prop: string, value: any, actionConfig: IDictionary) => {
    const action = actionConfig[prop]
    if (action) {
      if (Array.isArray(action)) {
        // if ([2, 3].includes(action.length)) {
        //   throw new AmchartError(
        //     `The respondTo() helper expects 2 (occationally 3) arguments but got ${action.length} for property ${prop}`,
        //     'invalid-format',
        //   )
        // }
        const [base, offset, optFn] = action
        if (typeof offset === 'string') {
          set(base, offset, optFn ? optFn() : value)
        } else if (typeof offset === 'function') {
          set(base, offset(), value)
        } else {
          throw new AmchartError(
            `The respondTo() helper was given an array signature for the property ${prop} but the second array element needs to be a string or a function and it was a ${typeof offset}`,
            `invalid-format`,
          )
        }
      } else {
        if (typeof action === 'function') {
          // just execute a function and let it take care of things
          action()
        } else {
          // write to property name of root object
          action[prop] = value
        }
      }
    }
  }

  /**
   * **onPropChange**
   *
   * Consumes a sync or _async_ function which is called whenever a VueJS _prop_ has changed.
   * The function will be passed the `property` that changed, the new `value` of the prop and the `old`
   * value for context so it can take the appropriate actions:
   *
   * ```typescript
   * onPropChange( (prop, value, old ) => { ... })
   * ```
   *
   * **Note:** _this "hook" is often used in conjunction with the `respondTo` export from **useProps**
   * to map VueJS props to the appropriate action/change. See `respondTo` for more info._
   *
   * ```typescript
   * onPropChange(async (prop: string, current) => {
   *  respondTo(prop, current, propertyConfig)
   * })
   * ```
   */
  const onPropChange = (fn: IPropsOnChange<T>) => {
    registeredOnChangeEvent = fn
  }

  /**
   * Executed when VueJS property change is detected
   *
   * @param prop the property which has changed
   */
  const onChange = (prop: string, current: any, old: any) => {
    if (prop === 'data') console.log(`${prop} property changed`)

    if (registeredOnChangeEvent) {
      registeredOnChangeEvent(prop, current, old)
    }
  }

  /**
   * Provides a convenient way to define what properties to set when a component property changes. It does this
   * by mutating the root property passed to it.
   *
   * ```typescript
   * respondTo(property, value, actions);
   * ```
   *
   * where `actions` is of the type `IActionResponse`; it is a dictionary who's keys are
   *
   * The signatures are:
   *
   * ```typescript
   * {
   *   // offsets the base object with the name of the key which has changed
   *   prop1: object,
   *   // offsets the base object with the passed in PATH to the property
   *   prop2: [object, 'foo.bar.baz']
   *   // just like the above except the value is provided by the function
   *   prop3: [object, 'foo.bar.baz', () => any]
   *   // offsets the base object with the name of the key; the value to set to is provided by function
   *   prop4: [object, () => any]
   *   // a function call handles this property entirely by itself
   *   prop5: fn
   * ```
   */
  const respondTo = (prop: K & string, value: T[K], actions: IDictionary) => {
    setProp(prop, value, actions)
  }

  const initializeProps = (actions: IDictionary) => {
    Object.keys(actions).forEach(key => {
      setProp(key, props[key], actions)
    })
  }

  Object.keys(props).forEach(prop => {
    console.log(`watching ${prop} `)

    watch(
      () => ref(props[prop]),
      (current, old) => {
        onChange(prop, current ? current.value : undefined, old ? old.value : undefined)
      },
    )
  })

  return { onPropChange, respondTo, initializeProps }
}
