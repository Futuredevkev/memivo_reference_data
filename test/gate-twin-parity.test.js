const test = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readdirSync, readFileSync, statSync } = require('node:fs');
const { join, relative, resolve, sep } = require('node:path');

/**
 * EL CORPUS DE GATES ES PAREJO ENTRE REPOS, Y ESO SE MIDE.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * `ORDEN.md` gobierna `memivo_api` y `memivo_client`, pero cada repo tenía su
 * corpus de gates definido POR SU FILESYSTEM y nada medía la diferencia. El
 * resultado, medido en una sola tanda:
 *
 *  · El api tenía el gate de frontera de barrel desde que su ficha H-013 midió
 *    el costo de no tenerlo. El cliente no tenía nada equivalente, y al
 *    replicar la condición exacta salieron 84 archivos en la misma situación.
 *  · El cliente tenía el gate de flags del compilador, con la frase «una flag
 *    que se puede sacar en un renglón no es un gate» escrita adentro. El repo
 *    cuyo tsconfig estaba armado a mano, flag por flag, y tenía huecos medidos,
 *    era el api — el que NO tenía el gate.
 *  · Ninguno de los dos afirmaba que su script de `lint` llevara
 *    `--max-warnings 0`, que es lo único que convierte en gate a una regla
 *    declarada en `'warn'`.
 *
 * Tres síntomas, una causa: **la relación de gemelo entre dos gates existía
 * sólo en la prosa de sus docblocks.** Y ORDEN §10 dice que un docblock no es
 * un gate.
 *
 * ── LA FORMA: CADA GEMELO DECLARA AL OTRO, Y ACÁ SE VERIFICA ──────────────
 * La regla ya estaba escrita —`memivo_client/tests/config/support/sourceTree.ts`
 * la deja así: «entre repos se comparte lo que es CONTRATO, y NO se comparte el
 * andamiaje de tests. Cada gemelo declara al otro; ésa es toda la obligación»—.
 * Lo que faltaba era el instrumento. Un gate declara a su par con una etiqueta
 * de una línea en su docblock:
 *
 *     @gemelo memivo_api/tests/unit/config/lint-command-is-a-gate.spec.ts
 *
 * y este archivo verifica las tres cosas que la prosa no puede: que el archivo
 * declarado EXISTA, que esté en el OTRO repo, y que declare de vuelta. Un
 * gemelo que se borra, se renombra o se declara mal deja de compilar como
 * pareja y esto se pone rojo.
 *
 * ── POR QUÉ VIVE EN CONTRATOS Y NO EN CADA REPO, Y ESTÁ MEDIDO ────────────
 * Porque **la CI de los dos consumidores usa UN SOLO checkout**
 * (`memivo_api/.github/workflows/quality.yml:20`,
 * `memivo_client/.github/workflows/quality.yml:20`), así que un gate de jest
 * que necesite leer al repo hermano no tiene con qué correr allá: es
 * exactamente el `exit 127` que ya se pagó cuando `audit:consumers` estaba
 * encadenado al script `quality` de los dos consumidores.
 *
 * Este repo es el único de los tres que ve a los otros dos: `ssot.yml` hace los
 * TRES checkouts como directorios hermanos y corre `npm test` con ese layout, y
 * en la máquina de desarrollo los tres son hermanos en disco. Es el mismo lugar
 * y por el mismo motivo por el que ya viven acá `audit-consumers.js` y
 * `audit-transport-surfaces.js`.
 *
 * Y NO contradice la regla de arriba: acá no se COMPARTE andamiaje —ningún repo
 * importa esto, no viaja en `dist/` y no le cuesta nada a los dos runtimes—. Se
 * AUDITA desde el único punto que alcanza a los tres, que es lo que este
 * paquete ya hace con el SSOT.
 *
 * ── LO QUE ESTE GATE NO HACE, ESCRITO (ORDEN §10) ────────────────────────
 * 1. **No obliga a que todo gate tenga gemelo, y no debe.** Hay conceptos que
 *    sólo existen de un lado: un gate sobre el SQL de TypeORM no tiene sentido
 *    en el cliente, y uno sobre la superficie táctil no lo tiene en el backend.
 *    Lo que obliga es que el gemelo DECLARADO exista, apunte de vuelta, y que
 *    el conjunto de parejas no se achique en silencio.
 * 2. **No verifica que los dos midan lo mismo.** No es mecánico, y a veces es
 *    falso a propósito: los dos gates de docblock son gemelos declarados y
 *    persiguen formas distintas, con el motivo escrito en los dos.
 * 3. **No mira el tercer repo contra sí mismo.** Un gate de este paquete no
 *    tiene gemelo posible: no hay otro paquete de contratos.
 */

