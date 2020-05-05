import { Ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { AmchartError } from '../../errors'

export interface IInitializationFunction<TChart> {
  (chart: Ref<TChart>): void
}

/**
 * Provides a means for consumers to intercept the initialization of the
 * amChart object (chart, series, etc.) prior to it being added to the DOM.
 *
 * The consumer will hook into the initialize function like so:
 *
 * ```html
 * <xy-chart :initialize="myInitializer"></xy-chart>
 * ```
 *
 * and then when the `XYChart` initializes it will call the `myInitializer` function and
 * pass it a _reactive_ chart object (aka., `Ref<XYChart>`) in this example right before
 * putting it into the DOM. The caller now has the ability to do whatever they like with it.
 */
export function useInitialize<TProps extends IDictionary, TChart>(props: TProps, object: Ref<TChart>) {
  if (props.initialize) {
    if (typeof props.initialize !== 'function') {
      throw new AmchartError(
        `A property for "initialize" was passed in but it was NOT a callback function!`,
        `invalid-handler`,
      )
    }

    props.initialize(object.value)
  }
}
