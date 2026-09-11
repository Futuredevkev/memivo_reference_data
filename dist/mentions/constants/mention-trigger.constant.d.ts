/**
 * El carácter que abre una mención, y el que su texto lleva adelante.
 *
 * Es contrato y no detalle de la app porque las dos puntas lo leen: la app
 * para detectar dónde empieza la consulta del autocompletado, y el servidor
 * para verificar que la anotación cae sobre el nombre que dice (la invariante
 * de {@link mentionMatchesText} compara contra `MENTION_TRIGGER + nombre`).
 * Escrito como literal en cada lado, un cambio de uno solo dejaría a todas las
 * menciones inválidas sin que ningún tipo lo note.
 */
export declare const MENTION_TRIGGER = "@";
