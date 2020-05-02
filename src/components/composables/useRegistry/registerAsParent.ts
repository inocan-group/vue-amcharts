import {
  IChildWithCardinality,
  IRegistrationStatus,
  IParentRegistry,
  EventMessages,
  IChildCardinality,
  ConstructorFor,
  hasParent,
  hasChart as parentHasChart,
  IChildConfigurationCallback,
  IRegistrationType,
  IRegistrationInfo,
} from './registry-types'
import { IDictionary, wait } from 'common-types'
import { dictionaryToArray } from './dictionaryToArray'
import { reactive, Ref, SetupContext } from '@vue/composition-api'
import { unbox } from '../../shared'
import set from 'lodash.set'
import { AmchartError } from '../../errors'

export const registerAsParent = function(context: SetupContext) {
  return (childrenAndCardinality: IChildWithCardinality[], parentOptions: IRegistrationInfo['parentOptions']) => {
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

    const allChildrenReady = () => {
      for (const type of Object.keys(registrants)) {
        for (const name of Object.keys(registrants[type])) {
          if (!registrants[type][name].readyForConfiguration) {
            console.log(`The ${type}/${name} component is not yet ready`)

            return false
          }
        }
      }
      return true
    }

    /**
     * Iterates first through each _type_ of child component and then through each component in that
     * type. For each component which has defined an `onChartConfig` configuration, it runs this
     * in parallel to other configuration functions of it's _type_
     */
    const configureChildren = async (parent: any, count?: number): Promise<void> => {
      if (allChildrenReady()) {
        for await (const type of Object.keys(registrants)) {
          const named = dictionaryToArray(registrants[type])
          const configFns = named
            .filter(i => i && i.configure !== undefined)
            .map(i => i.configure) as IChildConfigurationCallback<any>[]

          await Promise.all(configFns.map(i => i(parent)))

          Object.keys(registrants[type]).forEach(name => {
            registrants[type][name].configured = true
          })
        }
      } else {
        if (count && count > 5) {
          throw new AmchartError(
            `The chart ${parent.prototype.name} timed out waiting for children to be ready for configuration`,
            `time-out`,
          )
        }
        await wait(100)
        count = count ? count + 1 : 1
        configureChildren(parent, count)
      }
    }

    // PARENT API
    return {
      registrants,
      depSequence,
      cardinality,

      configureChildren,

      /** accept registration requests from children */
      acceptChildRegistration: <TComponent>(
        type: IRegistrationType,
        name: string,
        constructor: ConstructorFor<any>,
        instance: Ref<any>,
      ) => {
        let useName = name

        const correctedType = typeof type === 'function' ? type(parentOptions) : type

        const { max } = cardinality[correctedType]
        const quantity = Object.keys(registrants[correctedType]).length
        if (max && quantity >= max) {
          throw new Error(
            `Attempt to register too many ${correctedType} children! The parent has limited the cardinality to a max of ${max}`,
          )
        }

        let index = 2
        while (registrants[correctedType][useName]) {
          useName = `${name}${index}`
          index++
        }

        registrants[correctedType][useName] = {
          constructor,
          instance,
          configured: false,
        }

        return { name: useName, type: correctedType, ...(parentOptions ? { parentOptions } : {}) }
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
