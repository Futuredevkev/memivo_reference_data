const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, readdirSync, statSync, existsSync } = require('node:fs');
const { dirname, join, relative, resolve } = require('node:path');
const ts = require('typescript');

const { ChatMessageType } = require('../dist/chat/enums');

/**
 * NADIE ESCRIBE UNA LISTA DE `ChatMessageType` A MANO. En los tres repos.
 *
 * ── EL DEFECTO QUE CIERRA, Y ES EL QUE MÁS CARO SALE ──────────────────────
 * Una lista de tipos escrita a mano no tiene gate: el próximo miembro del enum
 * queda AFUERA en silencio y hereda el comportamiento de estar afuera sin que
 * nadie lo haya decidido. Es la forma de defecto que no se pone roja — se
 * descubre con volumen, en producción, meses después. Medido en esta casa al
 * agregar `DOCUMENT`: había TRECE listas escritas a mano repartidas en los tres
 * repos, incluida la del `WHERE` de un índice PARCIAL de Postgres y la del
 * `switch` que dibuja la última línea de cada chat.
 *
 * ── POR QUÉ EL GATE VIVE ACÁ Y NO UNO POR REPO ────────────────────────────
 * Porque el enum vive acá, y **el momento en que este gate tiene que disparar
 * es exactamente el momento en que alguien lo toca**: agregar un miembro obliga
 * a publicar el paquete, y publicar corre este `quality`. Un gate por repo
 * habría sido el mismo instrumento escrito dos veces, que es la clase que
 * N-391 y N-395 ya midieron tres veces en esta casa.
 *
 * ── QUÉ CUENTA COMO LISTA, Y QUÉ NO ───────────────────────────────────────
 * Cuenta un ARRAY o un OBJETO literal que nombre DOS O MÁS miembros distintos
 * del enum. No cuentan las comparaciones sueltas (`message.type === TEXT`) ni
 * las escrituras de un valor (`{ type: ChatMessageType.SYSTEM }`): ahí no hay
 * lista, hay un caso — y el gate lo distingue contando por LITERAL y no por
 * archivo.
 *
 * Un objeto con dos o más miembros SÓLO pasa si su declaración es un `Record`
 * sobre el enum o sobre uno de sus subconjuntos con nombre. Ésa es la forma
 * que `tsc` sabe hacer cumplir: agregar un miembro rompe el build hasta
 * clasificarlo.
 *
 * ── ALCANCE DECLARADO ─────────────────────────────────────────────────────
 * Recorre `src/` de los tres repos —los dos consumidores se saltean si no
 * están clonados al lado— y reconoce el `Record` por la ANOTACIÓN o el
 * `satisfies` de la declaración que contiene al literal. No resuelve tipos: un
 * alias intermedio usado como anotación no lo vería. Hoy no existe ninguno
 * así, y el piso de tablas reconocidas es lo que impide que este gate pase
 * sobre conjunto vacío.
 */

const packageRoot = resolve(__dirname, '..');
const workspaceRoot = dirname(packageRoot);
const SEPARATOR = String.fromCharCode(92);

const ROOTS = [
  ['contracts', resolve(packageRoot, 'src')],
  ['api', resolve(workspaceRoot, 'memivo_api', 'src')],
  ['client', resolve(workspaceRoot, 'memivo_client', 'src')],
];

/** Los nombres de tipo que hacen TOTAL a un `Record` por tipo de mensaje. */
const TOTAL_KEYS = [
  'ChatMessageType',
  'ChatMediaMessageType',
  'ChatFileBearingMessageType',
];

const MEMBERS = new Set(Object.keys(ChatMessageType));

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
};

/**
 * El literal que este miembro ENUMERA, si es que enumera alguno.
 *
 * ── LA DISTINCIÓN QUE COSTÓ UNA MEDICIÓN ──────────────────────────────────
 * Un miembro del enum aparece en dos posiciones muy distintas, y la primera
 * versión de este reconocedor las confundía:
 *
 *   · como CLAVE de una tabla o elemento de un array → eso es una LISTA, y es
 *     lo que este gate persigue;
 *   · como VALOR elegido por una condición
 *     (`messageType: hayVideo ? VIDEO : IMAGE`) → eso es un CASO, no una
 *     tabla: no clasifica al enum, elige uno.
 *
 * Contando por objeto contenedor, el segundo daba positivo y el gate acusaba
 * a un archivo correcto — la clase de N-307, un gate que acusa mucho porque
 * mide mal. Ahora sólo cuenta la posición de CLAVE.
 */
const enumeratingLiteral = (node) => {
  const parent = node.parent;
  if (!parent) return null;
  // Elemento de un array: `[IMAGE, VIDEO]`.
  if (ts.isArrayLiteralExpression(parent)) return parent;
  // Clave computada de un objeto: `{ [IMAGE]: … }`.
  if (
    ts.isComputedPropertyName(parent) &&
    parent.parent &&
    ts.isObjectLiteralExpression(parent.parent.parent)
  ) {
    return parent.parent.parent;
  }
  return null;
};

