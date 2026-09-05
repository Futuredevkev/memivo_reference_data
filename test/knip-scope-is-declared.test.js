const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join, resolve } = require('node:path');

const ROOT = resolve(__dirname, '..');

/**
 * LO QUE `knip` NO MIDE ACÁ ESTÁ DECLARADO, Y SU DUEÑO EXISTE.
 *
 * ── EL DEFECTO QUE CIERRA, medido el 5 de septiembre de 2026 ────────────
 * Este repo corría knip **6.34.0** mientras sus tres hermanos corrían 6.4.1, y
 * nadie lo veía porque los cuatro `package.json` declaraban el mismo `^6.4.1`.
 * Al alinear las cuatro versiones —pin EXACTO, lo sostiene
 * `audit:shared-tooling`— el `dead` de este repo se puso **ROJO con 279
 * miembros de enum sin usar**, y ahí quedó a la vista lo que la divergencia
 * tapaba: **las dos versiones no hacían la misma pregunta**. El verde anterior
 * no era limpio, era otra medición.
 *
 * ── POR QUÉ LOS 279 NO SON CÓDIGO MUERTO, Y QUIÉN LO CONTESTA ───────────
 * Porque este repo es una LIBRERÍA: sus lectores viven en `memivo_api` y en
 * `memivo_client`, que knip no puede ver. Un miembro como `PollStatus.EXPIRED`
 * no lo lee nadie ACÁ y lo leen los dos consumidores. Medirlo desde adentro es
 * imposible por construcción, y se probó: declarar los diecinueve barrels de
 * dominio como `entry` no mueve ni uno de los 279, porque knip 6.4.1 mide uso
 * **por miembro** y no por símbolo exportado.
 *
 * Así que la regla se apaga y **la pregunta se delega al instrumento que sí
 * puede contestarla**: `audit:consumers`, que lee el `src/` de los dos
 * consumidores como hermanos en disco y reporta el símbolo del contrato que
 * nadie cruza. Este gate no acepta la delegación de palabra: **sigue el
 * puntero** (ORDEN §10) y verifica que ese auditor de verdad mire enums y que
 * de verdad esté encadenado al ritual.
 *
 * ── ALCANCE DECLARADO (ORDEN §10) ──────────────────────────────────────
 * · Afirma que la config diga lo que este docblock explica y que su delegación
 *   exista. **No corre knip** ni verifica que el árbol esté limpio: eso es
 *   `npm run dead`, que ya está en `quality`.
 * · `ignoreExportsUsedInFile: true` sigue puesto, con el punto ciego que ORDEN
 *   §7 ya mide: knip se calla sobre cualquier export que se use adentro de su
 *   propio archivo. No se apaga acá y no es olvido — apagarlo es una decisión
 *   de los cuatro repos a la vez, y hoy los cuatro lo tienen puesto.
 * · No compara esta config contra la de los otros tres. Sus formas SON
 *   distintas a propósito: ellos son aplicaciones y sus enums los leen ellos
 *   mismos; el que diverge acá es el que este archivo explica.
 *
 * @gemelo memivo_api/tests/unit/config/knip-scope-is-declared.spec.ts
 */

const knipConfig = () => JSON.parse(readFileSync(join(ROOT, 'knip.json'), 'utf8'));

const packageJson = () => JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

test('mide algo: la config existe y declara su corpus', () => {
  // Control de vacío. Sin esto, un `knip.json` renombrado dejaría los casos de
  // abajo leyendo un objeto vacío y aprobando por no encontrar nada.
  const config = knipConfig();

  assert.ok(Array.isArray(config.entry) && config.entry.length > 0);
  assert.ok(Array.isArray(config.project) && config.project.length > 0);
});

test('el conteo por MIEMBRO de enum está apagado, que es la decisión que este archivo explica', () => {
  assert.equal(
    knipConfig().rules?.enumMembers,
    'off',
    'Si se vuelve a encender, `npm run dead` se pone rojo con los miembros de enum ' +
      'que sólo leen los consumidores —medidos: 279—. La pregunta no se contesta ' +
      'desde adentro de una librería: la contesta `audit:consumers`.',
  );
});

test('la delegación EXISTE: `audit:consumers` mira enums de verdad', () => {
  // ORDEN §10: si el motivo de una exención es una delegación, el gate sigue el
  // puntero y verifica que el otro lado lo haga. Sin esto, apagar la regla sería
  // apagarla y ya.
  const auditor = readFileSync(join(ROOT, 'scripts', 'audit-consumers.js'), 'utf8');

  assert.match(
    auditor,
    /ts\.isEnumDeclaration\(/,
    '`audit-consumers.js` dejó de reconocer declaraciones de enum: la regla de knip ' +
      'está apagada delegando en un auditor que ya no mira lo que se le delegó.',
  );
});

test('la delegación CORRE: `audit:consumers` está encadenado al ritual', () => {
  const { scripts = {} } = packageJson();

  assert.ok(
    typeof scripts.quality === 'string' && scripts.quality.includes('audit:consumers'),
    '`quality` dejó de encadenar `audit:consumers`, así que la delegación de la ' +
      'regla apagada no la corre nadie.',
  );
  assert.ok(
    typeof scripts['audit:consumers'] === 'string',
    'el script `audit:consumers` ya no existe',
  );
});
