import { IDictionary } from 'common-types'
import { SetupContext } from '@vue/composition-api'
import { setProp } from './shared'
import { IActionConfiguration } from './useProps'

export type IConsumerProperties = IActionConfiguration | [IActionConfiguration, IActionConfiguration]

/**
 * **useCustomize**
 *
 * Allows a _consumer_ of this library to add custom properties (aka, component attributes) to a component
 * and have the properties passed in be added both be added to the VueJS reactivity system as well as
 * effect change on the underlying components chart component in the appropriate manner.
 */
export function useCustomize<
  P extends IDictionary = IDictionary<unknown>,
  I = IDictionary,
  K extends keyof P = keyof P
>(props: I, context: SetupContext, chartInstance: P) {
  const attributes = context.attrs
  let consumerProperties: {
    onSetup: IActionConfiguration
    onChange: IActionConfiguration
  } = {
    onSetup: undefined,
    onChange: undefined,
  }

  /**
   * given a stated set of attributes/props, sets up a watcher to detect change on all
   */
  const watchAttributes = (props: string[]) => {
    // TODO: implement
  }

  /**
   * unwatches custom properties which are no longer going to be watched
   */
  const unwatchAttributes = (props: string[]) => {
    // TODO: implement
  }

  /**
   * Allows users to add VueJS properties (strictly speaking these would be _attributes_) that this
   * component will respond to when changes are detected and set cooresponding properities on the
   * chart and/or subcomponents.
   *
   * The output of this function is either a single `IActionConfiguration` dictionary or an array with two.
   * If you want to distinguish between actions involved in the initial configuration versus
   * subsequent property changes you should go with the _array_ signature:
   *
   * ```typescript
   * addProperties( axis => {
   *    const onSetup: IActionConfiguration = { ... }
   *    const onChange: IActionConfiguration = { ... }
   *    return [ onSetup, onChange ]
   * })
   * ```
   */
  const addProperties = (fn: (parent: P) => IConsumerProperties) => {
    const [onSetup, onChange] = fn(chartInstance)
    if (consumerProperties) {
      console.warn(`Setting custom properties but existing properties exist. Old properties will be replaced`, {
        old: { onSetup, onChange },
        new: onSetup,
      })
    }
    consumerProperties = onChange ? { onSetup, onChange } : { onSetup, onChange: onSetup }
    const allProperties = Array.from(
      new Set(Object.keys(consumerProperties.onSetup).concat(Object.keys(consumerProperties.onChange))),
    )
    watchAttributes(allProperties)
  }

  /**
   * When a custom property is detected as changed it will will
   */
  // const onAttributeChange: (prop, value, old) => {
  // setProp(prop, value, consumerProperties.onChange)
  // }

  return { addProperties }
}
