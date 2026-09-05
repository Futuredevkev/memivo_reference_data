const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');

/**
 * Tests del AUDITOR, no del contrato.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * `audit-installed-version.js` comparaba, DENTRO de cada consumidor, «pedida vs
 * instalada», y nunca comparaba a los dos consumidores ENTRE SÍ. Con el api
 * pineado a v21.0.0 y el cliente a v20.0.0 —el salto BREAKING de
 * `ProfileReportReason` a `ModerationReason`— contestaba `EXIT=0` con las dos
 * filas en `ok`, porque cada repo era internamente consistente. Los dos
 * `quality` daban verde y el desacuerdo aparecía en el cable.
 *
 * El gate no tenía ningún test, así que el único momento en que alguien iba a
 * enterarse de ese hueco era leyéndolo entero. Este archivo existe para que la
 * verificación ROMPIENDO —ORDEN §10— quede escrita en vez de haber pasado una
 * vez en la terminal de quien lo arregló.
 *
 * ── CÓMO SE EJERCITA ──────────────────────────────────────────────────────
 * Por la costura que el propio gate declara: `MEMIVO_AUDIT_API_ROOT` y
 * `MEMIVO_AUDIT_CLIENT_ROOT` apuntan a repos SINTÉTICOS armados en el temporal
 * del sistema. Sin eso, la única forma de probar que el auditor detecta la
 * deriva sería provocarla de verdad en los consumidores.
 *
 * ── Y LA COSTURA TAPABA LA RAMA QUE CORRE DE VERDAD ──────────────────────
 * Todos los casos de acá pasaban por esa costura, o sea que la ruta hermana POR
 * DEFECTO —la única que se usa en cada corrida real de `quality`, del
 * `pre-push` y de `ssot.yml`— no la ejercitaba ninguno. Medido rompiéndola: con
 * `memivo_client` escrito mal en la ruta por defecto del gate, los ocho casos
 * seguían en verde y el árbol real contestaba `EXIT=0` habiendo medido UN solo
 * consumidor. Por eso el último caso corre el auditor con la costura SACADA del
 * entorno, contra los hermanos de disco. Ese caso pide los tres repos como
 * hermanos, igual que `gate-corpus-control-positive-ratio`, y eso es
 * deliberado: un gate cross-repo que no puede ver al hermano no está pasando.
 *
 * ── POR QUÉ NINGÚN NÚMERO DE VERSIÓN ESTÁ ESCRITO ACÁ ─────────────────────
 * El tercer eje del gate compara los pines contra la versión que ESTE árbol
 * publica, y esa versión sube en cada ola. Un `21.0.0` escrito acá sería un
 * censo transcrito (ORDEN §4) y quedaría falso el día del bump siguiente: los
 * casos derivan sus versiones de `package.json`, que es el mismo oráculo que
 * usa el gate.
 *
 * @control-positivo en este archivo: dos consumidores en tags DISTINTOS ponen el gate en rojo
 */

const ROOT = resolve(__dirname, '..');
const auditor = join(ROOT, 'scripts', 'audit-installed-version.js');

/** La versión que este árbol publica: el oráculo del eje contra el paquete. */
const packageVersion = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;

const [major, minor, patch] = packageVersion.split('.').map(Number);

/**
 * Un tag vecino por major. `pasos` negativos dan un tag ya publicado y
 * positivos uno que este árbol todavía no declara.
 */
const otroMajor = (pasos) => `${major + pasos}.${minor}.${patch}`;

/**
 * Arma los dos consumidores sintéticos y corre el auditor sobre ellos.
 *
 * `pide` es el tag del `package.json` y `tiene` el de `node_modules`; cuando
 * `tiene` no se pasa, el consumidor está al día consigo mismo, que es lo que
 * hace falta para poder mirar el OTRO eje sin ruido. `tiene: null` deja el
 * árbol sin instalar, `{ sinDependencia: true }` escribe un `package.json` que
 * no nombra al paquete, y `null` como consumidor entero lo deja sin manifiesto.
 */