/** El texto del tipo declarado (anotación o `satisfies`) que envuelve al literal. */
const declaredTypeText = (literal) => {
  let current = literal.parent;
  while (current) {
    if (ts.isSatisfiesExpression && ts.isSatisfiesExpression(current) && current.type) {
      return current.type.getText();
    }
    if (ts.isAsExpression(current) && current.type) return current.type.getText();
    if (ts.isVariableDeclaration(current) || ts.isPropertyDeclaration(current)) {
      return current.type ? current.type.getText() : '';
    }
    if (ts.isSourceFile(current)) return '';
    current = current.parent;
  }
  return '';
};

const isTotalRecord = (typeText) =>
  typeText.includes('Record<') &&
  TOTAL_KEYS.some((key) => typeText.includes(key)) &&
  !typeText.includes('Partial<');

/** Los literales de un archivo que nombran 2+ miembros, con su tipo declarado. */
const listLiterals = (file) => {
  const text = readFileSync(file, 'utf8');
  if (!text.includes('ChatMessageType')) return [];
  const parsed = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    /\.tsx$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const byLiteral = new Map();
  const visit = (node) => {
    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'ChatMessageType' &&
      MEMBERS.has(node.name.text)
    ) {
      const literal = enumeratingLiteral(node);
      if (literal) {
        if (!byLiteral.has(literal)) byLiteral.set(literal, new Set());
        byLiteral.get(literal).add(node.name.text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(parsed);

  return [...byLiteral.entries()]
    .filter((entry) => entry[1].size >= 2)
    .map((entry) => ({
      isArray: ts.isArrayLiteralExpression(entry[0]),
      declaredType: declaredTypeText(entry[0]),
    }));
};

const census = () => {
  const offenders = [];
  let recognised = 0;

  for (const root of ROOTS) {
    const label = root[0];
    const dir = root[1];
    if (!existsSync(dir)) continue;
    for (const file of walk(dir)) {
      for (const literal of listLiterals(file)) {
        recognised += 1;
        const where = label + ' · ' + relative(dir, file).split(SEPARATOR).join('/');
        if (literal.isArray) {
          offenders.push(
            where + ': un ARRAY con dos o más miembros del enum es una lista escrita a mano; derivala de un `Record` total',
          );
        } else if (!isTotalRecord(literal.declaredType)) {
          offenders.push(
            where +
              ': el objeto que clasifica por tipo no se declara como `Record` total (dice "' +
              (literal.declaredType || 'sin tipo') +
              '")',
          );
        }
      }
    }
  }

  return { offenders: offenders, recognised: recognised };
};

test('ningún repo escribe una lista de ChatMessageType a mano', () => {
  const result = census();

  // Ancla anti-ceguera: el reconocedor tiene que estar VIENDO tablas. Sin este
  // piso, un cambio en el AST que dejara de encontrar literales daría verde
  // sobre conjunto vacío, que es la forma más común de que un gate deje de
  // cortar. El número está anclado en la salud del INSTRUMENTO y no en la
  // deuda (N-387): son las tablas que hoy clasifican por tipo.
  assert.ok(
    result.recognised >= 5,
    'el censo reconoció ' + result.recognised + ' tablas por tipo; esperaba al menos 5',
  );

  assert.deepEqual(result.offenders, []);
});

test('el reconocedor distingue una lista de un caso suelto', () => {
  // Control positivo y negativo sobre el mismo instrumento (N-308), con las
  // formas exactas que el árbol usa.
  const fs = require('node:fs');
  const probe = join(packageRoot, 'test', '__census-probe.ts');

  fs.writeFileSync(
    probe,
    [
      "import { ChatMessageType } from '../src/chat/enums';",
      'export const suelto = { type: ChatMessageType.TEXT };',
      'export const otro = { type: ChatMessageType.SYSTEM };',
      // El caso que costó una medición: dos miembros adentro del MISMO objeto,
      // pero como valor de una ternaria. Es un caso, no una tabla.
      'export const elegido = (v) => ({ tipo: v ? ChatMessageType.VIDEO : ChatMessageType.IMAGE });',
      'export const lista = [ChatMessageType.IMAGE, ChatMessageType.VIDEO];',
    ].join(String.fromCharCode(10)),
    'utf8',
  );
  try {
    const found = listLiterals(probe);
    // Los dos objetos de UN miembro no son listas; el array de dos, sí.
    assert.equal(found.length, 1);
    assert.equal(found[0].isArray, true);
  } finally {
    fs.rmSync(probe, { force: true });
  }
});
