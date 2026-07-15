export type NormalizeTransportTimestamps<T> =
  T extends readonly (infer TItem)[]
    ? NormalizeTransportTimestamps<TItem>[]
    : T extends object
      ? {
          [TKey in keyof T as TKey extends 'created_at'
            ? 'createdAt'
            : TKey extends 'updated_at'
              ? 'updatedAt'
              : TKey]: NormalizeTransportTimestamps<T[TKey]>;
        }
      : T;
