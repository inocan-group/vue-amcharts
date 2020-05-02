import { Percent } from '@amcharts/amcharts4/core'

/**
 * Allows values which may be of type Number or String to be set as a Number or as a amChart Percent
 * class when defined as a string that terminates in the % character.
 *
 * If the conversion of a non-Number results in a NaN then `undefined` will be set instead
 * and a warning will be sent to the console.
 *
 * If an empty string, a null value, or _undefined_ is encountered, this will be set as _undefined_.
 *
 * @param value the value of the property
 */
export function toNumberOrPercent(
  value: number | string | undefined | null,
  defaultValue?: number | string | undefined,
): number | Percent | undefined {
  const falsy: Array<string | number | undefined | null | false> = [null, undefined, '', 'undefined', false]
  if (falsy.includes(value)) {
    return (defaultValue as unknown) as number
  }

  let numOrPercent: number | Percent | undefined =
    typeof value === 'string' &&
    value
      .trim()
      .replace('px', '')
      .slice(-1) === '%'
      ? new Percent(Number(value.trim().replace('%', '')))
      : Number(value)
  if (typeof numOrPercent === 'number' && !falsy.includes(value) && Number.isNaN(numOrPercent)) {
    console.warn(
      `Use of the toNumberOrPercent() function was passed an invalid value; values must be convertable to a number or be a string ending in a % character and "${value}" was passed in! To continue operation, the value has been set to the specified default value of ${defaultValue}.`,
    )
    numOrPercent =
      typeof defaultValue === 'string' ? new Percent(Number(defaultValue.replace('%', ''))) : Number(defaultValue)
  }

  return numOrPercent
}
