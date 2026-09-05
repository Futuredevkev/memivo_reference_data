#!/usr/bin/env node
/**
 * Gate: las anclas de `@memivo/contracts` no se pueden separar. Son TRES
 * comparaciones sobre DOS ejes, y este archivo nació midiendo sólo el primero.
 *
 * ── EJE 1: DENTRO de cada consumidor, pedida vs instalada ─────────────────
 * La dependencia entra como tarball de un tag de GitHub
 * (`.../archive/refs/tags/v4.31.0.tar.gz`), no como paquete de registro con
 * rango semver. npm resuelve esa URL una sola vez: si el árbol ya está poblado
 * y la URL cambia, **no reinstala** y la versión vieja se queda. No hay aviso.
 *
 * Lo que pasa después no se parece a un problema de dependencias:
 *
 *     src/album/constants/<el reexport fino que lo trae>.constant.ts:14:10
 *       error TS2305: Module '"@memivo/contracts/album"' has no exported member
 *       '<el símbolo que el tag pedido agrega y el instalado no tiene>'.
 *
 * Tres errores de tipos que no nombran a npm, a la versión ni al tag. En la
 * auditoría del 2026-08-04 el backend estaba caído por esto —`package.json`
 * pedía v4.31.0 y el contenedor tenía 4.29.0— y el healthcheck de Docker sólo
 * decía «connection refused».
 *
 * ── EJE 2: ENTRE los consumidores, y contra el paquete ───────────────────
 * El eje 1 es INTRA-repo, y por sí solo deja verde el desacuerdo que más caro
 * sale. La familia entera de gates de versión era intra-repo —`dependency-pins`
 * compara el `package.json` contra el `package-lock` del MISMO repo, y el sello
 * de la caché de queries persistidas se compara contra el pin del MISMO repo—,
 * así que «las cuatro anclas» existían como concepto en la cabeza de quien las
 * movía y en ningún instrumento.
 *
 * Está MEDIDO, no supuesto: con dos repos sintéticos por la costura de abajo,
 * api pineado a v21.0.0 y cliente a v20.0.0 —el salto BREAKING de
 * `ProfileReportReason` a `ModerationReason`— este archivo contestaba
 * `EXIT=0` con las dos filas en `ok`, porque cada repo era internamente
 * consistente. El modo de falla no lo ve ningún compilador: el api emite un
 * enum que el cliente no conoce, y los dos `quality` dan verde.
 *
 * Las dos comparaciones que faltaban, y por qué UNA corta y la otra avisa:
 *
 *  · **Los consumidores pinean tags distintos → CORTA.** Es el defecto de
 *    arriba y no tiene ventana legítima: no hay ningún momento del trabajo en
 *    que convenga que el api y el cliente hablen contratos distintos.
 *  · **Un consumidor pide una versión MAYOR que la que el paquete publica →
 *    CORTA.** El orden del trabajo es fijo: primero se bumpea `package.json` y
 *    se tagea, después se repinean los consumidores. Pedir un tag que este
 *    árbol no declara es pedir algo que no existe, o estar leyendo un checkout
 *    viejo del paquete; en los dos casos lo que sigue se decide con datos
 *    falsos.
 *  · **El paquete va ADELANTE de los dos consumidores → avisa, no corta.**
 *    Es el estado normal de varios minutos en el medio de una ola: el bump ya
 *    está y el repineo todavía no. Cortar ahí pondría rojo el trabajo en curso
 *    y la salida barata sería apagar el gate. Y no queda sin dueño: la mitad
 *    peligrosa de «paquete adelantado» es que UN consumidor haya adoptado y el
 *    otro no, y ésa la corta la primera regla. Adelantado sobre los DOS por
 *    igual es el estado en el que los dos consumidores siguen de acuerdo.
 *
 * Vive acá y no en cada consumidor por el mismo motivo que los otros auditores
 * de este paquete: el problema es del contrato, y duplicarlo en los dos repos
 * sería mantener dos copias de la misma regla. Además, el eje 2 no se puede
 * escribir en un consumidor: pide ver al hermano, y la CI de los dos usa un
 * solo checkout. Los consumidores lo invocan con
 * `npm --prefix ../memivo-reference-data run audit:installed-version`, igual que
 * `audit:consumers` y compañía.
 *
 * ── PISO ANTI-VACÍO: un consumidor que no se puede leer es ROJO ──────────
 * El eje 2 compara consumidores ENTRE SÍ, así que sin los dos no midió nada, y
 * la primera versión de ese eje lo resolvía con un aviso por stdout y `EXIT=0`.
 * Está medido que eso no alcanza: con los dos hermanos fuera de disco el gate
 * contestaba `EXIT=0` y la línea final decía «versión instalada al día en 0
 * consumidor(es)», que es una afirmación en verde sobre el conjunto vacío. Y la
 * forma barata de llegar ahí no es borrar un repo: alcanza con que la ruta
 * hermana de acá abajo se pudra —un rename del directorio, un layout distinto—
 * porque **la costura por entorno tapa esa rama**: todos los casos de
 * `test/audit-installed-version.test.js` pasan por `MEMIVO_AUDIT_*_ROOT`, así
 * que la ruta por defecto es justamente la que ningún caso ejercitaba. Se
 * verificó rompiéndola: con `memivo_client` escrito mal en la ruta por defecto,
 * los 8 casos seguían en verde y el árbol real daba `EXIT=0` midiendo un solo
 * consumidor.
 *
 * Así que el censo se exige COMPLETO: cada consumidor declarado tiene que
 * llegar con su pin, y tienen que ser al menos dos. Es la misma decisión que ya
 * está escrita en los hermanos de este repo —`audit-consumers.js` se cae sobre
 * un consumidor ausente y `gate-corpus-control-positive-ratio` corta con «no se
 * degrada en silencio»—, y la que ese caso de un solo consumidor tenía al
 * revés: un gate cross-repo que no puede ver al hermano no está pasando, está
 * ciego. Lo que se sigue tolerando es otra cosa y no se toca: un consumidor
 * **sin `npm install`**, que no rompe el censo porque su pin igual se lee.
 *
 * ── LO QUE NO HACE, ESCRITO (ORDEN §10) ──────────────────────────────────
 * No compara CONTENIDO: dos consumidores pineados al mismo tag pueden tener
 * instalados dos tarballs distintos si alguien reescribió el tag en el remoto.
 * Este párrafo delegaba eso en `audit-consumers.js` «que lee los símbolos», y
 * el puntero no aguanta que lo sigan: ese auditor recorre el `src/` de los tres
 * repos y **saltea `node_modules` explícitamente**, así que nunca abre el
 * tarball instalado de ninguno de los dos. Nada en los cuatro repos compara un
 * tarball contra el otro.
 *
 * Lo más cerca que hay es el `typecheck` de cada consumidor, que compila contra
 * SU `dist/` instalado: un tag reescrito que borre o renombre algo se cae ahí,
 * pero sólo por los símbolos que ese consumidor usa, y una diferencia de
 * conducta con la misma superficie de tipos no la ve nadie. Queda declarado como
 * hueco, sin dueño, en vez de con un dueño que no lo es.
 *
 * Uso:
 *   node scripts/audit-installed-version.js
 *   node scripts/audit-installed-version.js --verbose
 */