function runAudit(consumidores) {
  const workspace = mkdtempSync(join(tmpdir(), 'memivo-installed-version-'));
  const env = { ...process.env };

  try {
    for (const [nombre, variable] of [
      ['api', 'MEMIVO_AUDIT_API_ROOT'],
      ['client', 'MEMIVO_AUDIT_CLIENT_ROOT'],
    ]) {
      const raiz = join(workspace, nombre);
      mkdirSync(raiz, { recursive: true });
      env[variable] = raiz;

      const consumidor = consumidores[nombre];
      if (consumidor === null || consumidor === undefined) continue;

      const { pide } = consumidor;
      const tiene = 'tiene' in consumidor ? consumidor.tiene : pide;
      writeFileSync(
        join(raiz, 'package.json'),
        JSON.stringify({
          name: `fixture-${nombre}`,
          version: '0.0.0',
          dependencies: consumidor.sinDependencia
            ? { express: '^4.0.0' }
            : {
                '@memivo/contracts':
                  `https://github.com/Futuredevkev/memivo_reference_data/archive/refs/tags/v${pide}.tar.gz`,
              },
        }),
        'utf8',
      );

      if (consumidor.sinDependencia || tiene === null) continue;
      const instalado = join(raiz, 'node_modules', '@memivo', 'contracts');
      mkdirSync(instalado, { recursive: true });
      writeFileSync(
        join(instalado, 'package.json'),
        JSON.stringify({ name: '@memivo/contracts', version: tiene }),
        'utf8',
      );
    }

    // El auditor sale 1 cuando encuentra algo, que en la mitad de estos casos es
    // justamente lo que se afirma: se leen el exit code Y la salida.
    try {
      const stdout = execFileSync(process.execPath, [auditor], { env, encoding: 'utf8' });
      return { exit: 0, salida: stdout };
    } catch (error) {
      return { exit: error.status, salida: `${error.stdout ?? ''}${error.stderr ?? ''}` };
    }
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
}

test('el gate mide algo: la versión del paquete es un major usable', () => {
  // Sin este piso los casos de abajo derivarían tags con major negativo y
  // pasarían por no medir nada, que es el modo de falla que persiguen.
  assert.match(packageVersion, /^\d+\.\d+\.\d+$/);
  assert.ok(major >= 1, `el major publicado es ${major}: no hay tag anterior con el que probar.`);
});

test('dos consumidores en tags DISTINTOS ponen el gate en rojo', () => {
  // EL DEFECTO. Los dos repos internamente consistentes —cada uno con instalada
  // la que pide— y en majors distintos: antes del arreglo esto era EXIT=0.
  const { exit, salida } = runAudit({
    api: { pide: packageVersion },
    client: { pide: otroMajor(-1) },
  });

  assert.equal(exit, 1, `tenía que cortar y salió ${exit}.\n${salida}`);
  assert.match(salida, /pinean tags DISTINTOS/);
  assert.match(salida, new RegExp(`memivo_client → ${otroMajor(-1).replace(/\./g, '\\.')}`));
});

test('los dos en el MISMO tag del paquete no reportan nada', () => {
  const { exit, salida } = runAudit({
    api: { pide: packageVersion },
    client: { pide: packageVersion },
  });

  assert.equal(exit, 0, salida);
  assert.doesNotMatch(salida, /DISTINTOS|NO publica/);
});

test('el paquete ADELANTADO sobre los dos avisa y NO corta', () => {
  // La decisión escrita en el docblock del gate, verificada: en el medio de una
  // ola el bump del paquete va antes del repineo, así que este estado es
  // legítimo durante minutos. Lo que no puede pasar en silencio —que UNO
  // repinee y el otro no— lo corta el caso de arriba.
  const atrasado = otroMajor(-1);
  const { exit, salida } = runAudit({
    api: { pide: atrasado },
    client: { pide: atrasado },
  });

  assert.equal(exit, 0, `el paquete adelantado no debe cortar, y salió ${exit}.\n${salida}`);
  assert.match(salida, /No corta/);
  assert.match(salida, new RegExp(`siguen en ${atrasado.replace(/\./g, '\\.')}`));
});

test('un pin que este árbol NO publica corta', () => {
  const inexistente = otroMajor(1);
  const { exit, salida } = runAudit({
    api: { pide: inexistente },
    client: { pide: inexistente },
  });

  assert.equal(exit, 1, `tenía que cortar y salió ${exit}.\n${salida}`);
  assert.match(salida, /NO publica/);
});

test('la comparación es NUMÉRICA: 9.0.0 no va adelante de un major de dos dígitos', () => {
  // La trampa que hace falso al orden lexicográfico —`'9.0.0' > '21.0.0'` es
  // verdadero como texto— y que empieza a morder justo cuando el major pasa de
  // 9, que es donde está este paquete. Con la comparación de strings este caso
  // cortaría por «pide algo que el árbol no publica», al revés de la verdad.
  assert.ok(major >= 10, `este caso mide la trampa de dos dígitos y el major es ${major}.`);
  const { exit, salida } = runAudit({
    api: { pide: `9.${minor}.${patch}` },
    client: { pide: `9.${minor}.${patch}` },
  });

  assert.equal(exit, 0, salida);
  assert.doesNotMatch(salida, /NO publica/);
  assert.match(salida, /No corta/);
});

test('el eje de adentro del repo sigue cortando: pedida ≠ instalada', () => {
  // El caso original del gate, que hasta ahora tampoco tenía test.
  const { exit, salida } = runAudit({
    api: { pide: packageVersion, tiene: otroMajor(-1) },
    client: { pide: packageVersion },
  });

  assert.equal(exit, 1, `tenía que cortar y salió ${exit}.\n${salida}`);
  assert.match(salida, /memivo_api: package\.json pide/);
});

test('un consumidor que no se puede leer CORTA, no avisa', () => {
  // La primera versión de este eje daba `EXIT=0` acá y lo compensaba con un
  // aviso por stdout. No alcanza: el aviso viaja en el medio de la salida de
  // `quality` y el exit code —lo único que alguien mira— decía que todo está
  // bien. Es la misma decisión que ya estaba escrita en los hermanos de este
  // repo, y ésta la tenía al revés.
  const { exit, salida } = runAudit({
    api: { pide: packageVersion },
    client: null,
  });

  assert.equal(exit, 1, `un censo a medias tenía que cortar y salió ${exit}.\n${salida}`);
  assert.match(salida, /el censo quedó incompleto: 1 de 2/);
  assert.match(salida, /memivo_client: no hay package\.json/);
});

test('el censo VACÍO no puede dar verde', () => {
  // El caso extremo del anterior, y el que la pregunta de la segunda pasada
  // busca: con ningún consumidor legible el gate contestaba `EXIT=0` y la línea
  // final afirmaba «versión instalada al día en 0 consumidor(es)».
  const { exit, salida } = runAudit({ api: null, client: null });

  assert.equal(exit, 1, `el conjunto vacío tenía que cortar y salió ${exit}.\n${salida}`);
  assert.match(salida, /el censo quedó incompleto: 0 de 2/);
});

test('un consumidor que dejó de declarar el paquete tampoco pasa en silencio', () => {
  // Antes esto era un `continue` que sólo se veía con `--verbose`: el
  // consumidor desaparecía del censo y el eje entre repos quedaba comparando
  // uno contra nada.
  const { exit, salida } = runAudit({
    api: { pide: packageVersion },
    client: { sinDependencia: true },
  });

  assert.equal(exit, 1, `tenía que cortar y salió ${exit}.\n${salida}`);
  assert.match(salida, /memivo_client: su package\.json no declara @memivo\/contracts/);
});

test('la ruta hermana POR DEFECTO —sin la costura— encuentra a los dos consumidores', () => {
  // El caso que la costura tapaba. Corre el auditor con
  // `MEMIVO_AUDIT_*_ROOT` FUERA del entorno, así que la única forma de que
  // llegue a los dos consumidores es que las rutas hermanas escritas en el gate
  // sean las del disco. Con una de las dos podrida, esto es lo único que se
  // pone rojo.
  const env = { ...process.env };
  delete env.MEMIVO_AUDIT_API_ROOT;
  delete env.MEMIVO_AUDIT_CLIENT_ROOT;

  // Va con `--verbose` y NO mira el exit code a propósito: lo que este caso
  // afirma es que el censo se completó, no que los pines estén de acuerdo. Si
  // atara las dos cosas, una deriva legítima a mitad de ola lo pondría rojo por
  // algo que ya reporta el caso que corresponde, y la lectura sería «la ruta
  // hermana se rompió» cuando no se rompió.
  let salida = '';
  try {
    salida = execFileSync(process.execPath, [auditor, '--verbose'], { env, encoding: 'utf8' });
  } catch (error) {
    salida = `${error.stdout ?? ''}${error.stderr ?? ''}`;
  }

  const falta =
    'Este caso necesita a memivo_api y memivo_client como directorios HERMANOS de ' +
    `este repo, con las rutas que el gate escribe por defecto.\n${salida}`;

  assert.doesNotMatch(salida, /el censo quedó incompleto/, falta);
  assert.match(salida, /memivo_api\s+pide \d+\.\d+\.\d+/, falta);
  assert.match(salida, /memivo_client\s+pide \d+\.\d+\.\d+/, falta);
});
