export type ValueOfUnionProperty<T, TKey extends PropertyKey> = T extends unknown ? TKey extends keyof T ? T[TKey] : never : never;