const { existsSync, readFileSync } = require('node:fs');
const { dirname, join, resolve } = require('node:path');

const packageRoot = resolve(__dirname, '..');
const workspaceRoot = dirname(packageRoot);
const PACKAGE_NAME = '@memivo/contracts';
const verbose = process.argv.includes('--verbose');

// Misma costura que audit-consumers.js: se pueden apuntar a repos sintéticos
// para poder ejercitar el gate sin provocar el desajuste de verdad.
const consumers = [
  {
    name: 'memivo_api',
    root: process.env.MEMIVO_AUDIT_API_ROOT
      ? resolve(process.env.MEMIVO_AUDIT_API_ROOT)
      : resolve(workspaceRoot, 'memivo_api'),
  },
  {
    name: 'memivo_client',
    root: process.env.MEMIVO_AUDIT_CLIENT_ROOT
      ? resolve(process.env.MEMIVO_AUDIT_CLIENT_ROOT)
      : resolve(workspaceRoot, 'memivo_client'),
  },
];

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

/** La versión que este árbol publica: la cuarta ancla, y el oráculo del eje 2. */
const packageVersion = readJson(join(packageRoot, 'package.json')).version;

const SEMVER = /^\d+\.\d+\.\d+$/;

/**
 * Compara dos `x.y.z` numéricamente. No se usa `localeCompare` ni la resta de
 * strings porque el orden lexicográfico miente en cuanto hay dos dígitos:
 * `'9.0.0' > '21.0.0'` es verdadero como texto y falso como versión, y este
 * gate empieza a valer justamente cuando el major pasa de 9.
 */
const compareVersions = (left, right) => {
  const a = left.split('.').map(Number);
  const b = right.split('.').map(Number);
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return 0;
};

