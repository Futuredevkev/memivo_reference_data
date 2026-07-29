/**
 * Forma de un backup code de 2FA: 8 hex, case-insensitive.
 *
 * Es la tercera pata de la familia. `TOTP_TOKEN_REGEX` y `TWO_FACTOR_TOKEN_REGEX`
 * ya vivían acá; ésta quedó escrita a mano tres veces en el validador del
 * servidor, que es donde se decide si un token es TOTP o backup code. Con las
 * tres juntas, cambiar el largo del código es un solo lugar.
 */
export const BACKUP_CODE_REGEX = /^[A-Fa-f0-9]{8}$/;
