declare module 'hyperdiff' {
  export default function diff<T extends { [key: string]: any }, K extends keyof T = keyof T>(
    prior: T[],
    current: T[],
    idProp?: K,
  ): { added: T[]; removed: T[]; common: T[] }
}
