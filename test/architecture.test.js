const test = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readdirSync, statSync } = require('node:fs');
const { relative, resolve, sep } = require('node:path');

const root = resolve(__dirname, '..', 'src');
const expectedDomains = [
  'album',
  'auth',
  'chat',
  'common',
  'downloads',
  'errors',
  'highlights',
  'media',
  'notifications',
  'polls',
  'reactions',
  'reference-data',
  'reports',
  'sockets',
  'social',
  'stories',
  'validation',
];

test('todos los dominios tienen un barrel explícito', () => {
  for (const domain of expectedDomains) {
    assert.ok(existsSync(resolve(root, domain, 'index.ts')), `${domain}/index.ts`);
  }
});

test('el root no acumula contratos sueltos', () => {
  const looseTypeScriptFiles = readdirSync(root).filter((entry) => {
    const path = resolve(root, entry);
    return statSync(path).isFile() && entry.endsWith('.ts') && entry !== 'index.ts';
  });

  assert.deepEqual(looseTypeScriptFiles, []);
});

/**
 * Un barrel que HOY está ordenado alfabéticamente no puede dejar de estarlo.
 *
 * `validation/limits/index.ts` mantenía el orden en 37 de sus 40 líneas y los
 * dos exports nuevos de `IDEMPOTENCY_KEY_*` se pegaron al final. El síntoma no
 * es estético: el próximo que agregue un límite mira el final del archivo, ve
 * dos entradas fuera de orden y apenda la suya también — el orden se pierde de
 * a una línea. El contraste del mismo día lo prueba: `patterns/index.ts`
 * recibió `client-temp-id-pattern` en su posición alfabética correcta.
 *
 * Se congela sólo lo que YA cumple. Los barrels que nunca estuvieron ordenados
 * quedan afuera a propósito: reordenar un `export *` puede cambiar cómo se
 * resuelve una colisión de nombres, y no es algo que valga la pena arriesgar
 * por prolijidad en archivos que nadie tocó.
 *
 * ── POR QUÉ SON 55 Y NO 3 ──────────────────────────────────────────────────
 * La lista arrancó con 3 y esos 3 no tenían nada especial: son los barrels que
 * H-012 tocó ese día. La regla de arriba («se congela lo que YA cumple») decía
 * una cosa y la lista otra. Medido sobre los 65 `index.ts` de `src/`:
 *
 *   55  barrels PUROS de re-export y YA ordenados  -> entran, son SORTED_BARRELS
 *    7  barrels PUROS que NUNCA estuvieron ordenados -> UNSORTED_BARRELS
 *    3  barrels NO puros (mezclan `import`/`export {…}`) -> fuera por forma
 *
 * O sea los otros 52 ya cumplían: ampliar el gate no reordenó ni una línea, sólo
 * dejó de mirar para otro lado en 52 archivos que estaban bien y podían dejar de
 * estarlo en silencio. El riesgo que la regla de arriba describe (reordenar un
 * `export *`) NO se corrió: los desordenados siguieron intactos.
 *
 * ⚠️ **Los números de arriba son la MEDICIÓN del día que la lista se amplió, no
 * el estado de hoy.** El trinquete los mueve: N1c ordenó
 * `sockets/interfaces/index.ts` al agregarle dos exports, y el caso de abajo
 * hizo lo que tiene que hacer — exigir que se mudara a la lista congelada—.
 * Hoy son **56 y 6**. Se anota en vez de reescribir la medición porque lo que
 * explica la lista es de dónde salió, y el conteo vivo lo contestan los dos
 * arrays.
 */