/** La raíz que contiene a los tres repos como hermanos. */
const ROOT = resolve(__dirname, '..', '..');

/** Los dos repos que `ORDEN.md` gobierna, con la raíz donde viven sus gates. */
const REPOS = [
  { repo: 'memivo_api', gates: 'tests' },
  { repo: 'memivo_client', gates: 'tests' },
];

/**
 * El número de PAREJAS declaradas hoy. Sólo puede crecer.
 *
 * Está acá y no derivado del recorrido a propósito: sin este número, borrar la
 * etiqueta de los dos lados a la vez deja todo en verde y la pareja desaparece
 * sin dejar rastro. Con él, hay que bajarlo — y bajarlo es una decisión escrita
 * en el diff, no un olvido.
 */
const PAREJAS_DECLARADAS = 20;

const clave = (absoluto) => relative(ROOT, absoluto).split(sep).join('/');

/** La etiqueta, sin backticks: una ruta entre backticks la leen otros gates. */
const GEMELO = /@gemelo\s+(\S+)/g;

/**
 * Un recorrido por repo y no uno por caso: los dos árboles de tests juntos son
 * miles de archivos, y recorrerlos cuatro veces multiplicaba por cuatro lo que
 * este gate le cuesta a `npm test` sin cambiar una sola respuesta.
 */
const recorridos = new Map();

const archivosDeGates = (repo, gates) => {
  const cacheado = recorridos.get(`${repo}/${gates}`);
  if (cacheado !== undefined) return cacheado;

  const raiz = join(ROOT, repo, gates);
  if (!existsSync(raiz)) {
    recorridos.set(`${repo}/${gates}`, null);
    return null;
  }

  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules') continue;
        walk(full);
      } else if (/\.(ts|tsx)$/.test(entry.name)) {
        out.push(full);
      }
    }
  };
  walk(raiz);
  out.sort();
  recorridos.set(`${repo}/${gates}`, out);
  return out;
};

/** `{ desde, hacia }` por cada `@gemelo` escrito, en claves relativas a la raíz. */
const declaraciones = (() => {
  const found = [];
  for (const { repo, gates } of REPOS) {
    const archivos = archivosDeGates(repo, gates);
    if (archivos === null) continue;
    for (const archivo of archivos) {
      const texto = readFileSync(archivo, 'utf8');
      GEMELO.lastIndex = 0;
      let match;
      while ((match = GEMELO.exec(texto)) !== null) {
        found.push({ desde: clave(archivo), hacia: match[1] });
      }
    }
  }
  return found.sort((a, b) => a.desde.localeCompare(b.desde));
})();

const declaradasPor = new Map();
for (const { desde, hacia } of declaraciones) {
  const previas = declaradasPor.get(desde) ?? [];
  previas.push(hacia);
  declaradasPor.set(desde, previas);
}

