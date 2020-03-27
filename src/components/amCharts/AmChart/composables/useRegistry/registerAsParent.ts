import {
  IChildWithCardinality,
  IRegistrationStatus,
  IParentRegistry,
  EventMessages,
  IChildCardinality,
  ConstructorFor,
  hasParent,
  hasChart as parentHasChart,
} from './registry-types'
import { IDictionary } from 'common-types'
import { dictionaryToArray } from './dictionaryToArray'
import { reactive, Ref, SetupContext } from '@vue/composition-api'
import { unbox } from '../../shared'
import set from 'lodash.set'
import { ILooksLikeChart } from '../useData'
import { AmchartError } from '../../errors'

export const registerAsParent = function(context: SetupContext) {
  return (childrenAndCardinality: IChildWithCardinality[]) => {
    const depSequence = childrenAndCardinality.map(i => i[2])
    const registrants: IDictionary<IDictionary<IRegistrationStatus<any>>> = reactive(
      depSequence.reduce((agg: IDictionary, curr) => {
        agg[curr] = {}
        return agg
      }, {}),
    )
    const cardinality = childrenAndCardinality.reduce(
      (agg: IDictionary<IChildCardinality>, i: IChildWithCardinality) => {
        const [min, max, name] = i
        agg[name] = { min, max }
        return agg
      },
      {},
    )

    /**
     * Iterates first through each _type_ of child component and then through each component in that
     * type. For each component which has defined an `onChartConfig` configuration, it runs this
     * in parallel to other configuration functions of it's _type_
     */
    const childRegistrationsConfigured = async (parent: any): Promise<void> => {
      console.log('all registrations received, no to configure', registrants)

      for await (const type of Object.keys(registrants)) {
        const named = dictionaryToArray(registrants[type])
        await Promise.all([...named.map(i => (i.configure ? i.configure(parent) : undefined)).filter(i => i)])
        Object.keys(registrants[type]).forEach(name => {
          registrants[type][name].configured = true
        })
      }
    }

    // PARENT API
    return {
      /**
       * let's all children run their configuration/setup routines and then return
       */
      configureChildren: async (parent: ILooksLikeChart<any>) => {
        await childRegistrationsConfigured(parent)
      },
      registrants,
      depSequence,
      cardinality,

      /** accept registration requests from children */
      acceptChildRegistration: <TComponent>(
        type: string,
        name: string,
        constructor: ConstructorFor<any>,
        instance: Ref<any>,
      ) => {
        let useName = name
        let index = 2
        const { max } = cardinality[type]
        const quantity = Object.keys(registrants[type]).length
        if (max && quantity >= max) {
          throw new Error(
            `Attempt to register too many ${type} children! The parent has limited the cardinality to a max of ${max}`,
          )
        }

        while (registrants[type][useName]) {
          useName = `${name}${index}`
          index++
        }

        registrants[type][useName] = {
          constructor,
          instance,
          configured: false,
        }

        return useName
      },

      /** accept a message from a child component */
      acceptChildMessage(message: keyof typeof EventMessages, childType: string, childName: string, ...args: any[]) {
        switch (message) {
          case 'unregister':
            delete registrants[childType][childName]
            break
          case 'childReady':
            registrants[childType][childName].readyForConfiguration = true
            break
          case 'addToRegistration':
            const [property, value] = args
            set(registrants, `${childType}.${childName}.${property}`, value)
            break
          case 'requestChartObject':
            if (parentHasChart(context.parent)) {
              return unbox(context.parent.chart)
            } else if (hasParent(context.parent)) {
              return context.parent.acceptChildMessage(EventMessages.requestChartObject, childType, childName)
            } else {
              throw new AmchartError(
                `Failed while trying to find the root chart object for the ${childType}/${childName} component!`,
                `not-found`,
              )
            }
            break

          default:
            console.warn(
              `Got unknown message type -- ${message} [ ${childType}/${childName} ] -- from child component!`,
            )
        }
      },
    } as IParentRegistry
  }
}
