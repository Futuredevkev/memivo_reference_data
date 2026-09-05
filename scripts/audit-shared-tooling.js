#!/usr/bin/env node
/**
 * Gate: las HERRAMIENTAS DE GATE que los cuatro repos comparten corren la MISMA
 * versión.
 *
 * ── EL DEFECTO QUE CIERRA, medido ────────────────────────────────────────
 * Los cuatro `package.json` decían `"knip": "^6.4.1"` y lo INSTALADO divergía:
 * este repo corría **6.34.0** y los otros tres 6.4.1 — treinta minors de
 * diferencia en el detector de código muerto—. No era estado sucio de disco:
 * el `package-lock.json` de este repo resolvía 6.34.0, así que un `npm ci`
 * limpio reinstalaba la divergencia. O sea que el repo del SSOT **no hacía la
 * misma pregunta sobre código muerto** que sus dos consumidores, y nadie lo iba
 * a mirar porque el registro declaraba que era la misma herramienta.
 *
 * La ficha que instaló knip decía, textual, «cableado con la misma versión que
 * los hermanos (`knip@^6.4.1`)», y lo cableó en `^6.34.0`: la afirmación NACIÓ
 * falsa, en el mismo commit. Es lo que `CLAUDE.md` nombra sobre `patches` —una
 * dependencia de gate que se desalinea sin que nada avise—, y un docblock no lo
 * cierra: ya se probó y así salió.
 *
 * ── POR QUÉ EL RANGO NO ALCANZA, Y POR QUÉ EL PIN ES EXACTO ──────────────
 * Los cuatro rangos ya decían `^6.4.1` cuando la divergencia estaba viva: un
 * caret admite treinta minors, así que gatear el rango no cierra nada. Por eso
 * el pin es EXACTO (`"knip": "6.4.1"`): con el caret, el rango y lo instalado
 * pueden decir cosas distintas sin mentir ninguno de los dos.
 *
 * ── LAS DOS COMPARACIONES, Y POR QUÉ LA SEGUNDA NO PIDE `node_modules` ───
 *  1. **Los cuatro declaran el mismo especificador.** Sobre `package.json`.
 *  2. **El lock de cada repo resuelve ese mismo número.** Sobre
 *     `package-lock.json`, que está VERSIONADO — así que este gate mide entero
 *     en una CI con los cuatro repos en checkout y sin un solo `npm ci`. Es lo
 *     que lo distingue de `audit:installed-version`, que sí necesita el
 *     `node_modules` de un consumidor y por eso está exento de `ssot.yml`.
 *  3. Y si el `node_modules` está, se compara también. Cuando no está no falla:
 *     un clon sin instalar no es un desajuste.
 *
 * ── ALCANCE DECLARADO (ORDEN §10) ────────────────────────────────────────
 * · Cubre las herramientas de `HERRAMIENTAS_COMPARTIDAS`, no todas las
 *   dependencias comunes. El eje es «una herramienta que DECIDE si un gate
 *   pasa»: si dos repos corren detectores distintos, sus verdes no significan
 *   lo mismo. Una librería de runtime que difiera es otro eje —cada app elige
 *   la suya— y no entra acá.
 * · No compara la CONFIGURACIÓN de la herramienta, y esa mitad importa más de
 *   lo que parecía: alinear las versiones puso **ROJO** al `dead` de este repo
 *   con 279 miembros de enum, o sea que las dos versiones NO hacían la misma
 *   pregunta y el verde anterior no era limpio, era otra medición. Que cada
 *   `knip.json` diga qué mide y qué no lo sostiene `knip-scope-is-declared`,
 *   que existe en el api, en el cliente y —desde el 5 de septiembre de 2026, y
 *   por esto— también acá. Queda dicho para que el verde de este auditor no se
 *   lea como «los cuatro miden lo mismo».
 *
 * Uso:
 *   node scripts/audit-shared-tooling.js
 *   node scripts/audit-shared-tooling.js --verbose
 */
const { existsSync, readFileSync } = require('node:fs');
const { dirname, join, resolve } = require('node:path');

const packageRoot = resolve(__dirname, '..');
const workspaceRoot = dirname(packageRoot);
const verbose = process.argv.includes('--verbose');

/**
 * Las herramientas que DECIDEN si un gate pasa, y que por eso tienen que ser la
 * misma en los cuatro repos.
 *
 * `knip` es la que motivó el gate. Cuántas son no se transcribe a ningún
 * docblock: esta lista es el censo.
 */
const HERRAMIENTAS_COMPARTIDAS = ['knip'];

// Misma costura que los otros auditores: se pueden apuntar a repos sintéticos
// para ejercitar el gate sin provocar el desajuste de verdad.
const raiz = (nombre, variable) =>
  process.env[variable]
    ? resolve(process.env[variable])
    : resolve(workspaceRoot, nombre);

const REPOS = [
  { name: 'memivo-reference-data', root: packageRoot },
  { name: 'memivo_api', root: raiz('memivo_api', 'MEMIVO_AUDIT_API_ROOT') },
  { name: 'memivo_client', root: raiz('memivo_client', 'MEMIVO_AUDIT_CLIENT_ROOT') },
  { name: 'memivo_landing', root: raiz('memivo_landing', 'MEMIVO_AUDIT_LANDING_ROOT') },
];

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