test('el gate mide algo: los tres repos son hermanos y los dos corpus se leen', () => {
  // Sin este piso, un layout que no sea el de los tres hermanos haría que las
  // reglas de abajo corran sobre CERO declaraciones: verde por no mirar, que es
  // exactamente el modo de falla que este archivo persigue en otros.
  const ausentes = REPOS.filter(({ repo, gates }) => archivosDeGates(repo, gates) === null).map(
    ({ repo, gates }) => `${repo}/${gates}`,
  );
  assert.deepEqual(
    ausentes,
    [],
    'Este gate necesita a los tres repos como directorios HERMANOS, que es el layout que ' +
      'da `ssot.yml` con sus tres checkouts y el que hay en la máquina de desarrollo. ' +
      'No se degrada en silencio: un gate cross-repo que no puede leer los otros dos no ' +
      'está pasando, está ciego.',
  );

  for (const { repo, gates } of REPOS) {
    assert.ok(
      archivosDeGates(repo, gates).length > 50,
      `${repo}/${gates} devolvió muy pocos archivos: el sospechoso es el recorrido.`,
    );
  }
});

test('todo gemelo declarado existe, y está en el OTRO repo', () => {
  const rotas = [];
  for (const { desde, hacia } of declaraciones) {
    const destino = join(ROOT, ...hacia.split('/'));
    if (!existsSync(destino) || !statSync(destino).isFile()) {
      rotas.push(`${desde} → @gemelo ${hacia}: ese archivo no existe.`);
      continue;
    }
    const repoDesde = desde.split('/')[0];
    const repoHacia = hacia.split('/')[0];
    if (repoDesde === repoHacia) {
      rotas.push(
        `${desde} → @gemelo ${hacia}: apunta a su PROPIO repo. Un gemelo vive del otro lado; ` +
          'dos gates del mismo repo que miden lo mismo no son gemelos, es una duplicación.',
      );
    }
  }

  assert.deepEqual(rotas, []);
});

test('el gemelo declara de vuelta: la pareja se escribe de los dos lados', () => {
  const rotas = [];
  for (const { desde, hacia } of declaraciones) {
    const destino = join(ROOT, ...hacia.split('/'));
    if (!existsSync(destino)) continue; // ya lo reporta el caso de arriba
    const devuelta = declaradasPor.get(hacia) ?? [];
    if (!devuelta.includes(desde)) {
      rotas.push(
        `${desde} declara @gemelo ${hacia}, y ${hacia} no lo declara de vuelta ` +
          `(declara: ${devuelta.length > 0 ? devuelta.join(', ') : 'nada'}). ` +
          'Una pareja declarada de un solo lado se borra sin que el otro lado se entere.',
      );
    }
  }

  assert.deepEqual(rotas, []);
});

test('el conjunto de parejas no se achica en silencio', () => {
  // Se cuentan sólo las declaraciones RECÍPROCAS, y después se dividen. Contar
  // todas daría un número fraccionario en cuanto exista una declaración de un
  // solo lado —pasó apenas se encendió esto— y ese medio no significa nada: la
  // huérfana ya la reporta el caso de arriba, con su nombre y su motivo. Acá lo
  // que se cuida es otra cosa: que una pareja COMPLETA no desaparezca de los dos
  // lados a la vez sin que nadie tenga que bajar este número.
  const parejas =
    declaraciones.filter(({ desde, hacia }) => (declaradasPor.get(hacia) ?? []).includes(desde))
      .length / 2;

  assert.equal(
    parejas,
    PAREJAS_DECLARADAS,
    parejas < PAREJAS_DECLARADAS
      ? `Había ${PAREJAS_DECLARADAS} parejas de gates gemelos y ahora hay ${parejas}. ` +
          'NO bajes el número para que pase: si un gemelo se borró de verdad, bajalo Y ' +
          'dejá escrito por qué ese concepto dejó de valer en los dos repos.'
      : `Hay ${parejas} parejas y el número declarado es ${PAREJAS_DECLARADAS}. Subilo: ` +
          'este contador existe para que una pareja no pueda desaparecer sin diff.',
  );
});
