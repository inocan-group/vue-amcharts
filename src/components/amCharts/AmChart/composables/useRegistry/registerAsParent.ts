import {
  IChildWithCardinality,
  IDependencyStatus,
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
    let registrationStatus: IDependencyStatus

    /**
     * returns metrics about the registration queue:
     *
     *    - `remaining` - sequence of deps remaining before setup complete
     *    - `current` - the current dependency _type_ being worked on
     *    - `currentStatus` - the statuses of all dependencies in the current status
     */
    const updateRegistrationProcess = () => {
      const remaining = depSequence.filter(i => !dictionaryToArray(registrants[i]).every(i => i.ready))
      const current = remaining[0]
      const idx = depSequence.indexOf(current)
      const prior = idx === -1 ? undefined : depSequence[idx - 1]
      const currentStatus = dictionaryToArray(registrants[current], 'name').map(i => ({
        name: (i as any).name,
        completed: i.ready,
      }))

      registrationStatus = {
        remaining,
        current,
        prior,
        currentStatus,
      }
      if (currentStatus.length === 0) {
        console.log(`There are zero dependencies under the type "${registrationStatus.current}"`)
      }
      return registrationStatus
    }

    /**
     * Waits until the Parent has been setup; then kicks off the child registrations
     * (serially by _type_)
     */
    const isReadyForChildren = async (): Promise<P> => {
      return new Promise(resolve => {
        ee.on(EventMessages.readyForChildren, (data: P) => {
          console.log('ready for children')
          resolve(data)
        })
      })
    }

    /**
     * receives "completed" events events from individual children and then
     * checks to see if a _type_ has completed and if it has then start next
     * type until all types are complete
     */
    const childRegistrationsComplete = async (data: any): Promise<void> => {
      for await (const type of Object.keys(registrants)) {
        console.log(`configuring children of type ${type}`)
        const named = dictionaryToArray(registrants[type])
        await Promise.all([...named.map(i => i.configure(data))])
        Object.keys(registrants[type]).forEach(name => {
          registrants[type][name].ready = true
        })

        console.log(`configured ${type}`)
      }
    }

    /**
     * puts a child dependency into a wait state until all of it's dependencies are resolved
     */
    const waitForDeps = async (type: string) => {
      const status = updateRegistrationProcess()
      return new Promise(resolve => {
        if (!depSequence.includes(type)) {
          throw new Error(
            `Attempt to wait for the dependency "${type}" is an invalid child type; valid types include: ${depSequence.join(
              ', ',
            )}`,
          )
        }
        if (!status.remaining.includes(type)) {
          console.warn(`The type "${type}" was asked to wait for deps AFTER that type was cleared as finished`)
          resolve()
        }

        ee.on(EventMessages.typeCompleted, (type: string) => {
          console.log('a type completed: ', type, registrationStatus.current)
          const newStatus = registrationStatus
          if (!newStatus.remaining.includes(type)) {
            console.log(`resolving ${type}`)

            resolve()
          }
        })
      })
    }

    return {
      readyForChildren: async (data: P) => {
        const status = updateRegistrationProcess()
        console.log(`starting registration for children ${status.current}`)
        // ee.emit(EventMessages.readyForChildren, data)
        await childRegistrationsComplete(data)
        console.log('fininished child registration process')
      },
      registrants,
      depSequence,
      cardinality: childrenAndCardinality.reduce((agg: IDictionary<IChildCardinality>, i: IChildWithCardinality) => {
        const [min, max, name] = i
        agg[name] = { min, max }
        return agg
      }, {}),
      /** accept registration requests from children */
      acceptChildRegistration: async (type, name, config) => {
        console.log('accepting child configuration', {
          type,
          name,
          registrants,
        })

        registrants[type][name] = {
          ...config,
          ready: false,
        }
        // const data = await isReadyForChildren()
        // await waitForDeps(type)
        // registrants[type][name].started = true
        // registrants[type][name].registration(data)
      },
      /** accept a message from a child component */
      acceptChildMessage(
        message: keyof typeof EventMessages,
        childType: string,
        childName: string,
        options?: IDictionary,
      ) {
        console.log(`recieved message ${message}`, childType, childName)

        switch (message) {
          case EventMessages.childCompleted:
            // registrants[childType][childName].ready = true
            console.log('PARENT: child completed', {
              childType,
              childName,
            })
            ee.emit(EventMessages.childCompleted, childType, childName)
            break
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