const SORTED_BARRELS = [
  'album/enums/index.ts',
  'album/index.ts',
  'album/rules/index.ts',
  'auth/constants/index.ts',
  'auth/enums/index.ts',
  'auth/index.ts',
  'chat/constants/index.ts',
  'chat/enums/index.ts',
  'chat/index.ts',
  'chat/interfaces/index.ts',
  'chat/types/index.ts',
  'common/constants/index.ts',
  'common/enums/index.ts',
  'common/helpers/index.ts',
  'common/index.ts',
  'common/interfaces/index.ts',
  'downloads/constants/index.ts',
  'downloads/enums/index.ts',
  'downloads/index.ts',
  'downloads/interfaces/index.ts',
  'highlights/constants/index.ts',
  'highlights/enums/index.ts',
  'highlights/index.ts',
  'highlights/interfaces/index.ts',
  'highlights/types/index.ts',
  'media/constants/index.ts',
  'media/enums/index.ts',
  'media/index.ts',
  'media/interfaces/index.ts',
  'media/types/index.ts',
  'notifications/constants/index.ts',
  'notifications/enums/index.ts',
  'notifications/index.ts',
  'notifications/interfaces/index.ts',
  'polls/enums/index.ts',
  'polls/index.ts',
  'polls/interfaces/index.ts',
  'reactions/constants/index.ts',
  'reactions/enums/index.ts',
  'reactions/index.ts',
  'reactions/interfaces/index.ts',
  'reference-data/iso-country-codes/index.ts',
  'reports/constants/index.ts',
  'reports/enums/index.ts',
  'reports/index.ts',
  'reports/interfaces/index.ts',
  'social/display-aspect-ratio/index.ts',
  'social/constants/index.ts',
  'social/enums/index.ts',
  'social/index.ts',
  'sockets/constants/index.ts',
  'sockets/index.ts',
  'sockets/interfaces/index.ts',
  'stickers/constants/index.ts',
  'stickers/enums/index.ts',
  'stickers/helpers/index.ts',
  'stickers/index.ts',
  'stickers/interfaces/index.ts',
  'stories/constants/index.ts',
  'stories/enums/index.ts',
  'stories/index.ts',
  'stories/types/index.ts',
  'validation/common-passwords/index.ts',
  'validation/index.ts',
  'validation/limits/index.ts',
  'validation/rules/index.ts',
  'validation/patterns/index.ts',
];

/**
 * Los barrels PUROS que nunca estuvieron ordenados. No se tocan —ése es el
 * riesgo que el docblock de arriba declina correr— pero se declaran, porque una
 * lista de exclusión implícita («todo lo que no está en SORTED_BARRELS») deja
 * que un barrel NUEVO nazca desordenado sin que nadie se entere. Con las dos
 * listas explícitas, el tercer test obliga a clasificar cada barrel nuevo.
 *
 * La primera divergencia de cada uno, para que se vea que son desórdenes viejos
 * y no una línea suelta:
 *   album/interfaces   línea  1  `album-access-response-album` antes que `album-access-password-response`
 *   auth/interfaces    línea 24  `register-push-device-request` antes que `regenerate-backup-codes-response`
 *   index.ts           línea  1  `reference-data` primero, delante de `album`
 *   social/interfaces  línea  2  `comment-created-response` antes que `comment-context-meta`
 *   sockets/interfaces línea 26  `hidden-ids-changed-payload` antes que `group-created-payload`
 *   stories/interfaces línea  4  `story-overlay-position` antes que `story-author`
 */
const UNSORTED_BARRELS = [
  'album/interfaces/index.ts',
  'auth/interfaces/index.ts',
  'index.ts',
  'social/interfaces/index.ts',
  'stories/interfaces/index.ts',
];

test('los barrels que están ordenados siguen ordenados', () => {
  const { readFileSync } = require('node:fs');
  for (const relative of SORTED_BARRELS) {
    const path = resolve(root, relative);
    assert.ok(existsSync(path), `${relative} no existe`);
    const lines = readFileSync(path, 'utf8')
      .split('\n')
      .filter((line) => line.trim().length > 0);
    // Sólo barrels PUROS de re-export. `errors/index.ts` mezcla imports con un
    // bloque `export { … }`, y ahí «ordenado alfabéticamente» no significa
    // nada: se probó incluirlo y el gate reordenaba el archivo entero.
    assert.ok(
      lines.every((line) => line.startsWith("export * from '")),
      `${relative} no es un barrel puro de re-export: sacalo de la lista`,
    );
    assert.deepEqual(
      lines,
      [...lines].sort(),
      `${relative} dejó de estar ordenado alfabéticamente`,
    );
  }
});

