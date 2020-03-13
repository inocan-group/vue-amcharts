import {
  IChildWithCardinality,
  IRegistrationStatus,
  IParentRegistry,
  EventMessages,
  IChildCardinality,
} from './registry-types'
import { CombinedVueInstance } from 'vue/types/vue'
import { IDictionary } from 'common-types'
import { EventEmitter } from 'events'
import { dictionaryToArray } from './dictionaryToArray'
import { reactive } from '@vue/composition-api'

export const registerAsParent = function<P>(parent: CombinedVueInstance<any, any, any, any, any> & IParentRegistry<P>) {
  const ee = new EventEmitter()

  return (childrenAndCardinality: IChildWithCardinality[]) => {
    const depSequence = childrenAndCardinality.map(i => i[2])
    const registrants: IDictionary<IDictionary<IRegistrationStatus<P>>> = reactive(
      depSequence.reduce((agg: IDictionary, curr) => {
        agg[curr] = {}
        return agg
      }, {}),
    )

    /**
     * receives "completed" events events from individual children and then
     * checks to see if a _type_ has completed and if it has then start next
     * type until all types are complete
     */
    const childRegistrationsComplete = async (data: any): Promise<void> => {
      for await (const type of Object.keys(registrants)) {
        const named = dictionaryToArray(registrants[type])
        await Promise.all([...named.map(i => i.configure(data))])
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
      acceptChildMessage(
        message: keyof typeof EventMessages,
        childType: string,
        childName: string,
        options?: IDictionary,
      ) {
        switch (message) {
          case 'unregister':
            delete registrants[childType][childName]
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
