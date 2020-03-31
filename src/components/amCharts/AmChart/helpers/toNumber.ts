/**
 * Allows values which may be of type Number or String to be set as a Number.
 *
 * If the conversion of a non-Number results in a NaN then `undefined` will be set instead
 * and a warning will be sent to the console.
 *
 * If an empty string, a null value, or _undefined_ is encountered, this will be set as _undefined_.
 *
 * @param value the value of the property
 */
export function toNumber(value: number | string | undefined | null, defaultValue?: number | undefined): number {
  const falsy: Array<string | number | undefined | null | false | 'undefined'> = [
    null,
    undefined,
    '',
    'undefined',
    false,
  ]
  if (falsy.includes(value)) {
    return (defaultValue as unknown) as number
  }

  let numValue: number | undefined = Number(value)
  if (!falsy.includes(value) && Number.isNaN(numValue)) {
    console.warn(
      `Use of the toNumber() function was passed an invalid value; values must be convertable to a number and "${value}" was passed in, resulting in NaN! To continue operation, the value has been set to undefined for now.`,
    )
    numValue = defaultValue
  }
  return ((falsy.includes(value) ? defaultValue : numValue) as unknown) as number
}
