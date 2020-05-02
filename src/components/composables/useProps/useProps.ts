import { IDictionary } from 'common-types'
import { watch, ref, Ref } from '@vue/composition-api'
import { IActionConfiguration, IPropChange } from './props-types'
import { unbox } from '../../shared'
import { takeAction } from '.'
import { AmchartError } from '../../errors'

/**
 * Get notified of any component properties which change by importing the `onPropChange` hook
 */
export function useProps<
  TChart extends IDictionary = IDictionary,
  TProps extends IDictionary = IDictionary<unknown>,
  TComponent extends IDictionary = IDictionary,
  K extends keyof TProps = keyof TProps
>(props: TProps, component: Ref<TComponent>, getChart: () => TChart) {
  // CALLBACKS
  let registeredOnChangeEvent: IPropChange<TProps>
  let actionsConfigCallback: IActionConfiguration<TProps, TComponent, TChart> | undefined = undefined

  /**
   * **onPropChange**
   *
   * Consumes a sync or _async_ function which is called whenever a VueJS _prop_ has changed.
   * The function will be passed the `property` that changed, the new `value` of the prop and the `old`
   * value for context so it can take the appropriate actions:
   *
   * ```typescript
   * onPropChange( (prop, value, old ) => { ... })
   * ```
   *
   * **Note:** _this "hook" is often used in conjunction with the `respondTo` export from **useProps**
   * to map VueJS props to the appropriate action/change. See `respondTo` for more info._
   *
   * ```typescript
   * onPropChange(async (prop: string, current) => {
   *  respondTo(prop, current, propertyConfig)
   * })
   * ```
   */
  const onPropChange = (fn: IPropChange<TProps>) => {
    registeredOnChangeEvent = fn
  }

  /**
   * Provides consumers a means to define actions to take when the component's
   * properties change:
   *
   * ```typescript
   * actionsConfig((component, chart, deltas) => ({
   *  // reflexive property setting
   *  stroke: component,
   *  // reflexive with functional intervention
   *  strokeWidth: [component, v => Number(v)]
   *  // offset property setting
   *  disableTicks: [ component, 'ticks.template.disabled' ],
   *  // offset with functional intervention
   *  fill: [ component, 'template.fill', v => color(v) ]
   *  // pure functional intervention
   *  fancy: () => { ... }
   * }))
   * ```
   */
  const actionsConfig = (fn: IActionConfiguration<TProps, TComponent, TChart>) => {
    actionsConfigCallback = fn
  }

  /**
   * Executed when VueJS property change is detected
   *
   * @param prop the property which has changed
   */
  const onChange = (prop: string, current: TProps[K] | undefined, old: TProps[K] | undefined) => {
    const chart = getChart()
    if (registeredOnChangeEvent) {
      registeredOnChangeEvent(prop, current, old)
    } else if (actionsConfigCallback) {
      const actions = actionsConfigCallback(unbox(component), chart, { prop, current, old })
      takeAction<TProps, TChart, TComponent>(prop, actions, current)
    }
  }

  /**
   * **respondTo**
   *
   * Allows triggering the _actions config_ for a particular property; this is primarily made available
   * for consumers who are using the `onPropChange` handler (which disables the immediate execution of the
   * _actions config_ to provide finer grain control).
   *
   * > **Note:** internally this function is also used by the `initializeProps` method to iterate over all
   * properties to initialize state
   */
  const respondTo = (prop: K & string, value: TProps[K]) => {
    if (actionsConfigCallback) {
      const chart = getChart()
      const actions = actionsConfigCallback(unbox(component), chart, { prop, current: value, old: undefined })
      takeAction<TProps, TChart, TComponent>(prop, actions, value)
    } else {
      throw new AmchartError(
        `The call to "respondTo" was made despite there being no action configuration defined!`,
        `not-allowed`,
      )
    }
  }

  const initializeProps = async () => {
    if (actionsConfigCallback) {
      const chart = getChart()
      const actions = actionsConfigCallback(unbox(component), chart)
      Object.keys(actions).forEach(prop => {
        takeAction<TProps, TChart, TComponent>(prop, actions, props[prop])
      })
    } else {
      throw new AmchartError(
        `The call to "initializeProps" in the ${
          component.value?.prototype?.name ? component.value?.prototype?.name : 'unknown'
        } component was made despite there being no action configuration defined!`,
        `not-allowed`,
      )
    }
  }

  // WATCH non-`data` property changes
  Object.keys(props).forEach(prop => {
    if (prop !== 'data') {
      watch(
        () => ref(props[prop]),
        (current, old) => {
          onChange(prop, current ? current.value : undefined, old ? old.value : undefined)
        },
      )
    }
  })

  return {
    onPropChange,
    respondTo,
    actionsConfig,
    initializeProps,
  }
}
