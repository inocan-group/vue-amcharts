import { IDictionary } from 'common-types'
import { SetupContext } from '@vue/composition-api'
import { IParentRegistry, EventMessages, Configuration } from './registry-types'

export function childApi<C, P>(props: IDictionary, context: SetupContext, constructor?: new () => any) {
  const parent = (context.parent as unknown) as IParentRegistry<P>
  type types = keyof typeof parent.registrants
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

    /**
     * **getComponent**
     *
     * Allows a **child** component to ask the **parent** for access to other components. You must state a
     * component _type_ but you can then optionally add the component _name_ if more than one may exist
     * and you know the name.
     */
    getComponent: (type: types, name?: string) => {
      const components = parent.registrants[type]
      if (Object.keys(components).length === 0) {
        throw new Error(`Attempt to get a "${type}" component failed as there are none registered with this chart!`)
      }
      if (!name) {
        name = Object.keys(parent.registrants[type])[0]
      }
      return parent.registrants[type][name]
    },
  }
}
