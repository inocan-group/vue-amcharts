import { IDictionary } from 'common-types'
import { SetupContext } from '@vue/composition-api'
import { IParentRegistry, EventMessages, IChildChartConfig } from './registry-types'
import { AmchartError } from '../../errors'
import { IGetChild } from './useRegistry'
import { IChart } from '../..'
let childType: string
let childName: string

export function childApi<C, P>(
  props: IDictionary,
  context: SetupContext,
  setChild: (type: string, name: string) => void,
  getChild: () => IGetChild,
) {
  let configurationEvent: IChildChartConfig<P>

  const parent = (context.parent as unknown) as IParentRegistry<P>
  type types = keyof typeof parent.registrants

  /** get META for registry entry */
  const getComponentMeta = (fnName: string, type: types, name?: string) => {
    const { childType, childName } = getChild()
    if (Object.keys(parent.registrants[type]).length === 0) {
      throw new AmchartError(
        `Attempt to call ${fnName}(${type}${
          name ? `, ${name}` : ''
        }) --  in the component ${childType}/${childName} -- failed because there are NO components registered of type ${type}!`,
        'no-registry',
      )
    }
    const firstKey = Object.keys(parent.registrants[type])[0]
    if (!name) {
      return parent.registrants[type][firstKey]
    }

    if (!parent.registrants[type][name] || Object.keys(parent.registrants[type][name]).length === 0) {
      throw new AmchartError(
        `Attempt to call ${fnName}(${type}${
          name ? `, ${name}` : ''
        }) -- from the ${childType}/${childName} component -- was not registered in the parent registry!`,
        'not-registered',
      )
    }

    return parent.registrants[type][name]
  }

  // CHILD API
  return {
    /**
     * Register with the parent component and then await startup events before returning
     * with a reference to the `chart` object.
     */
    register: async (type: string, name: string, options: IDictionary = {}) => {
      console.log('parent', parent)

      if (!parent.acceptChildRegistration) {
        throw new Error(
          `${type}/${name}'s attempt to register itself with it's parent failed as the parent has not registered as a Parent with useRegistry.`,
        )
      }

      const assignedName = parent.acceptChildRegistration(type, name, options)
      if (name !== assignedName) {
        console.info(`Attempt to register a ${type} with the name "${name}" twice; will use ${assignedName} instead`)
      }
      setChild(type, assignedName)
    },

    /**
     * Signal to the parent that this component is exiting the chart
     */
    unregister: () => {
      const { childType, childName } = getChild()
      parent.acceptChildMessage(EventMessages.unregister, childType, childName)
    },

    /**
     * **onChartConfig**
     *
     * An event that is fired by the parent component when it is asking for the child
     * to configure itself. In most cases this is the child-components first opportunity
     * to interact with e prepared DOM (although the _parent_ basically gets to decide
     * precise timing).
     */
    onChartConfig: (fn: IChildChartConfig<P>) => {
      const { childType, childName } = getChild()

      configurationEvent = fn
      parent.acceptChildMessage(EventMessages.addToRegistration, childType, childName, 'configure', fn)
    },

    /**
     * Gets all _meta_ data for a given registry entry in the parent. You must state a registry _type_ but
     * you may optionally leave off the _name/id_ of the particular component and this function will instead
     * return the first item of that type.
     *
     * If a registration is not found then a `AmchartError` will be thrown with a code of _no-registry_.
     */
    getRegistration: (type: types, name?: string) => {
      return getComponentMeta('getRegistration', type, name)
    },

    /**
     * **getComponent**
     *
     * Allows a **child** component to ask the **parent** for access to other components. You must state a
     * component _type_ but you can then optionally add the component _name_ if more than one may exist
     * and you know the name.
     *
     * **Note:** attempt to locate an _instance_ of the given component but will throw an error (code
     * of `no-registry` or `no-instance`) if not found
     */
    getComponent: <T = IDictionary>(type: types, name?: string) => {
      const meta = getComponentMeta('getComponent', type, name)
      if (!meta.instance) {
        throw new AmchartError(
          `The getComponent(${type}${
            name ? `, ${name}` : ''
          }) call from the ${childType}/${childName} component found the registration entry but no "instance" property! Properties found were: ${Object.keys(
            meta,
          )}`,
          'no-instance',
        )
      }
      return meta.instance as T
    },

    /**
     * Gives the name of the _first_ component registered for a given _type_. This
     */
    firstComponentName: (type: types) => {
      if (Object.keys(parent.registrants[type]).length === 0) {
        throw new AmchartError(
          `Attempt by the ${childType}/${childName} to get the firstComponentName(${type}) failed because there are NO registered components of type ${type}.`,
          'no-component',
        )
      }

      return Object.keys(parent.registrants[type])[0]
    },

    /**
     * Looks up in the registry how many of a given _type_ of component are registered
     */
    howMany: (type: types) => {
      return Object.keys(parent.registrants[type]).length
    },

    /**
     * **addToRegistration**
     *
     * Allows children components to add to their registration information with the parent at run time
     */
    addToRegistration: (property: string, value: any) => {
      const { childType, childName } = getChild()

      parent.acceptChildMessage(EventMessages.addToRegistration, childType, childName, property, value)
    },
  }
}
