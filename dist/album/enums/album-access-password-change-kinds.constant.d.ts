/**
 * Los tres desenlaces posibles de un cambio de contraseña de acceso.
 *
 * Es una tupla `as const` y no un enum porque de ella sale el tipo
 * [AlbumAccessPasswordChangeKind], y porque así el cliente puede recorrerla para
 * comprobar que su tabla de frases los contesta a TODOS (ORDEN §6).
 */
export declare const ALBUM_ACCESS_PASSWORD_CHANGE_KINDS: readonly ["enabled", "changed", "removed"];
