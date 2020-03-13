import { IDictionary } from 'common-types'

export interface Configuration<P> {
  (data: P): Promise<void>
}

export interface IRegistrationStatus<T> extends IRegistrationConfig<T> {
  /** the child has completed setup */
  ready: boolean
}

export interface IRegistrationConfig<T> extends IDictionary {
  constructor?: new () => any
  /** a callback function to let the child configure itself */
  configure: Configuration<T>
}

export interface IChildCardinality {
  min: number
  max: number | null
}

export enum EventMessages {
  /**
   * the parent component has completed it's setup and it is now time to start running the
   * child dependency _type_ by _type_
   */
  readyForChildren = 'readyForChildren',
  /** all dependencies of a particular _type_ have completed the setup/registration process */
  typeCompleted = 'typeCompleted',
  /** a named dependency has completed */
  childCompleted = 'childCompleted',
  /** a _child_ component has registered */
  register = 'register',
  /** a _child_ component has unregistered */
  unregister = 'unregister',
}

export interface IParentRegistry<P> {
  registrants: IDictionary<IDictionary<IRegistrationStatus<P>>>
  depSequence: string[]
  cardinality: IDictionary<IChildCardinality>
  configureChildren(data: P): void
  /** accept registration from child components */
  acceptChildRegistration(type: string, name: string, config: IRegistrationConfig<P>): void
  /** accept messages from child components */
  acceptChildMessage(message: string, type: string, name: string, options?: IDictionary): void
}

/** provide the min, max of cardinality and then the name of the child */
export type IChildWithCardinality = [number, number | null, string]

export interface IDependencyStatus {
  remaining: string[]
  prior: undefined | string
  current: string
  currentStatus: Array<{ name: string; completed: boolean }>
}
