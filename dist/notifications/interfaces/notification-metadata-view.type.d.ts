import type { KeysOfUnion } from './internal/keys-of-union.type';
import type { NotificationMetadata } from './notification-metadata.type';
import type { ValueOfUnionProperty } from './internal/value-of-union-property.type';
/** Modelo tolerante para UI/push, derivado de todos los campos exactos. */
export type NotificationMetadataView = {
    [TKey in KeysOfUnion<NotificationMetadata>]?: ValueOfUnionProperty<NotificationMetadata, TKey>;
};
