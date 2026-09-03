const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

/**
 * LOS CUANTIFICADORES DEL CÓDIGO DE RESPALDO DICEN LO MISMO QUE `BACKUP_CODE_LENGTH`.
 *
 * ── POR QUÉ ESTE CASO Y NO UNA DERIVACIÓN ────────────────────────────────
 * Es el gemelo de `totp-regex-matches-its-length.test.js` y existe por el mismo
 * motivo escrito allá: la regex no puede construirse con el número porque
 * `dto-string-length-cap.spec.ts` del api indexa los patrones leyendo el
 * LITERAL y falla cerrado sobre un cuantificador que no logra resolver. Así que
 * el número se publica al lado y esto impide que se separen.
 *
 * ── POR QUÉ MIRA DOS ARCHIVOS Y NO UNO ───────────────────────────────────
 * El 8 del código de respaldo está escrito DOS veces en esta misma carpeta:
 * en `BACKUP_CODE_REGEX`, que es la forma sola, y en la rama hex de
 * `TWO_FACTOR_TOKEN_REGEX`, que es la que el api aplica sobre el campo donde se
 * escriben las dos formas. El gate del TOTP mira un solo archivo y por eso deja
 * pasar la segunda copia; acá se miran las dos, porque una que divergiera
 * dejaría al servidor aceptando un largo y al campo capando otro.
 *
 * ── LO QUE NO VE ─────────────────────────────────────────────────────────
 * Que el patrón sea el correcto para un código de respaldo. Afirma que los tres
 * lugares cuentan la MISMA cantidad de caracteres, no que esa cantidad esté
 * bien elegida.
 */
const CONSTANTES = path.join(__dirname, '..', 'src', 'auth', 'constants');
const SOLO_LA_FORMA = path.join(CONSTANTES, 'backup-code-regex.constant.ts');
const LAS_DOS_FORMAS = path.join(CONSTANTES, 'two-factor-token-regex.constant.ts');

/** `[A-Fa-f0-9]{N}`: la rama hexadecimal, en cualquiera de los dos patrones. */
const CUANTIFICADOR_HEX = /\[A-Fa-f0-9\]\{(\d+)\}/;

const cuantificadorDe = (archivo) => {
  const fuente = fs.readFileSync(archivo, 'utf8');
  const match = fuente.match(CUANTIFICADOR_HEX);

  assert.ok(
    match,
    `${path.basename(archivo)} dejó de tener un cuantificador \`[A-Fa-f0-9]{N}\` ` +
      'literal: si se derivó del número, `dto-string-length-cap` del api cuenta ' +
      'el campo como NO acotado',
  );
  return Number(match[1]);
};

test('los dos patrones del código de respaldo cuentan BACKUP_CODE_LENGTH', () => {
  const {
    BACKUP_CODE_LENGTH,
  } = require('../dist/auth/constants/backup-code-length.constant');

  assert.strictEqual(
    cuantificadorDe(SOLO_LA_FORMA),
    BACKUP_CODE_LENGTH,
    'BACKUP_CODE_REGEX y la constante cuentan distinta cantidad de caracteres',
  );
  assert.strictEqual(
    cuantificadorDe(LAS_DOS_FORMAS),
    BACKUP_CODE_LENGTH,
    'la rama hex de TWO_FACTOR_TOKEN_REGEX y la constante cuentan distinta ' +
      'cantidad de caracteres: el servidor aceptaría un largo y el campo caparía otro',
  );
});
