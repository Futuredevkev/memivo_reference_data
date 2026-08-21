/**
 * Un punto en el mapa: las dos coordenadas y nada más.
 *
 * ── POR QUÉ NO TRAE NI PRECISIÓN NI ALTURA NI RUMBO ────────────────────────
 * Porque nada las dibuja. El teléfono las sabe —`expo-location` las devuelve
 * en el mismo objeto— y guardarlas «por si acaso» sería superficie muerta con
 * forma de dato (ORDEN §7), encima sobre el camino de escritura más caliente
 * del producto: en un compartir en vivo esto se manda una vez por minuto.
 *
 * ── POR QUÉ ES UN OBJETO Y NO DOS CAMPOS SUELTOS EN EL MENSAJE ─────────────
 * Una latitud sin su longitud no significa nada, así que las dos son UN dato.
 * Sueltas, cada consumidor tendría que acordarse de chequear las dos, y la
 * fila podría quedar con media coordenada — que es justo lo que el CHECK de la
 * tabla no tendría cómo expresar.
 */
export interface ChatLocationPoint {
    readonly latitude: number;
    readonly longitude: number;
}
