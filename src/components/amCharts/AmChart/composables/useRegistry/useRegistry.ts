import { IDictionary } from 'common-types'
import { SetupContext } from '@vue/composition-api'
import { registerAsParent } from './registerAsParent'
import { childApi } from './childApi'
import { hasParent, hasChart, EventMessages } from './registry-types'
import { unbox } from '../../shared'
import { ILooksLikeChart } from '../useData'
import { AmchartError } from '../../errors'

export interface IGetChild {
  childType: string
  childName: string
}

/**
 * Sets up registry functions for _child_, _parent_, or **both**.
 */
export function useRegistry<P, C = any>(props: IDictionary, context: SetupContext) {
  let childType: string = ''
  let childName: string = ''

  const getChild = () => {
    return { childType, childName }
  }
  const setChild = (type: string, name: string) => {
    childType = type
    childName = name
  }

  return {
    /**
     * returns a boolean flag to indicate whether the given Vue component has a registered parent
     */
    hasRegisteredParent() {
      return hasParent(context.parent)
    },
    /**
     * Requests from the parent component (and recursively upward) for the root chart object.
     */
    getChart<T extends ILooksLikeChart<any> = ILooksLikeChart<any>>(): T {
      if (!childType && !childName) {
        console.info('attempt to get root chart before component is registered')
        return {} as T
      }
      if (hasParent(context.parent) && hasChart(context.parent)) {
        const chart = unbox(context.parent.chart)
        if (chart === null) {
          throw new AmchartError(
            `After unboxing the the chart reference, the value was NULL which indicates that it has not yet been placed into the DOM!`,
            `not-ready`,
          )
        }
        return chart as T
      } else if (hasParent(context.parent)) {
        console.log(`couldn't find chart in ${childType}/${childName}; asking parent to look`)

        return context.parent.acceptChildMessage(EventMessages.requestChartObject, childType, childName) as T
      } else {
        throw new AmchartError(
          `Could not find the chart object! The parent of this component is neither registered as a child (so we can explore its parent) nor does it export a "chart" object!`,
          `not-found`,
        )
      }
    },
    /**
     * Registers a component as a parent of other components.
     *
     * Note: the order of the children components will determine the order which the parent
     * sets up the components.
     */
    registerAsParent: registerAsParent(context),

    ...childApi<C, P>(props, context, setChild, getChild),
  }
}