/** Todos los `index.ts` de `src/`, relativos a `src/`, con `/` como separador. */
const allBarrels = (dir = root, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) allBarrels(full, out);
    else if (entry === 'index.ts') {
      out.push(relative(root, full).split(sep).join('/'));
    }
  }
  return out;
};

/**
 * El test que impide que la clasificación se pudra. Un barrel nuevo tiene que
 * entrar a UNA de las dos listas: si nace ordenado va a SORTED_BARRELS y queda
 * congelado; si nace desordenado va a UNSORTED_BARRELS y eso es una decisión
 * escrita. Sin este test, «todo lo que no está en SORTED_BARRELS» es una puerta
 * abierta y el gate se degrada solo — que es exactamente lo que pasó cuando la
 * lista tenía 3 de 55.
 *
 * Los barrels que NO son re-export puro quedan afuera por forma, no por olvido:
 * `errors/index.ts` mezcla `import`s con un bloque `export { … }`, y ahí
 * «ordenado alfabéticamente» no significa nada.
 */
test('todo barrel puro de re-export está clasificado como ordenado o como no-ordenado', () => {
  const { readFileSync } = require('node:fs');
  const clasificados = new Set([...SORTED_BARRELS, ...UNSORTED_BARRELS]);

  const sinClasificar = allBarrels()
    .filter((relativePath) => {
      const lines = readFileSync(resolve(root, relativePath), 'utf8')
        .split('\n')
        .filter((line) => line.trim().length > 0);
      return (
        lines.length > 0 && lines.every((line) => line.startsWith("export * from '"))
      );
    })
    .filter((relativePath) => !clasificados.has(relativePath))
    .sort();

  assert.deepEqual(
    sinClasificar,
    [],
    'barrel puro sin clasificar: si está ordenado sumalo a SORTED_BARRELS, si no a UNSORTED_BARRELS',
  );
});

/** Una entrada de UNSORTED_BARRELS que ya se ordenó tiene que mudarse de lista. */
test('ningún barrel de UNSORTED_BARRELS quedó ordenado sin mudarse de lista', () => {
  const { readFileSync } = require('node:fs');
  const yaOrdenados = UNSORTED_BARRELS.filter((relativePath) => {
    const lines = readFileSync(resolve(root, relativePath), 'utf8')
      .split('\n')
      .filter((line) => line.trim().length > 0);
    return JSON.stringify(lines) === JSON.stringify([...lines].sort());
  }).sort();

  assert.deepEqual(
    yaOrdenados,
    [],
    'este barrel ya está ordenado: movelo a SORTED_BARRELS para que quede congelado',
  );
});

