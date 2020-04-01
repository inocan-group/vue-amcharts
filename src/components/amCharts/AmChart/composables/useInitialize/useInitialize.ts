import { Ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { AmchartError } from '../../errors'

/**
 * Provides a means for consumers to intercept the initialization of the
 * amChart object (chart, series, etc.) prior to it being added to the DOM.
 */
export function useInitialize<TProps extends IDictionary, TChart>(props: TProps, object: Ref<TChart>) {
  if (props.initialize) {
    if (typeof props.initialize !== 'function') {
      throw new AmchartError(
        `A property for "initialize" was passed in but it was NOT a callback function!`,
        `invalid-handler`,
      )
    }

    props.initialize(object)
  }
}
