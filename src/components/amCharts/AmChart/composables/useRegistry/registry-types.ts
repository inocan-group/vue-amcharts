import { IDictionary } from 'common-types'

export interface IChildChartConfig<P> {
  (data: P): Promise<void> | void
}

export interface IRegistrationStatus<T> extends IRegistrationConfig<T> {
  /** the child has completed setup */
  ready: boolean
}

export interface IRegistrationConfig<T = any> extends IDictionary {
  // TODO: see if we can't type this better
  instance?: IDictionary
  /**
   * a callback function provide by the child component as part of it's `onChartConfig` lifecycle hook
   */
  configure?: IChildChartConfig<T>

  /** the name of the property which should be set for given type of axis */
  dataField?: string
  /** the name of the property which this axis is on (aka, 'xAxis', 'yAxis') */
  axis?: string
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
  /**
   * Allows components to add additional information to their registration with the parent
   */
  addToRegistration = 'addToRegistration',
}

export interface IParentRegistry<P> {
  registrants: IDictionary<IDictionary<IRegistrationStatus<P>>>
  depSequence: string[]
  cardinality: IDictionary<IChildCardinality>
  configureChildren(data: P): void
  /** accept registration from child components */
  acceptChildRegistration(type: string, name: string, config: IRegistrationConfig<P>): void
  /** accept messages from child components */
  acceptChildMessage(message: string, type: string, name: string, ...args: any[]): void
}

/** provide the min, max of cardinality and then the name of the child */
export type IChildWithCardinality = [number, number | null, string]

export interface IDependencyStatus {
  remaining: string[]
  prior: undefined | string
  current: string
  currentStatus: Array<{ name: string; completed: boolean }>
}
