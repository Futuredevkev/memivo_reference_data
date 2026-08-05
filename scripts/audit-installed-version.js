#!/usr/bin/env node
/**
 * Gate: la versión de `@memivo/contracts` que un consumidor tiene INSTALADA
 * tiene que ser la que su `package.json` PIDE.
 *
 * Por qué existe. La dependencia entra como tarball de un tag de GitHub
 * (`.../archive/refs/tags/v4.31.0.tar.gz`), no como paquete de registro con
 * rango semver. npm resuelve esa URL una sola vez: si el árbol ya está poblado
 * y la URL cambia, **no reinstala** y la versión vieja se queda. No hay aviso.
 *
 * Lo que pasa después no se parece a un problema de dependencias:
 *
 *     src/album/constants/album-password/album-password-too-long-code.constant.ts:14:10
 *       error TS2305: Module '"@memivo/contracts/album"' has no exported member
 *       'ALBUM_PASSWORD_TOO_LONG_CODE'.
 *
 * Tres errores de tipos que no nombran a npm, a la versión ni al tag. En la
 * auditoría del 2026-08-04 el backend estaba caído por esto —`package.json`
 * pedía v4.31.0 y el contenedor tenía 4.29.0— y el healthcheck de Docker sólo
 * decía «connection refused».
 *
 * Vive acá y no en cada consumidor por el mismo motivo que los otros auditores
 * de este paquete: el problema es del contrato, y duplicarlo en los dos repos
 * sería mantener dos copias de la misma regla. Los consumidores lo invocan con
 * `npm --prefix ../memivo-reference-data run audit:installed-version`, igual que
 * `audit:consumers` y compañía.
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

for (const consumer of consumers) {
  const manifestPath = join(consumer.root, 'package.json');
  if (!existsSync(manifestPath)) {
    if (verbose) console.log(`· ${consumer.name}: sin package.json, se omite`);
    continue;
  }

  const manifest = readJson(manifestPath);
  const spec =
    manifest.dependencies?.[PACKAGE_NAME] ??
    manifest.devDependencies?.[PACKAGE_NAME];

  if (!spec) {
    if (verbose) console.log(`· ${consumer.name}: no consume ${PACKAGE_NAME}`);
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

if (verbose || findings.length) {
  console.log(`\n${PACKAGE_NAME} — versión pedida vs instalada\n`);
  for (const row of rows) {
    const estado = row.installed === row.wanted ? 'ok' : 'DESAJUSTE';
    console.log(
      `  ${estado.padEnd(10)} ${row.consumer.padEnd(16)} pide ${row.wanted ?? '?'} · instalada ${row.installed ?? '(ninguna)'}`,
    );
  }
  console.log('');
}

if (findings.length) {
  console.error('Desajuste de versión de contratos:\n');
  for (const finding of findings) console.error(`  ✗ ${finding}`);
  console.error(
    '\nUn desajuste hace que el consumidor falle con errores TS2305 sobre miembros\n' +
      'que "no existen", sin mencionar la versión. Reinstalá antes de seguir.\n',
  );
  process.exit(1);
}

console.log(
  `${PACKAGE_NAME}: versión instalada al día en ${rows.length} consumidor(es).`,
);
