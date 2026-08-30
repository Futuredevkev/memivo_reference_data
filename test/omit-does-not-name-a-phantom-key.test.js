const test = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readFileSync, readdirSync } = require('node:fs');
const { join, relative, resolve, sep } = require('node:path');
const ts = require('typescript');

/**
 * **UN `Omit` NO PUEDE NOMBRAR UNA CLAVE QUE EL TIPO NO TIENE.**
 *
 * ── EL DEFECTO QUE CIERRA, MEDIDO ─────────────────────────────────────────
 * `OrganizerAlbumResponse.album` declaraba
 * `Omit<OrganizerAlbumListItemResponse<TTimestamp>, 'updated_at'>` sobre una
 * interfaz que NO declara `updated_at`. Para el compilador es un no-op: `Omit`
 * de una clave inexistente devuelve el mismo tipo, así que nada se pone rojo.
 * Para un lector es lo contrario de un no-op: es la prueba escrita de que el
 * campo existe en algún lado y que acá se lo recorta a propósito.
 *
 * Eso NO fue inofensivo. El productor del listado del organizador emitió
 * `updated_at` —una clave fuera del contrato, con su columna traída de la base
 * en cada página— y esta línea era la única huella del repo que hacía pensar que
 * el campo seguía vivo. El recorte a medias sobrevivió a que la clave se fuera:
 * alguien la sacó de la interfaz y no del `Omit`.
 *
 * ── POR QUÉ UN GATE Y NO «BORRALO Y LISTO» ────────────────────────────────
 * Porque el modo de falla es que el `Omit` SOBREVIVA a la clave, y eso no pasa
 * el día que se escribe: pasa el día que alguien limpia la interfaz. O sea que
 * borrar este caso no impide el próximo — sólo lo hace más raro—. La regla es
 * mecánica y el oráculo es la propia interfaz.
 *
 * ── EL ALCANCE, DICHO (ORDEN §10) ─────────────────────────────────────────
 *  · **Sólo claves LITERALES.** `Omit<ApiErrorEnvelope, ReservedErrorBodyKey>`
 *    recorta por un alias de unión y no se juzga: resolverlo pide el checker.
 *    Se cuenta aparte para que el día que sean mayoría se vea.
 *  · **Sólo tipos que este paquete declara.** Un `Omit` sobre un tipo importado
 *    de una librería no tiene oráculo acá.
 *  · **Las claves heredadas SUMAN.** Si la base no se puede resolver, el
 *    conjunto de claves queda incompleto y el gate calla: la dirección segura es
 *    el falso negativo, porque el falso positivo hace que alguien borre un
 *    recorte que sí hacía falta.
 *  · **No mira `Pick`.** Un `Pick` de una clave inexistente NO compila —el
 *    compilador ya es su gate—, y por eso no hace falta duplicarlo acá. `Omit`
 *    es el caso raro: acepta cualquier `string`.
 */

const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'src');

const archivosTs = (directorio) => {
  const encontrados = [];
  if (!existsSync(directorio)) return encontrados;
  for (const entrada of readdirSync(directorio, { withFileTypes: true })) {
    const ruta = join(directorio, entrada.name);
    if (entrada.isDirectory()) encontrados.push(...archivosTs(ruta));
    else if (ruta.endsWith('.ts')) encontrados.push(ruta);
  }
  return encontrados;
};

const parsear = (archivo, texto) =>
  ts.createSourceFile(archivo, texto, ts.ScriptTarget.Latest, true);

/** Todas las declaraciones del paquete, por nombre. */
const indexar = (fuentes) => {
  const declaraciones = new Map();
  for (const fuente of fuentes) {
    const visitar = (node) => {
      if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
        if (!declaraciones.has(node.name.text)) {
          declaraciones.set(node.name.text, { node, fuente });
        }
      }
      ts.forEachChild(node, visitar);
    };
    visitar(fuente);
  }
  return declaraciones;
};

/** El nombre pelado de una referencia de tipo, sin sus argumentos. */
const nombreDe = (nodo, fuente) => {
  if (ts.isTypeReferenceNode(nodo)) {
    return nodo.typeName.getText(fuente).split('.')[0];
  }
  if (ts.isExpressionWithTypeArguments(nodo)) {
    return nodo.expression.getText(fuente).split('.')[0];
  }
  return null;
};

/**
 * Las claves que un tipo declara, sumando su cadena de herencia. Devuelve
 * `null` cuando el conjunto NO se puede dar por completo —una base que no
 * resuelve, una forma que este recorrido no lee—, y ese `null` es lo que hace
 * que el gate calle en vez de inventar un hallazgo.
 */
