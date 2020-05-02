import { IDictionary } from 'common-types'

export interface IChangeDelta<TProp, TPropType> {
  prop: TProp & string
  current: TPropType | undefined
  old: TPropType | undefined
}

export type IPostSetCallback = () => void

/**
 * The action configuration of a given properties type -- `TProp`, (which is a property in the larger set of properties
 * defined in the typing for the _props_ dictionary) -- and the possible signatures it can take
 */
export type IPropertyChangeAction<TValue, TComponent> =
  /** If you just pass in the component then it will set `[TComponent][propChanged]` to new value */
  | TComponent
  /** reflexive name with function to modify value to be set */
  | [TComponent, IPropertyValueFunction<TValue>]
  /** reflexive name with function to modify value to be set (with post-set callback) */
  | [TComponent, IPropertyValueFunction<TValue>, IPostSetCallback]
  /** set the value to a fixed path off the base component */
  | [TComponent, string]
  /** set the value to a fixed path off the base component, value must pass through function to get final value */
  | [TComponent, string, IPropertyValueFunction<TValue>]
  /**
   * set the value to a fixed path off the base component, then run value through a function to get final value,
   * finally call the callback to do any remaining work
   */
  | [TComponent, string, IPropertyValueFunction<TValue>, IPostSetCallback]
  /** run a bespoke function */
  | IPropertyValueFunction<TValue>

export type IPropertyValueFunction<T> = (v: T) => any

export function isPropertyValueFunction<TValue>(
  thingy: IPropertyChangeAction<TValue, any>,
): thingy is IPropertyValueFunction<TValue> {
  return typeof thingy === 'function' ? true : false
}

/**
 * A function reponsible for reacting to a particular properties change in value; most typically this is a
 * `prop` passed into a component but can also represent a user defined `attribute`.
 *
 * Each _signature_ of this type of callback function receives the same inputs:
 *
 * @param deltas describes the change ... including the _property name_ as well as the _before_ and _after_ values.
 * For instance:
 * ```typescript
 * { property: 'name', before: 'foo', after: 'bar' }
 * ```
 * @param action this is the proscribed action to take when the given property has changed ... it can take on several
 * signatures and you should refer to `IPropertyChangeAction` for full overview
 *
 * @param chartComponent this is a reference the charting component directly being managed by the component which you
 * are configuring (e.g., a _series_, _legend_, etc.). This is more typically used by external users who are defining
 * an attribute which they want to respond than internal component authors because the internal author should already
 * have this variable in local scope.
 *
 * @param chart a reference to the parent `chart` component; if you are configuring at the parent level then this
 * property is a duplicate of the `chartComponent`
 */
export type IActionConfiguration<
  TProps extends IDictionary = IDictionary,
  TComponent extends IDictionary = IDictionary,
  TChart extends IDictionary = IDictionary,
  K extends keyof TProps & string = keyof TProps & string
> = (
  chartComponent: TComponent,
  chart: TChart,
  deltas?: IChangeDelta<K, TProps[K]>,
) => ActionDictionary<TProps, TComponent, TChart>

export type ActionDictionary<
  TProps extends IDictionary,
  TComponent,
  TChart,
  TKey extends string = keyof TProps & string
> = {
  [K in TKey]: IPropertyChangeAction<TProps[K], TComponent>
}

export interface IPropChange<TProps extends IDictionary, K extends string & keyof TProps = keyof TProps & string> {
  (prop: string, value: TProps[K] | undefined, old: TProps[K] | undefined): void
}

/**
 * Values needed to feed a property change; used to pass into and action the change
 */
export interface IChangeValues<
  TProps extends IDictionary,
  TChart,
  TComponent,
  K extends keyof TProps & string = keyof TProps & string
> {
  prop: K
  chart: TChart
  component: TComponent
  current: TProps[K] | undefined
  old: TProps[K] | undefined
}
