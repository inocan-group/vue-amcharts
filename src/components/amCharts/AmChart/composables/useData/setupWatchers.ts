import { IUrlInfo, IUrlProperty } from './use-data-types'
import { watch, ref, reactive } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { unbox } from '../../shared'
import { decomposeUrl } from '.'

/**
 * sets up watchers on the `url` and `data` properties
 */
export function setupPropertyWatchers<TProps extends IDictionary, TData>(
  props: TProps,
  onDataChange: (current: TData[], prior: TData[]) => void,
  onUrlChange: (current: IUrlInfo<TData>, prior: IUrlInfo<TData>) => void,
) {
  // DATA
  watch(
    () => ref(props.data),
    (current, prior) => {
      onDataChange(current?.value as TData[], prior?.value as TData[])
    },
  )

  // URL
  if (!props.data) {
    const watchThisMotherFucker = reactive(props)

    watch(
      () => ref(watchThisMotherFucker.url as IUrlProperty<TData>),
      (current, prior) => {
        const c = decomposeUrl<TData>(unbox(current))
        const p = decomposeUrl<TData>(unbox(prior))

        onUrlChange(c, p)
      },
    )
  } else {
    console.info('not watching URL because the data property is being passed in', props.data)
  }
}
