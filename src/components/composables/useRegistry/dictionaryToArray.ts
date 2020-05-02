import { IDictionary } from 'common-types'

export function dictionaryToArray<T = any>(dictionary: IDictionary<T>, saveKeyToProperty?: string) {
  const keys = Object.keys(dictionary)
  return keys.reduce((agg: T[], key) => {
    const value = saveKeyToProperty ? { ...dictionary[key], [saveKeyToProperty]: key } : dictionary[key]
    agg.push(value)
    return agg
  }, [])
}
