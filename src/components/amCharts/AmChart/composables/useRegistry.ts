import { IDictionary } from 'common-types'
import { SetupContext } from '@vue/composition-api'
import { CombinedVueInstance } from 'vue/types/vue'
import { IChart } from '../ChartTypes'
import { EventEmitter } from 'events'

export interface IRegistrationStatus {
  constructor: new () => any
  instance?: any
  /** the child has has been signaled to start the setup routine */
  kickedOff: boolean
  /** the child has completed setup */
  ready: boolean
}

export type IRegistrationConfig = Omit<IRegistrationStatus, 'ready' | 'kickedOff'>

export interface IChildCardinality {
  min: number
  max: number | null
}

export interface IRegistry<T> {
  registrants: IDictionary<IDictionary<IRegistrationStatus>>
  depSequence: string[]
  cardinality: IDictionary<IChildCardinality>
  readyForChildren(data: T): T
  acceptChildRegistration<T>(type: T & string, name: string, config: IRegistrationConfig): Promise<IChart>
  acceptChildMessage<T>(message: string, type: T & string, name: string, options: IDictionary)
}

/** provide the min, max of cardinality and then the name of the child */
export type IChildWithCardinality = [number, number | null, string]

export interface IRegistrationCallback<T> {
  (data: T): void
}

export function useRegistry<P>(props: IDictionary, context: SetupContext) {
  const parent: CombinedVueInstance<any, any, any, any, any> = context.parent
  let childType: string
  let childName: string
  const ee = new EventEmitter()

  return {
    /**
     * Registers a component as a parent of other components.
     *
     * Note: the order of the children components will determine the order which the parent
     * sets up the components.
     */
    registerAsParent: (childrenAndCardinality: IChildWithCardinality[]) => {
      const registry = (childrenAndCardinality: IChildWithCardinality[]) => {
        const depSequence = childrenAndCardinality.map(i => i[2])
        const registrants = depSequence.reduce((agg, curr) => {
          agg[curr] = {}
          return agg
        }, {})
        /** puts a child into a wait state until all deps are resolved */
        const waitForDeps = async (type: string) => {
          return new Promise(resolve => {
            const idx = depSequence.indexOf(type) - 1
            if (idx === -2) {
              throw new Error(
                `Attempt to wait for the dependency "${type}" is an invalid child type; valid types include: ${depSequence.join(
                  ', ',
                )}`,
              )
            }
            if (idx === -1) {
              resolve()
            }
            const priorStep = depSequence[idx]
            ee.on('completed', (dep: keyof typeof depSequence) => {
              if (dep === priorStep) {
                resolve()
              }
            })
          })
        }
        /**
         * waits until the Parent has been setup; allowing for children to start
         * contributing
         */
        const isReadyForChildren = async (): Promise<P> => {
          return new Promise(resolve => {
            ee.on('readyForChildren', data => resolve(data))
          })
        }

        return {
          readyForChildren: (data: P) => {
            ee.emit('readyForChildren', data)
          },
          registrants,
          depSequence,
          cardinality: childrenAndCardinality.reduce(
            (agg: IDictionary<IChildCardinality>, i: IChildWithCardinality) => {
              const [min, max, name] = i
              agg[name] = { min, max }
              return agg
            },
            {},
          ),
          /** accept registration requests from children */
          async acceptChildRegistration(type: string, name: string, config: IRegistrationConfig) {
            registry[type][name] = {
              ...config,
              kickedOff: false,
              ready: false,
            }
            const obj: P = await isReadyForChildren()
            await waitForDeps(type)
            return obj
          },
          /** accept a message from a child component */
          acceptChildMessage(message: string, type: string, name: string, options?: IDictionary) {
            switch (message) {
              case 'ready':
                registrants[type][name].ready = true
                break
              case 'unregister':
                delete registrants[type][name]
                break
              default:
                console.warn(`Got unknown message type -- ${message} [ ${type}/${name} ] -- from child component!`)
            }
          },
        } as IRegistry<P>
      }

      return registry(childrenAndCardinality)
    },

    /**
     * Register with the parent component and then await startup events before returning
     * with a reference to the `chart` object.
     */
    register: async (type: string, name: string, config: IRegistrationConfig, callback: IRegistrationCallback<P>) => {
      childType = type
      childName = name
      if (!parent.acceptChildRegistration) {
        throw new Error(
          `${type}/${name}'s attempt to register itself with it's parent failed as the parent has not registered as a Parent with useRegistry.`,
        )
      }

      return parent.acceptChildRegistration(type, name, config)
    },

    /**
     * Signal to the parent that this component has completed the steps needed to be started
     */
    done: () => {
      parent.acceptChildMessage('ready', childType, childName)
    },

    /**
     * Signal to the parent that this component is exiting the chart
     */
    unregister: () => {
      parent.acceptChildMessage('unregister', childType, childName)
    },
  }
}
