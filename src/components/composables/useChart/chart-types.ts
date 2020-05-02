import { IRegistrationInfo, IChildWithCardinality } from '../useRegistry/registry-types'

export const chartProperties = {
  width: {
    type: [String, Number],
    default: '100%',
  },
  height: {
    type: [String, Number],
    default: '100%',
  },
}

export type IRegistryOptions =
  | IChildWithCardinality[]
  | { cardinality: IChildWithCardinality[]; options: IRegistrationInfo['parentOptions'] }

export function noRegistrationOptions(registration: IRegistryOptions): registration is IChildWithCardinality[] {
  return Array.isArray(registration)
}