/**
 * EL SUFIJO DEL ARCHIVO DICE QUÉ KIND PUBLICA, Y LA RAÍZ DE UN DOMINIO NO
 * ACUMULA CONTRATOS SUELTOS.
 *
 * ── LOS DOS DEFECTOS QUE CIERRAN, MEDIDOS ─────────────────────────────────
 * 1. Cuatro archivos decían un kind y publicaban otro:
 *    `chat/interfaces/chat-content-relocation-rule.interface.ts` y
 *    `sockets/interfaces/chat-live-location-updated-payload.interface.ts`
 *    declaraban un `type`; `social/interfaces/update-guest-post-request.type.ts`
 *    declaraba una `interface`; y
 *    `sockets/interfaces/stories-updated-payload.interface.ts` tenía las dos
 *    cosas juntas, así que su nombre describía a UNA sola.
 *
 *    **No confundirlo con la carpeta.** `*.type.ts` dentro de `interfaces/` es
 *    la forma dominante del paquete —36 archivos contra 9 en `types/`—, o sea
 *    que la ubicación estaba bien y lo único mal era el NOMBRE. Por eso la
 *    regla mira el sufijo contra el AST y no contra el directorio.
 *
 * 2. `social/comment-context-limits.constant.ts` era el único archivo suelto en
 *    la raíz de un dominio que SÍ tiene subcarpetas. Recorridas las 17 raíces:
 *    `errors/` tiene 25 y es una estructura plana deliberada —todo el dominio
 *    es plano, no hay subcarpeta que contradecir—; `social/` tenía exactamente
 *    uno, y lo que le faltaba era el `constants/` que los otros 16 dominios ya
 *    usan. El test `el root no acumula contratos sueltos` sólo mira `src/`, así
 *    que la raíz de cada dominio no la miraba nadie.
 *
 * ── POR QUÉ LAS DOS NACEN SIN LISTA DE OFENSORES ──────────────────────────
 * Porque el censo es cero el mismo día que los cinco archivos se movieron. Un
 * trinquete que nace en verde es el único que no arranca con deuda declarada, y
 * esa ventana se cierra apenas aparezca el sexto caso. `errors` es la ÚNICA
 * excepción y va con su motivo escrito, que es el molde que `SORTED_BARRELS` /
 * `UNSORTED_BARRELS` ya usan en este mismo archivo.
 *
 * ── ALCANCE, ESCRITO (ORDEN §10) ──────────────────────────────────────────
 * 1. La regla de kind cubre SÓLO `*.interface.ts` y `*.type.ts`. Los otros
 *    sufijos quedan afuera A PROPÓSITO y no por olvido: los 141 `*.constant.ts`
 *    incluyen el idioma `const X` + `type X` —el objeto-como-enum del paquete—,
 *    donde el segundo símbolo es el tipo del primero y exigir un solo kind
 *    partiría un concepto en dos archivos; y los 20 `*.error-code.ts` publican
 *    un `enum`, o sea que su sufijo nombra el DOMINIO y no el kind. Meter
 *    cualquiera de los dos exige antes decidir su forma, y eso es otra ola.
 * 2. Mira sólo las declaraciones EXPORTADAS de primer nivel. Un `type` privado
 *    que ayuda a construir la interface exportada no es lo que el nombre del
 *    archivo le promete al consumidor.
 * 3. El oráculo es el escáner de TypeScript y no un regex: este mismo docblock
 *    escribe `interface` y `type` en prosa, y un detector por texto se acusaría
 *    a sí mismo.
 * 4. La regla de la raíz mira ARCHIVOS sueltos, no barrels: `index.ts` es la
 *    puerta del dominio y tiene que estar ahí.
 */
const ts = require('typescript');

/** Sufijo -> el kind de nodo que ese nombre promete. Ver el límite 1 del alcance. */
const KIND_BY_SUFFIX = {
  '.interface.ts': { kind: 'interface', is: (node) => ts.isInterfaceDeclaration(node) },
  '.type.ts': { kind: 'type', is: (node) => ts.isTypeAliasDeclaration(node) },
};

/** Todos los `.ts` de `src/` que no son barrels, relativos a `src/`. */
const allSourceLeaves = (dir = root, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) allSourceLeaves(full, out);
    else if (entry.endsWith('.ts') && entry !== 'index.ts') {
      out.push(relative(root, full).split(sep).join('/'));
    }
  }
  return out;
};

/**
 * Los símbolos exportados de primer nivel cuyo kind contradice al sufijo.
 *
 * Recibe el par (nombre, fuente) para que el detector se pueda ejercitar contra
 * un caso sintético: con el árbol limpio, «cero ofensores» y «el reconocedor
 * dejó de enganchar» se leen igual, y lo segundo es un gate apagado.
 */
