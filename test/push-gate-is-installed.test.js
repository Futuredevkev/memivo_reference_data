const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');
const { join, resolve } = require('node:path');

const ROOT = resolve(__dirname, '..');
const HOOK = '.githooks/pre-push';

/**
 * LA PUERTA QUE SE CIERRA SOLA EXISTE, CORRE EL RITUAL, Y ESTÁ INSTALADA.
 *
 * ── EL DEFECTO QUE CIERRA ────────────────────────────────────────────────
 * Este repo tenía `pre-push` y no tenía quién lo mirara. Dos huecos medidos el
 * 5 de septiembre de 2026, los dos mudos:
 *
 *  1. **El hook llevaba su propia lista.** Corría CUATRO auditores escritos a
 *     mano —y su comentario decía «los cinco»— mientras `scripts.quality`
 *     encadena los seis más `lint` y `dead`. Le faltaba `audit:route-parity`,
 *     el único que aparea api y cliente por RUTA. O sea una QUINTA copia del
 *     mismo conjunto, desincronizada, en la puerta del que publica el contrato
 *     del que dependen los otros dos repos.
 *  2. **El hook estaba commiteado como `100644`.** `git ls-tree HEAD .githooks/`
 *     lo daba así en los CUATRO repos, con `core.fileMode` en `false`: el
 *     `-rwxr-xr-x` que muestra un `ls` en Windows es artefacto del filesystem y
 *     git nunca lo registró. En un clon POSIX el archivo se materializa 644,
 *     git **ignora** un hook sin bit de ejecución, y el push sale sin correr un
 *     solo gate — con el clon viéndose idéntico a uno sano.
 *
 * ── POR QUÉ HACEN FALTA LAS TRES MITADES ─────────────────────────────────
 * `core.hooksPath` es configuración LOCAL de cada clon: no viaja en el repo. El
 * MODO sí viaja, pero en el índice y no en el disco. Y que el hook corra el
 * ritual entero es otra cosa más. Las tres se ven igual de bien cuando están
 * rotas, así que las tres se afirman.
 *
 * ── ALCANCE DECLARADO (ORDEN §10) ────────────────────────────────────────
 * · Afirma que el hook INVOQUE `npm run quality` en una línea ejecutable, no
 *   que lo mencione: un `#` que lo nombre o un `echo` que lo imprima no corren
 *   nada. Es la trampa que ya apagó gates de este programa.
 * · No afirma que `quality` cubra todo lo que este repo debería medir. Qué
 *   corre `quality` es otro eje, y lo sostiene
 *   `ssot-workflow-runs-every-auditor.test.js`.
 *
 * @gemelo memivo_landing/test/push-gate-is-installed.test.js
 */

/** Las líneas del hook que NO son comentario de shell. */
const lineasEjecutables = (contenido) =>
  contenido.split('\n').filter((linea) => !linea.trimStart().startsWith('#'));

/**
 * La línea con lo ENTRECOMILLADO reemplazado por espacios.
 *
 * El hook imprime `echo "pre-push: npm run quality"` una línea antes de correrlo
 * de verdad: sin esto, borrar la invocación y dejar el `echo` dejaría este gate
 * en verde sobre una puerta que ya no cierra nada.
 */
const sinLiterales = (linea) => linea.replace(/"[^"]*"/g, ' ');

const invoca = (contenido, comando) =>
  lineasEjecutables(contenido)
    .map(sinLiterales)
    .some((linea) => linea.includes(comando));

test('el `pre-push` existe y corre `npm run quality`', () => {
  const hook = join(ROOT, HOOK);
  assert.ok(existsSync(hook), `no existe ${HOOK}`);

  assert.ok(
    invoca(readFileSync(hook, 'utf8'), 'npm run quality'),
    'El `pre-push` existe pero no invoca `npm run quality` en ninguna línea ' +
      'ejecutable. Un hook que sólo lo NOMBRA en un comentario no corre nada.',
  );
});

test('el `pre-push` NO lleva su propia lista de auditores', () => {
  // El defecto #1: el mismo conjunto escrito en dos lugares se desincroniza, y
  // ya lo hizo. `scripts.quality` es el dueño único de qué corre esta puerta.
  const hook = readFileSync(join(ROOT, HOOK), 'utf8');

  const propios = lineasEjecutables(hook)
    .map(sinLiterales)
    .flatMap((linea) => [...linea.matchAll(/npm run (audit:[\w:-]+)/g)])
    .map((match) => match[1]);

  assert.deepEqual(
    propios,
    [],
    'El `pre-push` nombra auditores por su cuenta. Corré `npm run quality`, ' +
      'que ya los encadena: una segunda lista se desincroniza y esta puerta ' +
      'ya perdió `audit:route-parity` una vez por eso.',
  );
});

test('el detector engancha: distingue correr de nombrar', () => {
  // Control positivo sobre datos sintéticos y no sobre el árbol: si mañana el
  // hook cambia de forma, este caso tiene que seguir probando que el detector
  // SIRVE. Atado al árbol se apagaría solo.
  assert.equal(invoca('npm run quality\n', 'npm run quality'), true);
  assert.equal(
    invoca('# Corre `npm run quality` antes de pushear.\n', 'npm run quality'),
    false,
    'Un comentario que lo nombra no lo corre.',
  );
  assert.equal(
    invoca('echo "pre-push: npm run quality"\n', 'npm run quality'),
    false,
    'Un texto impreso no es un comando.',
  );
});

/**
 * Corre también en CI: el modo commiteado es una propiedad del ÁRBOL, no del
 * clon. Y se lee del ÍNDICE y no de un `stat` del disco, porque en Windows —que
 * es donde este repo se trabaja— el `stat` miente y el defecto es invisible.
 */
test('el `pre-push` está commiteado como ejecutable', () => {
  const enElIndice = execFileSync('git', ['ls-files', '-s', HOOK], {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();

  assert.ok(
    enElIndice.startsWith('100755 '),
    'El `pre-push` está commiteado como 100644. En un clon POSIX git no ' +
      'ejecuta un hook sin bit de ejecución y el push sale sin correr nada. ' +
      'Se arregla con `git update-index --chmod=+x .githooks/pre-push`.',
  );
});

/**
 * En CI no corre y es deliberado: ahí nadie pushea, el hook no aplica, y el
 * `git config` del runner no dice nada sobre el clon de quien trabaja.
 */
const enUnClon = process.env.CI ? test.skip : test;

enUnClon('fuera de CI, este clon tiene los hooks instalados', () => {
  const configurado = execFileSync('git', ['config', '--get', 'core.hooksPath'], {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();

  assert.equal(
    configurado,
    '.githooks',
    'Este clon no apunta a `.githooks`, así que pushea sin correr nada.',
  );
});
