import { IDictionary } from 'common-types'
import { Ref, SetupContext } from '@vue/composition-api'
import { unbox } from '../../shared'

export interface IEventSurface extends IDictionary {
  events: {
    on: (type: any, callback: (event: IGeneralizedEvent) => void, context?: any, shouldClone?: boolean) => any
    off: (type: any, callback?: (event: any) => void, context?: any) => void
    [key: string]: any
  }
}

export type IGeneralizedEvent = IDictionary & { target: any }

export type IEventConfig = IDictionary<string>

/**
 * Takes in a _chart object_ which exposes events and a configuration hash
 * and ensures that VueJS custom events which are passed up to the containing
 * component.
 *
 * ```typescript
 * useEvents(series, context, {
 *  someamchartevent: 'onSomeEvent'
 * })
 * ```
 *
 * Then container has:
 *
 * ```html
 * <my-chart-component @onSomeEvent="handler" />
 * ```
 *
 * In this example, the component would be ensured that any `someamchartevent` event on
 * the `series` object passed in would be _emitted_ as a VueJS event with a _type_ of
 * `onSomeEvent`.
 */
export function useEvents<T extends IEventSurface | Ref<IEventSurface>>(
  chartObj: T,
  context: SetupContext,
  config: IEventConfig,
) {
  const surface = unbox(chartObj)
  const emitter = (name: string) => (evt: IGeneralizedEvent) => {
    context.emit(name, evt.target)
  }
  Object.keys(config).forEach(evtName => {
    surface.events.on(evtName, emitter(config[evtName]))
  })
}
