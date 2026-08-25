/**
 * De qué catálogo externo viene un sticker.
 *
 * ── POR QUÉ TIENE UN SOLO MIEMBRO, Y NO ES UN DESCUIDO ─────────────────────
 * El proveedor está decidido —GIPHY, con clave beta, 23 de agosto de 2026— y
 * los dos candidatos que perdieron NO se declaran acá. Declararlos dejaría dos
 * ramas que producción no puede alcanzar, que es lo que ORDEN §7 persigue y lo
 * que su Apéndice B prohíbe con todas las letras; y además ensuciaría el grep,
 * que es lo que esta casa usa como lista de consumidores.
 *
 * Los términos de servicio de GIPHY lo refuerzan desde el otro lado: prohíben
 * mezclar sus resultados con los de otro proveedor sin permiso escrito. O sea
 * que mudarse de catálogo es REEMPLAZAR, nunca sumar — y un enum de dos
 * miembros describiría un estado que el contrato con el proveedor no permite.
 *
 * ── QUÉ COMPRA ENTONCES ESTE ENUM DE UN MIEMBRO ────────────────────────────
 * Que el segundo proveedor tenga que ser una DECISIÓN y no un descuido. La
 * columna `provider` de la tabla, su clave única y el `Record` total que la
 * acompaña cuestan cero hoy, y el día que alguien agregue un miembro `tsc` no
 * compila hasta que se conteste qué hace ese proveedor en cada lugar.
 *
 * No es una rareza en este árbol: `ModerationCaseStatus` y
 * `ModerationCaseEvidenceType` del api tienen exactamente un miembro, por lo
 * mismo.
 */
export declare enum StickerProvider {
    GIPHY = "GIPHY"
}
