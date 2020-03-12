import { IDictionary } from 'common-types'
import { SetupContext, reactive } from '@vue/composition-api'
import { CombinedVueInstance } from 'vue/types/vue'
import { EventEmitter } from 'events'

export interface IRegistrationStatus<T> {
  constructor: new () => any
  instance?: any
  registration: IRegistrationCallback<T>
  /** the child has has been signaled to start the setup routine */
  kickedOff: boolean
  /** the child has completed setup */
  ready: boolean
}

export type IRegistrationConfig<T> = Omit<IRegistrationStatus<T>, 'ready' | 'kickedOff'>

export interface IChildCardinality {
  min: number
  max: number | null
}

export enum EventMessages {
  readyForChildren = 'readyForChildren',
  completed = 'completed',
  unregister = 'unregister',
}

export interface IRegistry<P> {
  registrants: IDictionary<IDictionary<IRegistrationStatus<P>>>
  depSequence: string[]
  cardinality: IDictionary<IChildCardinality>
  readyForChildren(data: P): void
  acceptChildRegistration(type: string, name: string, config: IRegistrationConfig<P>): Promise<P>
  acceptChildMessage(message: string, type: string, name: string, options: IDictionary): void
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
  let parentClass: P
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
        const registrants: IDictionary<IDictionary<IRegistrationStatus<P>>> = reactive(
          depSequence.reduce((agg: IDictionary, curr) => {
            agg[curr] = {}
            return agg
          }, {}),
        )
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
            ee.on(EventMessages.completed, (dep: string) => {
              const currentStep = registrants[dep]
              if (Object.keys(currentStep).length === 0) {
                ee.emit(EventMessages.completed, dep)
              }
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
            ee.on(EventMessages.readyForChildren, (data: P) => {
              console.log('ready for children')
              resolve(data)
            })
          })
        }

        return {
          readyForChildren: (data: P) => {
            console.log('emit')
            parentClass = data
            ee.emit(EventMessages.readyForChildren, data)
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
          acceptChildRegistration: async (type, name, config) => {
            console.log({ type, name, registrants })

            registrants[type][name] = {
              ...config,
              kickedOff: false,
              ready: false,
            }
            console.log('wait for parent')
            const obj = await isReadyForChildren()
            console.log('parent ready')

            const data = await waitForDeps(type)
            registrants[type][name].kickedOff = true
            console.log(`kicked off ${type}`)
            await registrants[type][name].registration(parentClass)
            console.log(`completed ${type}/${name}`)
            registrants[type][name].ready = true

            ee.emit(EventMessages.completed, { type, name })
            return obj
          },
          /** accept a message from a child component */
          acceptChildMessage(message: keyof typeof EventMessages, type: string, name: string, options?: IDictionary) {
            console.log(`recieved message ${message}`)

            switch (message) {
              case EventMessages.completed:
                registrants[type][name].ready = true
                ee.emit(EventMessages.completed, { type, name })
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
    register: async (type: string, name: string, config: IRegistrationConfig<P>) => {
      childType = type
      childName = name
      if (!parent.acceptChildRegistration) {
        throw new Error(
          `${type}/${name}'s attempt to register itself with it's parent failed as the parent has not registered as a Parent with useRegistry.`,
        )
      }

      parent.acceptChildRegistration(type, name, config)
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