/**
 * Saca el tag del especificador. Cubre el tarball de tag que usa el proyecto y
 * un rango semver común, por si alguna vez se publica a un registro.
 */
const requestedVersion = (spec) => {
  if (typeof spec !== 'string') return null;
  const tarball = spec.match(/\/tags\/v?(\d+\.\d+\.\d+)\.tar\.gz/);
  if (tarball) return tarball[1];
  const plain = spec.match(/^[\^~]?(\d+\.\d+\.\d+)$/);
  if (plain) return plain[1];
  return null;
};

const findings = [];
const rows = [];
/** Por qué un consumidor declarado no llegó al censo. Vacío es lo normal. */
const huecosDelCenso = [];

for (const consumer of consumers) {
  const manifestPath = join(consumer.root, 'package.json');
  if (!existsSync(manifestPath)) {
    huecosDelCenso.push(`${consumer.name}: no hay package.json en ${consumer.root}`);
    continue;
  }

  const manifest = readJson(manifestPath);
  const spec =
    manifest.dependencies?.[PACKAGE_NAME] ??
    manifest.devDependencies?.[PACKAGE_NAME];

  if (!spec) {
    huecosDelCenso.push(`${consumer.name}: su package.json no declara ${PACKAGE_NAME}`);
    continue;
  }

  const wanted = requestedVersion(spec);
  const installedPath = join(
    consumer.root,
    'node_modules',
    ...PACKAGE_NAME.split('/'),
    'package.json',
  );
  const installed = existsSync(installedPath)
    ? readJson(installedPath).version
    : null;

  rows.push({ consumer: consumer.name, spec, wanted, installed });

  if (!wanted) {
    huecosDelCenso.push(`${consumer.name}: su especificador «${spec}» no dice ninguna versión`);
    findings.push(
      `${consumer.name}: no se pudo leer la versión pedida del especificador «${spec}». ` +
        `Si el formato cambió a propósito, actualizá requestedVersion() en este gate.`,
    );
    continue;
  }
  if (installed === null) {
    // No instalado no es desajuste: es un árbol sin `npm install`. Se informa
    // pero no se falla, para que el gate se pueda correr en un clon limpio.
    if (verbose) {
      console.log(`· ${consumer.name}: ${PACKAGE_NAME} no está instalado (sin node_modules)`);
    }
    continue;
  }
  if (installed !== wanted) {
    findings.push(
      `${consumer.name}: package.json pide ${PACKAGE_NAME}@${wanted} y hay ${installed} instalada.\n` +
        `    Arreglo:  npm --prefix ${consumer.root} install "${spec}"\n` +
        `    En Docker: docker exec <contenedor> npm install "${spec}"`,
    );
  }
}

// ── EJE 2 ──────────────────────────────────────────────────────────────────
// Se corre sobre `rows`, que ya trae todo: no hay una segunda lectura del
// disco ni un segundo recorrido de consumidores que se pueda desincronizar del
// de arriba.
const pinned = rows.filter((row) => row.wanted !== null);
const pinnedVersions = [...new Set(pinned.map((row) => row.wanted))];
const comoPide = (row) => `${row.consumer} → ${row.wanted}`;

// PISO ANTI-VACÍO. Va PRIMERO porque decide si lo que sigue midió algo: sin el
// censo completo las dos comparaciones de abajo son verdes por no mirar. Cubre
// las dos formas de quedarse corto —un consumidor declarado que no se pudo leer,
// y la lista de consumidores encogida— y el motivo está en el docblock.
const CONSUMIDORES_MINIMOS = 2;
if (consumers.length < CONSUMIDORES_MINIMOS || pinned.length !== consumers.length) {
  findings.push(
    `el censo quedó incompleto: ${pinned.length} de ${consumers.length} consumidor(es) ` +
      `declarado(s) llegaron con su pin, y hacen falta ${CONSUMIDORES_MINIMOS} para poder ` +
      'comparar.\n' +
      (huecosDelCenso.length
        ? huecosDelCenso.map((hueco) => `    · ${hueco}\n`).join('')
        : '    · la lista de consumidores de este gate quedó más corta que el mínimo\n') +
      '    El eje ENTRE repos compara consumidores entre sí, así que sin los dos no mide\n' +
      '    nada. No se degrada en silencio: un gate cross-repo que no puede ver al hermano\n' +
      '    no está pasando, está ciego.\n' +
      '    Arreglo:  corré esto con los repos como directorios HERMANOS, o apuntá\n' +
      '              MEMIVO_AUDIT_API_ROOT / MEMIVO_AUDIT_CLIENT_ROOT a donde estén.',
  );
}

