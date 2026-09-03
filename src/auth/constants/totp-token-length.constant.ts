/**
 * Cuántos dígitos tiene un código TOTP.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * El 6 estaba publicado, pero SÓLO adentro de `TOTP_TOKEN_REGEX = /^\d{6}$/`, y
 * un cuantificador de regex no es un número que se pueda interpolar en una
 * frase ni pasarle a un `maxLength`. Así que el mismo 6 estaba tipeado a mano en
 * cuatro lugares más: el `message:` del DTO del api, el `maxLength` de la
 * pantalla de ajustes del cliente, y las instrucciones del autenticador en los
 * tres idiomas.
 *
 * ── OJO CON EL ATAJO ──────────────────────────────────────────────────────
 * `VERIFICATION_CODE_LENGTH` también vale 6 y ya estaba publicada, pero es el
 * código que Memivo manda por MAIL: otro concepto. Apuntar el TOTP a esa
 * constante fabricaría un falso dueño único, y el día que el código de mail pase
 * a 8 la pantalla del autenticador mentiría.
 *
 * ── POR QUÉ LA REGEX NO SE DERIVA DE ACÁ ─────────────────────────────────
 * Porque `dto-string-length-cap.spec.ts` del api indexa los patrones leyendo el
 * LITERAL de la regex y sólo acepta cuantificadores de dígitos literales, y
 * falla cerrado por decisión escrita: una regex construida con `new RegExp` o
 * con un cuantificador interpolado deja al campo del DTO contado como NO
 * acotado. Derivarla cambiaría un número tipeado dos veces por un gate ciego.
 *
 * Lo que ata los dos, entonces, no es la derivación sino un caso:
 * `test/totp-regex-matches-its-length.test.js` compara el cuantificador de la
 * regex contra este número.
 */
export const TOTP_TOKEN_LENGTH = 6;
