import { ref, Ref, SetupContext } from 'vue'
import { Axis } from '@amcharts/amcharts4/charts'
import { IDictionary } from 'common-types'

export function useAxis<T extends Axis>(props: IDictionary, context: SetupContext) {
  const parent = context.parent
  const axis: Ref<T | null> = ref(null)

  return {
    axis,
  }
}