const findings = [];
/** Por qué un repo declarado no llegó al censo. Vacío es lo normal. */
const huecosDelCenso = [];

/** Lo que el lock resuelve para esa herramienta, o `null` si no la trae. */
const versionEnElLock = (root, herramienta) => {
  const lockPath = join(root, 'package-lock.json');
  if (!existsSync(lockPath)) return null;
  const entrada = readJson(lockPath).packages?.[`node_modules/${herramienta}`];
  return entrada?.version ?? null;
};

const versionInstalada = (root, herramienta) => {
  const manifiesto = join(root, 'node_modules', herramienta, 'package.json');
  return existsSync(manifiesto) ? readJson(manifiesto).version : null;
};

for (const herramienta of HERRAMIENTAS_COMPARTIDAS) {
  const filas = [];

  for (const repo of REPOS) {
    const manifestPath = join(repo.root, 'package.json');
    if (!existsSync(manifestPath)) {
      huecosDelCenso.push(`${repo.name}: no hay package.json en ${repo.root}`);
      continue;
    }

    const manifest = readJson(manifestPath);
    const spec =
      manifest.dependencies?.[herramienta] ??
      manifest.devDependencies?.[herramienta];

    if (!spec) {
      huecosDelCenso.push(
        `${repo.name}: su package.json no declara \`${herramienta}\``,
      );
      continue;
    }

    filas.push({
      repo: repo.name,
      spec,
      lock: versionEnElLock(repo.root, herramienta),
      instalada: versionInstalada(repo.root, herramienta),
    });
  }

  // PISO ANTI-VACÍO. Va primero porque decide si lo que sigue midió algo: con el
  // censo corto, comparar «todos contra todos» es verde por no mirar.
  if (filas.length !== REPOS.length) {
    findings.push(
      `\`${herramienta}\`: el censo quedó incompleto — ${filas.length} de ${REPOS.length} repos.\n` +
        huecosDelCenso.map((hueco) => `    · ${hueco}\n`).join('') +
        '    Un gate cross-repo que no puede ver a los hermanos no está pasando, está ciego.\n' +
        '    Arreglo:  corrélo con los cuatro repos como directorios HERMANOS.',
    );
    continue;
  }

  const specs = [...new Set(filas.map((fila) => fila.spec))];
  if (specs.length > 1) {
    findings.push(
      `\`${herramienta}\`: los repos declaran especificadores DISTINTOS — ` +
        `${filas.map((f) => `${f.repo} → ${f.spec}`).join(', ')}.\n` +
        '    Cuatro repos con dos detectores distintos no hacen la misma pregunta,\n' +
        '    y sus verdes no significan lo mismo.',
    );
  }

  const conCaret = filas.filter((fila) => !/^\d+\.\d+\.\d+$/.test(fila.spec));
  if (conCaret.length > 0) {
    findings.push(
      `\`${herramienta}\`: el pin tiene que ser EXACTO y ` +
        `${conCaret.map((f) => f.repo).join(', ')} usa un rango ` +
        `(${conCaret.map((f) => f.spec).join(', ')}).\n` +
        '    Con `^` los cuatro pueden declarar lo mismo y correr versiones distintas:\n' +
        '    es exactamente lo que pasó, con treinta minors de diferencia.',
    );
  }

  for (const fila of filas) {
    if (fila.lock === null) {
      findings.push(
        `\`${herramienta}\`: el lock de ${fila.repo} no la trae, así que un ` +
          '`npm ci` no la instala y su `dead` no corre.',
      );
      continue;
    }
    if (fila.lock !== fila.spec) {
      findings.push(
        `\`${herramienta}\`: ${fila.repo} declara ${fila.spec} y su lock resuelve ` +
          `${fila.lock}. Un \`npm ci\` limpio instala la del lock.\n` +
          `    Arreglo:  npm --prefix <${fila.repo}> install ${herramienta}@${fila.spec} --save-exact`,
      );
    }
    if (fila.instalada !== null && fila.instalada !== fila.spec) {
      findings.push(
        `\`${herramienta}\`: ${fila.repo} tiene ${fila.instalada} INSTALADA y declara ` +
          `${fila.spec}.\n` +
          `    Arreglo:  npm --prefix <${fila.repo}> install ${herramienta}@${fila.spec} --save-exact`,
      );
    }
  }

  if (verbose) {
    for (const fila of filas) {
      console.log(
        `· ${herramienta} ${fila.repo}: declara ${fila.spec} · lock ${fila.lock} · instalada ${fila.instalada ?? '—'}`,
      );
    }
  }
}

if (findings.length > 0) {
  console.error('audit-shared-tooling: las herramientas de gate divergen\n');
  for (const finding of findings) console.error(`  ✗ ${finding}\n`);
  process.exit(1);
}

console.log(
  `audit-shared-tooling: ${HERRAMIENTAS_COMPARTIDAS.join(', ')} — misma versión en los ${REPOS.length} repos`,
);
