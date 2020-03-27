import { IDictionary } from 'common-types'
import { Ref, SetupContext } from '@vue/composition-api'
import { ILooksLikeChart } from '../useData'

export type ConstructorFor<T> = new () => T

/**
 * A function which a component defines to configure itself at the appropriate
 * time (aka, when the parent instructs it to)
 */
export interface IChildConfigurationCallback<TParent> {
  (component: TParent): Promise<void> | void
}

/** validates that the parent component IS registered as a parent */
export function hasParent(parent: SetupContext['parent']): parent is IParentRegistry & SetupContext['parent'] {
  return (parent as any).acceptChildRegistration ? true : false
}

/**
 * validates
 */
export function hasChart(
  parent: SetupContext['parent'],
): parent is { chart: Ref<null | ILooksLikeChart<any>> } & SetupContext['parent'] {
  return (parent as any).chart ? true : false
}

/** the same as `IRegistrationConfig but with "configured" as a required param */
export interface IRegistrationStatus<T> extends IRegistrationConfig<T> {
  /** the child has completed initialization/configuration */
  configured: boolean
}

export interface IRegistrationConfig<TComponent extends IDictionary = IDictionary> {
  instance: Ref<TComponent>
  constructor: new () => TComponent
  /**
   * a callback function provide by the child component as part of it's `onChartConfig` lifecycle hook
   */
  configure?: IChildConfigurationCallback<TComponent>

  /**
   * The child component HAS been configured
   */
  configured?: boolean
  /**
   * The child component has registered all hooks and is ready to be asked to configure itself
   */
  readyForConfiguration?: boolean
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
  /** A child has registered all hooks and is now ready for configuration */
  childReady = 'childReady',
  /** a _child_ component has unregistered */
  unregister = 'unregister',
  /**
   * Allows components to add additional information to their registration with the parent
   */
  addToRegistration = 'addToRegistration',
  /** requests the root chart object from parent (and parents parents where required) */
  requestChartObject = 'requestChartObject',
}

export interface IParentRegistry {
  registrants: IDictionary<IDictionary<IRegistrationStatus<any>>>
  depSequence: string[]
  cardinality: IDictionary<IChildCardinality>
  configureChildren(data: ILooksLikeChart<any>): Promise<void>
  /** accept registration from child components */
  acceptChildRegistration<TComponent extends IDictionary = IDictionary>(
    type: string,
    name: string,
    constructor: ConstructorFor<TComponent>,
    instance: Ref<TComponent>,
  ): string
  /** accept messages from child components */
  acceptChildMessage: IChildMessage
}

/** provide the min, max of cardinality and then the name of the child */
export type IChildWithCardinality = [number, number | null, string]

export interface IDependencyStatus {
  remaining: string[]
  prior: undefined | string
  current: string
  currentStatus: Array<{ name: string; completed: boolean }>
}

export interface IAddToRegistration {
  (message: EventMessages.addToRegistration, type: string, name: string, property: string, value: any): void
}

export interface IBasicChildMessage<T, O = void> {
  (message: T, type: string, name: string): O
}
/** child message that it has all hooks in place and is ready to be configured */
export type IChildReady = IBasicChildMessage<EventMessages.childReady>
export type IUnregister = IBasicChildMessage<EventMessages.unregister>
export type IRequestChartObject = IBasicChildMessage<EventMessages.requestChartObject, ILooksLikeChart<any>>

export type IChildMessage = IAddToRegistration & IChildReady & IUnregister & IRequestChartObject
