const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

/**
 * EL CUANTIFICADOR DE `TOTP_TOKEN_REGEX` DICE LO MISMO QUE `TOTP_TOKEN_LENGTH`.
 *
 * ── POR QUÉ ESTE CASO Y NO UNA DERIVACIÓN ────────────────────────────────
 * Lo natural sería construir la regex con el número —`new RegExp(`^\\d{${TOTP_TOKEN_LENGTH}}$`)`—
 * y ahí no habría nada que atar. No se puede: `dto-string-length-cap.spec.ts`
 * del api indexa los patrones leyendo el LITERAL de la regex y sólo acepta
 * cuantificadores escritos con dígitos, y declara que un `@Matches` cuyo patrón
 * no logra resolver cuenta como NO acotado —falla cerrado—. Con la regex
 * derivada, el `token` de `EnableTwoFactorDto` quedaría sin cota y ese gate en
 * rojo.
 *
 * Así que la regex se queda literal y el número se publica al lado, y lo que
 * impide que se separen es esto: se lee el FUENTE de la constante y se compara
 * su cuantificador contra el número. Sin este caso, el 6 estaría escrito dos
 * veces en el mismo directorio sin nada que los cruce, que es exactamente el
 * defecto que publicar `TOTP_TOKEN_LENGTH` vino a cerrar.
 *
 * ── LO QUE NO VE ─────────────────────────────────────────────────────────
 * Que el patrón sea el correcto para un TOTP. Afirma que los dos símbolos
 * cuentan la MISMA cantidad de dígitos, no que esa cantidad esté bien elegida.
 */
const FUENTE = path.join(__dirname, '..', 'src', 'auth', 'constants', 'totp-token-regex.constant.ts');
const CUANTIFICADOR = /\\d\{(\d+)\}/;

test('el cuantificador de TOTP_TOKEN_REGEX es TOTP_TOKEN_LENGTH', () => {
  const { TOTP_TOKEN_LENGTH } = require('../dist/auth/constants/totp-token-length.constant');
  const fuente = fs.readFileSync(FUENTE, 'utf8');
  const match = fuente.match(CUANTIFICADOR);

  assert.ok(
    match,
    'el patrón dejó de tener un cuantificador `\\d{N}` literal: si se derivó del ' +
      'número, `dto-string-length-cap` del api cuenta el campo como NO acotado',
  );
  assert.strictEqual(
    Number(match[1]),
    TOTP_TOKEN_LENGTH,
    'la regex y la constante cuentan distinta cantidad de dígitos',
  );
});