if (pinnedVersions.length > 1) {
  findings.push(
    `los consumidores pinean tags DISTINTOS de ${PACKAGE_NAME}: ${pinned.map(comoPide).join(', ')}.\n` +
      '    Cada repo es internamente consistente, así que los dos `quality` dan verde y el\n' +
      '    desacuerdo aparece en el cable: un enum que un lado emite y el otro no conoce.\n' +
      `    Arreglo:  repineá los dos al mismo tag y reinstalá.`,
  );
}

if (!SEMVER.test(packageVersion)) {
  findings.push(
    `el package.json de este paquete declara la versión «${packageVersion}», que no es x.y.z. ` +
      'Sin ella no se puede decir si un pin va adelante o atrás del árbol que lo publica.',
  );
} else {
  const adelantados = pinned.filter((row) => compareVersions(row.wanted, packageVersion) > 0);
  if (adelantados.length) {
    findings.push(
      `estos consumidores piden una versión que este árbol NO publica (acá hay ${packageVersion}): ` +
        `${adelantados.map(comoPide).join(', ')}.\n` +
        '    El bump del paquete va SIEMPRE antes del repineo, así que esto es un tag que no\n' +
        '    existe o un checkout viejo de memivo-reference-data.\n' +
        '    Arreglo:  traé el paquete (`git pull`) o bajá el pin al tag que sí está tageado.',
    );
  }
}

if (verbose || findings.length) {
  console.log(`\n${PACKAGE_NAME} ${packageVersion} — versión pedida vs instalada\n`);
  for (const row of rows) {
    // `(sin instalar)` no es un desajuste y no se dibuja como tal: el gate lo
    // tolera a propósito para poder correr sobre un clon sin `npm install`, y
    // llamarlo DESAJUSTE mandaba a reinstalar por un rojo que no existe.
    const estado =
      row.installed === null ? '(sin inst.)' : row.installed === row.wanted ? 'ok' : 'DESAJUSTE';
    console.log(
      `  ${estado.padEnd(11)} ${row.consumer.padEnd(16)} pide ${row.wanted ?? '?'} · instalada ${row.installed ?? '(ninguna)'}`,
    );
  }
  console.log('');
}

if (findings.length) {
  console.error('Desajuste de versión de contratos:\n');
  for (const finding of findings) console.error(`  ✗ ${finding}`);
  console.error(
    '\nEl eje de adentro de un repo falla con errores TS2305 sobre miembros que "no\n' +
      'existen", sin mencionar la versión. El eje ENTRE repos no falla en ningún\n' +
      'compilador: cada repo es consistente consigo mismo y el desacuerdo recién\n' +
      'aparece en el cable, en runtime. Repineá o reinstalá antes de seguir.\n',
  );
  process.exit(1);
}

// El aviso del paquete adelantado: informa y NO corta, con el motivo en el
// docblock. Va por stdout SIEMPRE y no sólo en `--verbose`, porque un aviso que
// hay que pedir es un aviso que nadie lee.
if (SEMVER.test(packageVersion) && pinnedVersions.length === 1) {
  const [pinnedVersion] = pinnedVersions;
  if (compareVersions(pinnedVersion, packageVersion) < 0) {
    console.log(
      `${PACKAGE_NAME}: el paquete publica ${packageVersion} y los ${pinned.length} consumidor(es) ` +
        `siguen en ${pinnedVersion}.\n` +
        '  No corta: en el medio de una ola el bump va antes del repineo. Si la ola ya cerró,\n' +
        '  falta repinear — y que uno solo repinee sí es rojo.',
    );
  }
}

// Acá abajo el censo está COMPLETO —el piso de arriba cortó en cualquier otro
// caso—, así que la línea puede afirmar sobre cuántos midió sin mentir. La
// versión anterior imprimía además un aviso para `pinned.length < 2`: hoy esa
// rama es inalcanzable, y una rama que no se puede alcanzar es código muerto
// (ORDEN §7), no una red de seguridad.
// Y por lo mismo hay UN solo tag que nombrar: dos tags distintos ya cortaron
// arriba. Se lee del índice cero en vez de un `join`, que dibujaría un separador
// que esta línea no puede producir.
console.log(
  `${PACKAGE_NAME}: los ${pinned.length} consumidores pinean ${pinnedVersions[0]}, ` +
    `con la versión instalada al día en los que tienen node_modules.`,
);
