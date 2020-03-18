import {
  IChildWithCardinality,
  IRegistrationStatus,
  IParentRegistry,
  EventMessages,
  IChildCardinality,
} from './registry-types'
import { IDictionary } from 'common-types'
import { dictionaryToArray } from './dictionaryToArray'
import { reactive } from '@vue/composition-api'

export const registerAsParent = function<P>() {
  return (childrenAndCardinality: IChildWithCardinality[]) => {
    const depSequence = childrenAndCardinality.map(i => i[2])
    const registrants: IDictionary<IDictionary<IRegistrationStatus<P>>> = reactive(
      depSequence.reduce((agg: IDictionary, curr) => {
        agg[curr] = {}
        return agg
      }, {}),
    )

    /**
     * Iterates through each _type_ of child component and then each component in that
     * category. For each child component, it looks for the `onChartConfig` configuration
     * and executes it if available.
     */
    const childRegistrationsComplete = async (data: any): Promise<void> => {
      for await (const type of Object.keys(registrants)) {
        const named = dictionaryToArray(registrants[type])
        await Promise.all([...named.map(i => (i.configure ? i.configure(data) : undefined)).filter(i => i)])
        Object.keys(registrants[type]).forEach(name => {
          registrants[type][name].ready = true
        })
      }
    }

    // PARENT API
    return {
      configureChildren: async (data: P) => {
        await childRegistrationsComplete(data)
      },
      registrants,
      depSequence,
      cardinality: childrenAndCardinality.reduce((agg: IDictionary<IChildCardinality>, i: IChildWithCardinality) => {
        const [min, max, name] = i
        agg[name] = { min, max }
        return agg
      }, {}),

      /** accept registration requests from children */
      acceptChildRegistration: (type, name, config) => {
        registrants[type][name] = {
          ...config,
          ready: false,
        }
      },

      /** accept a message from a child component */
      acceptChildMessage(message: keyof typeof EventMessages, childType: string, childName: string, ...args: any[]) {
        switch (message) {
          case 'unregister':
            delete registrants[childType][childName]
            break
          case 'addToRegistration':
            const [property, value] = args
            registrants[childType][childName][property] = value
            break
          default:
            console.warn(
              `Got unknown message type -- ${message} [ ${childType}/${childName} ] -- from child component!`,
            )
        }
      },
    } as IParentRegistry<P>
  }
}
