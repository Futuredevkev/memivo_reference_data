/**
 * Cuántos caracteres tiene un código de respaldo de 2FA.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * Es el mismo que ya pagó `TOTP_TOKEN_LENGTH`, sin pagar de este lado. El 8
 * estaba publicado, pero SÓLO adentro de dos cuantificadores de regex
 * —`BACKUP_CODE_REGEX` y la rama hex de `TWO_FACTOR_TOKEN_REGEX`—, y un
 * cuantificador no es un número que se le pueda pasar a un tope de campo. Así
 * que el cliente lo tenía tipeado a mano en una constante propia derivada «a
 * ojo» de la regex, y nada cruzaba las dos: el día que el código de respaldo
 * cambiara de largo, el campo donde se escribe seguiría capando en 8.
 *
 * ── POR QUÉ ES EL TOPE DEL CAMPO Y NO `TOTP_TOKEN_LENGTH` ─────────────────
 * El campo de segundo factor acepta las DOS cosas: un TOTP de seis dígitos o un
 * código de respaldo de ocho hex. El tope de ese campo es el más largo de los
 * dos, y el más largo es éste. Apuntarlo a `TOTP_TOKEN_LENGTH` cortaría el
 * código de respaldo en el sexto carácter, que es justo la salida que le queda
 * a quien perdió el autenticador.
 *
 * ── POR QUÉ LA REGEX NO SE DERIVA DE ACÁ ─────────────────────────────────
 * Por el mismo motivo escrito en `TOTP_TOKEN_LENGTH`: `dto-string-length-cap`
 * del api indexa los patrones leyendo el LITERAL de la regex y sólo acepta
 * cuantificadores de dígitos literales, y falla cerrado. Derivarla cambiaría un
 * número tipeado dos veces por un gate ciego. Lo que ata los dos es un caso:
 * `test/backup-code-regex-matches-its-length.test.js`.
 */
export const BACKUP_CODE_LENGTH = 8;