const kindMismatches = (fileName, source) => {
  const suffix = Object.keys(KIND_BY_SUFFIX).find((candidate) =>
    fileName.endsWith(candidate),
  );
  if (suffix === undefined) return [];

  const expected = KIND_BY_SUFFIX[suffix];
  const ast = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const wrong = [];
  ts.forEachChild(ast, (node) => {
    const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) || [] : [];
    if (!modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) return;
    if (expected.is(node)) return;
    wrong.push(
      fileName +
        ' publica `' +
        (node.name ? node.name.getText(ast) : '?') +
        '`, que no es un ' +
        expected.kind +
        '. El nombre del archivo promete un ' +
        expected.kind +
        ': renombralo al sufijo del kind que declara y movele el renglón de su barrel, o ' +
        'partí el archivo si publica los dos. NO agregues una excepción: esta regla nació ' +
        'con cero ofensores.',
    );
  });
  return wrong;
};

test('el gate mide algo: hay hojas con sufijo de kind y sabe reconocer una contradicción', () => {
  const hojas = allSourceLeaves().filter((file) =>
    Object.keys(KIND_BY_SUFFIX).some((suffix) => file.endsWith(suffix)),
  );
  // 355 el día que se midió (303 `.interface.ts` + 52 `.type.ts`). Sin este
  // piso, un recorrido roto vacía el conjunto y la regla de abajo pasa por no
  // mirar: verde APAGADO, no verde limpio.
  assert.ok(
    hojas.length > 250,
    'sólo ' + hojas.length + ' hojas con sufijo de kind: el roto es el walker',
  );

  // EL CONTROL POSITIVO: las dos formas exactas que se acaban de arreglar, y
  // las dos que la regla NO tiene que acusar.
  assert.equal(kindMismatches('x.interface.ts', 'export type X = string;').length, 1);
  assert.equal(kindMismatches('x.type.ts', 'export interface X { a: string }').length, 1);
  assert.deepEqual(kindMismatches('x.interface.ts', 'export interface X { a: string }'), []);
  assert.deepEqual(kindMismatches('x.constant.ts', 'export type X = string;'), []);
});

test('el sufijo del archivo dice qué kind publica', () => {
  const { readFileSync } = require('node:fs');
  const ofensores = allSourceLeaves()
    .flatMap((relativePath) =>
      kindMismatches(relativePath, readFileSync(resolve(root, relativePath), 'utf8')),
    )
    .sort();

  assert.deepEqual(ofensores, []);
});

/**
 * `errors/` es plano de punta a punta: 25 archivos en la raíz y CERO
 * subcarpetas, así que no hay categoría que contradecir. La excepción es del
 * dominio entero, no de un archivo, y por eso se puede escribir en una línea.
 */
const FLAT_DOMAINS = {
  errors: 'dominio plano completo: 25 archivos en la raíz y ninguna subcarpeta.',
};

test('la raíz de un dominio no acumula contratos sueltos', () => {
  const ofensores = expectedDomains
    .filter((domain) => !(domain in FLAT_DOMAINS))
    .flatMap((domain) =>
      readdirSync(resolve(root, domain))
        .filter((entry) => {
          const full = resolve(root, domain, entry);
          return statSync(full).isFile() && entry.endsWith('.ts') && entry !== 'index.ts';
        })
        .map(
          (entry) =>
            domain +
            '/' +
            entry +
            ' — suelto en la raíz de un dominio que tiene subcarpetas. Metelo en `' +
            domain +
            '/constants/` (o la categoría que le toque) y re-exportalo desde su barrel y ' +
            'desde el del dominio.',
        ),
    )
    .sort();

  assert.deepEqual(ofensores, []);
});

test('ningún dominio declarado plano tiene subcarpetas', () => {
  // Sin esto, la excusa de `errors` sobrevive al día en que deje de ser verdad
  // y el dominio queda exento con un motivo que ya no describe nada.
  const contradicen = Object.keys(FLAT_DOMAINS)
    .filter((domain) =>
      readdirSync(resolve(root, domain)).some((entry) =>
        statSync(resolve(root, domain, entry)).isDirectory(),
      ),
    )
    .sort();

  assert.deepEqual(contradicen, []);
});
