import { onMounted, ref, Ref, SetupContext } from '@vue/composition-api'
import { Axis, Chart } from '@amcharts/amcharts4/charts'
import { IDictionary } from 'common-types'

export function useAxis<T extends Axis>(props: IDictionary, context: SetupContext) {
  const parent = context.parent
  const axis: Ref<T | null> = ref(null)

  return {
    axis,
  }
}