const clavesDe = (nombre, declaraciones, vistos = new Set()) => {
  if (vistos.has(nombre)) return new Set();
  vistos.add(nombre);

  const entrada = declaraciones.get(nombre);
  if (!entrada) return null;

  const { node, fuente } = entrada;
  const claves = new Set();

  const miembros = ts.isInterfaceDeclaration(node)
    ? node.members
    : ts.isTypeLiteralNode(node.type)
      ? node.type.members
      : null;
  if (miembros === null) return null;

  for (const miembro of miembros) {
    if (ts.isPropertySignature(miembro) && miembro.name) {
      claves.add(miembro.name.getText(fuente).replace(/['"]/g, ''));
    }
  }

  for (const clausula of node.heritageClauses ?? []) {
    for (const tipo of clausula.types) {
      const base = nombreDe(tipo, fuente);
      const heredadas = base ? clavesDe(base, declaraciones, vistos) : null;
      if (heredadas === null) return null;
      for (const clave of heredadas) claves.add(clave);
    }
  }

  return claves;
};

/** Las claves literales de un nodo de tipo: `'a'` o `'a' | 'b'`. */
const clavesLiterales = (nodo) => {
  if (ts.isLiteralTypeNode(nodo) && ts.isStringLiteral(nodo.literal)) {
    return [nodo.literal.text];
  }
  if (ts.isUnionTypeNode(nodo)) {
    const partes = nodo.types.map(clavesLiterales);
    return partes.some((parte) => parte === null) ? null : partes.flat();
  }
  return null;
};

/**
 * Cada `Omit<X, K>` del corpus, clasificado. `fantasmas` son los hallazgos;
 * `juzgados` y `sinLiteral` existen para poder afirmar que el detector midió.
 */
const censar = (fuentes) => {
  const declaraciones = indexar(fuentes);
  const fantasmas = [];
  let juzgados = 0;
  let sinLiteral = 0;
  let sinOraculo = 0;

  for (const fuente of fuentes) {
    const visitar = (node) => {
      const esOmit =
        (ts.isTypeReferenceNode(node) || ts.isExpressionWithTypeArguments(node)) &&
        nombreDe(node, fuente) === 'Omit' &&
        (node.typeArguments ?? []).length === 2;

      if (esOmit) {
        const [origen, recorte] = node.typeArguments;
        const nombreOrigen = nombreDe(origen, fuente);
        const claves = nombreOrigen ? clavesDe(nombreOrigen, declaraciones) : null;
        const recortadas = clavesLiterales(recorte);

        if (recortadas === null) sinLiteral += 1;
        else if (claves === null) sinOraculo += 1;
        else {
          juzgados += recortadas.length;
          for (const clave of recortadas) {
            if (!claves.has(clave)) {
              fantasmas.push(
                `${relative(ROOT, fuente.fileName).split(sep).join('/')}:${
                  fuente.getLineAndCharacterOfPosition(node.getStart(fuente))
                    .line + 1
                } — ${nombreOrigen} no declara '${clave}'`,
              );
            }
          }
        }
      }
      ts.forEachChild(node, visitar);
    };
    visitar(fuente);
  }

  return { fantasmas, juzgados, sinLiteral, sinOraculo };
};

const FUENTES = archivosTs(SRC).map((archivo) =>
  parsear(archivo, readFileSync(archivo, 'utf8')),
);
const CENSO = censar(FUENTES);

test('el gate mide algo: hay corpus y hay claves juzgadas', () => {
  // Un corpus vacío o un detector que dejó de reconocer la forma daría cero
  // fantasmas y se leería como limpio: sobre el conjunto vacío el gate está
  // APAGADO, no limpio.
  assert.ok(FUENTES.length > 200, `sólo ${FUENTES.length} archivos en src/`);
  assert.ok(
    CENSO.juzgados >= 3,
    `sólo ${CENSO.juzgados} claves de Omit juzgadas (sin literal: ${CENSO.sinLiteral}, sin oráculo: ${CENSO.sinOraculo})`,
  );
});

test('el detector reconoce una clave fantasma y NO acusa a una real', () => {
  // Las dos mitades del control. Sin la negativa, un detector que acusara
  // siempre pasaría la positiva; sin la positiva, uno que no acusa nunca
  // pasaría la negativa. Y `extends` está en el caso a propósito: la clave
  // heredada es real y acusarla sería el falso positivo más caro del gate.
  const sintetico = [
    parsear(
      'base.ts',
      `export interface Base { heredada: string }
       export interface Origen extends Base { propia: string }`,
    ),
    parsear(
      'uso.ts',
      `import type { Origen } from './base';
       export type A = Omit<Origen, 'propia'>;
       export type B = Omit<Origen, 'heredada'>;
       export type C = Omit<Origen, 'nunca-existio'>;`,
    ),
  ];
  const resultado = censar(sintetico);

  assert.equal(resultado.juzgados, 3);
  assert.deepEqual(resultado.fantasmas, [
    "uso.ts:4 — Origen no declara 'nunca-existio'",
  ]);
});

test('ningún Omit del paquete recorta una clave que el tipo no declara', () => {
  assert.deepEqual(CENSO.fantasmas, []);
});
