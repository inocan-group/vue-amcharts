import { IPropChange, IChangeValues, IPropertyChangeAction, ActionDictionary } from './props-types'
import set from 'lodash.set'
import { IDictionary } from 'common-types'
import { AmchartError } from '../../errors'

/**
 * Takes action on previously configured action configuration at the point
 * that a property has changed (or is being intialized).
 *
 * @param prop the property which action is being taken on
 * @param action the action signature
 */
export function takeAction<TProps, TChart extends IDictionary, TComponent extends IDictionary>(
  prop: keyof TProps & string,
  actions: ActionDictionary<TProps, TComponent, TChart>,
  current: any,
) {
  const action = actions[prop]

  if (Array.isArray(action)) {
    // ARRAY signatures (first param is always the base chart object to operate on)
    const [comp, two, three] = action

    if (typeof two === 'string' && !three) {
      set(comp, two, current)
    } else if (typeof two === 'function' && !three) {
      set(comp, prop, two(current))
    } else if (typeof two === 'string' && typeof three === 'function') {
      set(comp, two, three(current))
    } else {
      throw new AmchartError(
        `Failed to take action on a property action as the signature of the action was not understood: [${typeof comp}, ${typeof two}, ${typeof three}]`,
        `invalid-action`,
      )
    }
  } else {
    // NON-array signatures
    if (typeof action === 'function') {
      // action is a function
      action(current)
    } else {
      // action is the chart object
      set(action, prop, current)
    }
  }
}
