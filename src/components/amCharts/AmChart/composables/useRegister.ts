import { IDictionary } from 'common-types'
import { SetupContext } from '@vue/composition-api'

/**
 * Registers a component as a parent of other components
 */
export function registerAsParent(props: IDictionary, context, children: string[]) {
  //
}

/**
 *
 * @param props
 * @param context
 * @param type
 */
export function register(props: IDictionary, context: SetupContext, type: string) {}

export function ready() {}

export function unregister() {}
