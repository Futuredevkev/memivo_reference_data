/**
 * Lo que el cliente le pide al PROXY del catálogo. Nunca al proveedor.
 *
 * ── LO QUE NO ESTÁ ACÁ ES LA PARTE IMPORTANTE ──────────────────────────────
 * No hay `rating`, y su ausencia es una decisión de seguridad, no un olvido:
 * el filtro de contenido lo fija el SERVIDOR desde una constante y ningún
 * campo de la request lo puede pisar. Es la única barrera de moderación que
 * esta feature va a tener —el catálogo es ajeno y nadie de la casa lo cura—,
 * así que un `rating` que viajara en el body sería un freno que elige el
 * cliente. Mismo eje que `ChatLiveLocationDuration`, y por el mismo motivo.
 *
 * Tampoco hay tamaño de página: lo fija el servidor. Un cliente que pida diez
 * mil resultados quema la cuota de la clave para todos los demás.
 */
export interface StickerSearchRequest {
    /**
     * Vacío o ausente = tendencias. `q` es el nombre del query-string: usar otro
     * nombre acá obligaría al cliente a traducir el wire shape en el call-site y
     * dejaría al DTO del borde sin una interfaz que implementar.
     */
    readonly q?: string;
    /**
     * Cursor OPACO de la página siguiente, tal como lo devolvió la respuesta
     * anterior. Opaco a propósito: su forma es del proveedor, y el cliente no
     * habla ese idioma (ver {@link StickerReference}).
     */
    readonly cursor?: string;
}
