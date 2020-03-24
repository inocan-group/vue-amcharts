import { IDictionary } from 'common-types'
import { IActionConfiguration } from '..'
import { unbox } from '../../shared'
import set from 'lodash.set'
import { AmchartError } from '../..'

/**
 * Works as the _actionable_ part of the `respondTo` and `initializeProps` methods.
 * It's responsibility is to change state in an appropriate manner based on a _single_
 * properties's change.
 * 
 * @param baseObj the base object which is being set
 * @param prop the property within the action configuration which is being changed
 * @param deltas the `before` and `after` of the given project
 * @param actions the action config for the given property which has changed
 */
export function setProp(baseObj: IDictionary, prop: string, actions: IActionConfiguration) {
  return (prop: string, value: any, actionConfig: IDictionary) => {
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
          set(unbox(base), offset, optFn ? optFn() : value)
        } else if (typeof offset === 'function') {
          set(unbox(base), offset(), value)
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
