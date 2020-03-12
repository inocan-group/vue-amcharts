import { IDictionary } from 'common-types'
import { SetupContext } from '@vue/composition-api'
import { registerAsParent } from './registerAsParent'
import { childApi } from './childApi'

/**
 * Sets up registry functions for _child_, _parent_, or **both**.
 */
export function useRegistry<P, C = any>(props: IDictionary, context: SetupContext, constructor?: new () => any) {
  return {
    /**
     * Registers a component as a parent of other components.
     *
     * Note: the order of the children components will determine the order which the parent
     * sets up the components.
     */
    registerAsParent: registerAsParent<P>(parent),

    ...childApi<C, P>(props, context, constructor),
  }
}
