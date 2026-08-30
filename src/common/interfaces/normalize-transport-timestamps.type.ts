import type { TRANSPORT_TIMESTAMP_FROM_WIRE_KEY_MAP } from '../constants';

/**
 * El renombrado de claves del transporte, expresado en TIPOS.
 *
 * ── POR QUÉ DERIVA DEL MAPA Y NO REPITE SUS LITERALES ─────────────────────
 * Acá vivían `'created_at' → 'createdAt'` y `'updated_at' → 'updatedAt'`
 * escritos a mano, o sea la misma decisión que ya toma
 * `TRANSPORT_TIMESTAMP_FROM_WIRE_KEY_MAP`, escrita dos veces. Y las dos copias
 * gobiernan mitades distintas del mismo hecho: el mapa decide qué renombra el
 * RUNTIME —lo leen el normalizador del cliente y su espejo del api— y esto
 * decide qué renombra el TIPO. Agregar una clave al mapa (`deleted_at`, por
 * ejemplo) cambiaba el objeto que llega a la app y dejaba al tipo diciendo que
 * seguía llamándose como en el cable: `tsc` verde sobre una lectura que da
 * `undefined`, en los tres repos.
 *
 * Derivado del mapa, la clave nueva entra sola y no hay una segunda lista que
 * acordarse de tocar. El mapa queda como ÚNICO dueño de qué claves viajan en
 * snake y vuelven en camel, y su docblock es donde se decide agregar una.
 */
type WireTimestampKeyMap = typeof TRANSPORT_TIMESTAMP_FROM_WIRE_KEY_MAP;

export type NormalizeTransportTimestamps<T> =
  T extends readonly (infer TItem)[]
    ? NormalizeTransportTimestamps<TItem>[]
    : T extends object
      ? {
          [TKey in keyof T as TKey extends keyof WireTimestampKeyMap
            ? WireTimestampKeyMap[TKey]
            : TKey]: NormalizeTransportTimestamps<T[TKey]>;
        }
      : T;
