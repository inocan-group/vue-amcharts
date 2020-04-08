export function uuid() {
  return new Date().getTime() + '-' + Math.random().toString(4)
}
