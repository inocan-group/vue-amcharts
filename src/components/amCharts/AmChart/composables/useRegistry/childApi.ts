import { IDictionary } from 'common-types'
import { SetupContext } from '@vue/composition-api'
import { IParentRegistry, EventMessages, Configuration } from './registry-types'

export function childApi<C, P>(props: IDictionary, context: SetupContext, constructor?: new () => any) {
  const parent = (context.parent as unknown) as IParentRegistry<P>
  let childType: string
  let childName: string

  return {
    /**
     * Register with the parent component and then await startup events before returning
     * with a reference to the `chart` object.
     */
    register: async (type: string, name: string, configure: Configuration<P>, options: IDictionary = {}) => {
      childType = type
      childName = name
      if (!parent.acceptChildRegistration) {
        throw new Error(
          `${type}/${name}'s attempt to register itself with it's parent failed as the parent has not registered as a Parent with useRegistry.`,
        )
      }

      parent.acceptChildRegistration(type, name, { ...options, configure, constructor })
    },

    /**
     * Signal to the parent that this component is exiting the chart
     */
    unregister: () => {
      parent.acceptChildMessage(EventMessages.unregister, childType, childName)
    },
  }
}
