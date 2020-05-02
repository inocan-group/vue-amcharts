/**
 * Allows values which are _falsy_ but NOT 0 or the Boolean `false` to be changed to _undefined_ which often
 * tells amCharts to "use the default" whatever that may be.
 *
 * Note, `0` and `false` often DO have a real meaning and that is why they are being excluded
 *
 * @param value the value of the property
 */
export function allowUndefined(value: any) {
  const falsy = [null, undefined, '', -1, '-1']
  return falsy.includes(value) ? undefined : value
}
