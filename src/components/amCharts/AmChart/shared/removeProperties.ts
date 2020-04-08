import { IDictionary } from 'common-types'

export function removeProperties<T extends IDictionary = IDictionary, K extends keyof T & string = keyof T & string>(
  dictionary: IDictionary,
  ...remove: K[]
) {
  const output = { ...dictionary }
  remove.forEach(item => {
    delete output[item]
  })

  return output
}
