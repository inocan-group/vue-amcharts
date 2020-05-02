import { IDictionary } from 'common-types'
import { SetupContext, Ref } from '@vue/composition-api'
import {
  IParentRegistry,
  EventMessages,
  IChildConfigurationCallback,
  ConstructorFor,
  IRegistrationStatus,
  IRegistrationInfo,
  IRegistrationType,
} from './registry-types'
import { AmchartError } from '../../errors'
import { IGetChild as IChildDefinition } from './useRegistry'
import { unbox } from '../../shared'

export function childApi<C, P>(
  props: IDictionary,
  context: SetupContext,
  setChild: (type: string, name: string) => void,
  getChild: () => IChildDefinition,
) {
  let configurationEvent: IChildConfigurationCallback<P>

  const parent = (context.parent as unknown) as IParentRegistry
  type types = keyof typeof parent.registrants

  /** get META for registry entry */
  const getComponentMeta = <T extends IDictionary>(fnName: string, type: types, name?: string) => {
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

    return (parent.registrants[type][name] as unknown) as IRegistrationStatus<T>
  }

  const addToRegistration = (property: string | object, value?: any) => {
    const { childType, childName } = getChild()
    if (typeof property === 'object') {
      Object.keys(property).forEach(prop => addToRegistration(prop, property[prop as keyof typeof property]))
    } else {
      parent.acceptChildMessage(EventMessages.addToRegistration, childType, childName, property, value)
    }
  }

  // CHILD API
  return {
    /**
     * Register with the parent component and then await startup events before returning
     * with a reference to the `chart` object.
     */
    register: <TComponent>(
      type: IRegistrationType,
      id: string,
      constructor: ConstructorFor<TComponent>,
      instance: Ref<TComponent>,
    ) => {
      if (!parent.acceptChildRegistration) {
        throw new Error(
          `${type}/${id}'s attempt to register itself with it's parent failed as the parent has not registered as a Parent with useRegistry.`,
        )
      }

      const response = parent.acceptChildRegistration(type, id, constructor, instance)
      setChild(response.type, response.name)
      if (id !== response.name) {
        console.info(`Attempt to register a ${type} with the name "${id}" twice; will use ${response.name} instead`)
      }

      return response
    },

    /**
     * Tells the parent that the child is ready to be configured
     */
    childReady: () => {
      const { childType, childName } = getChild()
      parent.acceptChildMessage(EventMessages.childReady, childType, childName)
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
     * Registers a `configure` function with the Parent -- which can be either sync or async -- that
     * the parent component will call once all children have indicated that they are ready for configuration
     */
    onChartConfig: (fn: IChildConfigurationCallback<P>) => {
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
    getRegistration: <T extends IDictionary = IDictionary>(type: types, name?: string) => {
      return getComponentMeta<T>('getRegistration', type, name)
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
    getComponent: <T extends IDictionary = IDictionary>(type: types & string, name?: string) => {
      const { childType, childName } = getChild()
      const meta = getComponentMeta<T>('getComponent', type, name)
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
      return unbox(meta.instance)
    },

    /**
     * Gives the name of the _first_ component registered for a given _type_. This
     */
    firstComponentName: (type: types) => {
      const { childType, childName } = getChild()
      if (Object.keys(parent.registrants[type]).length === 0) {
        throw new AmchartError(
          `Attempt by the ${childType}/${childName} to get the firstComponentName(${childName}) failed because there are NO registered components of type ${childType}.`,
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
    addToRegistration,
  }
}
