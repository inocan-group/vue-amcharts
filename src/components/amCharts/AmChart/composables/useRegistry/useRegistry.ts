import { IDictionary } from 'common-types'
import { SetupContext } from '@vue/composition-api'
import { registerAsParent } from './registerAsParent'
import { childApi } from './childApi'

let childType: string
let childName: string

function setChild(type: string, name: string) {
  childType = type
  childName = name
}

export interface IGetChild {
  childType: string
  childName: string
}

function getChild(): IGetChild {
  return { childType, childName }
}

/**
 * Sets up registry functions for _child_, _parent_, or **both**.
 */
export function useRegistry<P, C = any>(props: IDictionary, context: SetupContext) {
  return {
    /**
     * Registers a component as a parent of other components.
     *
     * Note: the order of the children components will determine the order which the parent
     * sets up the components.
     */
    registerAsParent: registerAsParent<P>(),

    ...childApi<C, P>(props, context, setChild, getChild),
  }
}
