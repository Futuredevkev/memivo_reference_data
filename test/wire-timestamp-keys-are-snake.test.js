const test = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readFileSync, readdirSync } = require('node:fs');
const { join, relative, resolve, sep } = require('node:path');
const ts = require('typescript');

/**
 * **LAS DOS CLAVES QUE EL TRANSPORTE RENOMBRA SE DECLARAN COMO VIAJAN: SNAKE.**
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * Este paquete es la SSOT del cable y usa DOS convenciones para el mismo dato.
 * Medido sobre `src/`: **23** campos `created_at` y **6** `updated_at` en snake,
 * contra **2** tipos que lo declaran en camel (`AlbumActivityEntry`,
 * `SessionSummary`).
 *
 * Los 23 describen el CABLE. Los 2 describen la forma en MEMORIA de los dos
 * extremos: el api arma `createdAt`, su interceptor lo renombra a snake al
 * salir, y el del cliente lo devuelve a camel al entrar. Los dos funcionan.
 *
 * Lo que no funciona es que de esa diferencia sale una regla NO ESCRITA que cada
 * call-site del cliente tiene que adivinar: si el contrato dice `created_at`,
 * el tipo se envuelve en `NormalizeTransportTimestamps<>`; si dice `createdAt`,
 * NO. Y elegir mal no lo corta nada: el tipo diría `created_at`, el objeto
 * traería `createdAt`, la lectura daría `undefined` y `tsc` quedaría verde en
 * los tres repos. Es una convención sostenida a pulso 27 veces en un paquete que
 * se contradice dos.
 *
 * ── POR QUÉ UN TRINQUETE Y NO LA MIGRACIÓN ────────────────────────────────
 * Migrar los dos a `created_at` es un cambio de FORMA del paquete: arrastra una
 * versión mayor, el repin de los dos consumidores, y mover en el MISMO acto el
 * productor del api y el call-site del cliente de cada uno. Eso es una ola con
 * sus precondiciones, no un renglón. Medido el 22 ago 2026: **0 call-sites
 * desalineados** — o sea que hoy no hay un defecto abierto, hay una puerta
 * abierta. Este gate cierra la puerta: la lista de abajo no puede crecer, y cada
 * entrada tiene que decir por qué sigue.
 *
 * ── EL ALCANCE, DICHO (ORDEN §10) ─────────────────────────────────────────
 *  · **Sólo las dos claves que el mapa renombra.** `expiresAt`, `lastUsedAt` y
 *    `scannedAt` son camel en el cable y en memoria: no hay renombrado, no hay
 *    ambigüedad. El criterio real no es «camel vs snake», es «está o no está en
 *    el mapa» — y eso lo prueba `StoryResponse`, que declara `expiresAt` y
 *    `created_at` en la MISMA interfaz y funciona.
 *  · **Sólo declaraciones de propiedad.** Las claves del propio mapa y un
 *    `'createdAt' in value` son texto en otra posición y no se juzgan.
 *  · **No mide el call-site**: que el cliente envuelva o no envuelva vive en el
 *    otro repo. Lo que se cierra acá es la causa —que el paquete no diga siempre
 *    lo mismo—, no cada síntoma.
 */

const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'src');

/** Las claves que el transporte renombra. Son las únicas ambiguas. */
const RENOMBRADAS = { camel: ['createdAt', 'updatedAt'], snake: ['created_at', 'updated_at'] };

/**
 * Las dos excepciones de hoy, cada una con su motivo y su plan. Una excusa sin
 * motivo excusa cualquier cosa; una excusa cuyo campo ya no existe excusa
 * cualquier campo futuro con ese nombre, y por eso las dos se auditan abajo.
 */
const EXCEPCIONES = new Map([
  [
    'AlbumActivityEntry.createdAt',
    'describe la forma en MEMORIA de los dos extremos y no el cable: el productor del api arma `createdAt`, el interceptor lo pasa a snake al salir y el del cliente lo vuelve a camel al entrar. Migrarlo a `created_at` mueve el productor, el call-site del cliente y la versión mayor del paquete EN EL MISMO ACTO — no entra en un cambio suelto',
  ],
  [
    'SessionSummary.createdAt',
    'la misma forma y el mismo motivo que la entrada de actividad de álbum: camel en los dos extremos, snake en el cable, y la migración arrastra publicación y repin',
  ],
]);

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

/**
 * Los campos de `nombres` declarados como PROPIEDAD de un tipo del paquete,
 * calificados `Tipo.campo`.
 */
const censar = (fuentes, nombres) => {
  const encontrados = [];

  for (const fuente of fuentes) {
    const visitar = (node) => {
      const declaracion =
        ts.isInterfaceDeclaration(node) ? node
        : ts.isTypeAliasDeclaration(node) && ts.isTypeLiteralNode(node.type) ? node
        : null;

      if (declaracion) {
        const miembros = ts.isInterfaceDeclaration(declaracion)
          ? declaracion.members
          : declaracion.type.members;
        for (const miembro of miembros) {
          if (!ts.isPropertySignature(miembro) || !miembro.name) continue;
          const campo = miembro.name.getText(fuente).replace(/['"]/g, '');
          if (!nombres.includes(campo)) continue;
          encontrados.push({
            calificado: `${declaracion.name.text}.${campo}`,
            donde: `${relative(ROOT, fuente.fileName).split(sep).join('/')}:${
              fuente.getLineAndCharacterOfPosition(miembro.getStart(fuente))
                .line + 1
            }`,
          });
        }
      }
      ts.forEachChild(node, visitar);
    };
    visitar(fuente);
  }

  return encontrados;
};

const FUENTES = archivosTs(SRC).map((archivo) =>
  parsear(archivo, readFileSync(archivo, 'utf8')),
);
const EN_CAMEL = censar(FUENTES, RENOMBRADAS.camel);
const EN_SNAKE = censar(FUENTES, RENOMBRADAS.snake);

test('el gate mide algo: el detector encuentra la convención mayoritaria', () => {
  // ANCLA ANTI-CEGUERA. La lista de excepciones es corta y su verde es fácil de
  // confundir con el de un detector que dejó de leer propiedades. El censo
  // INVERSO —la forma correcta— tiene que ser grande: si diera cero, el cero de
  // los camel no significaría nada.
  assert.ok(FUENTES.length > 200, `sólo ${FUENTES.length} archivos en src/`);
  assert.ok(
    EN_SNAKE.length >= 25,
    `sólo ${EN_SNAKE.length} campos snake: el detector no está leyendo propiedades`,
  );
});

test('el detector reconoce el camel y NO acusa a las claves fuera del mapa', () => {
  const sintetico = [
    parsear(
      'sintetico.ts',
      `export interface A { createdAt: string; expiresAt: string; scannedAt: string }
       export interface B { created_at: string }
       export const MAPA = { createdAt: 'created_at' } as const;
       export const mira = (v: Record<string, unknown>) => 'createdAt' in v;`,
    ),
  ];
  // Positivo: la propiedad camel de `A`. Negativos: `expiresAt`/`scannedAt` no
  // están en el mapa, la clave del objeto no es una declaración de tipo, y el
  // `in` es una cadena. Sin los negativos, un detector que acusara a todo camel
  // —o a todo texto— pasaría el positivo igual.
  assert.deepEqual(
    censar(sintetico, RENOMBRADAS.camel).map((f) => f.calificado),
    ['A.createdAt'],
  );
  assert.equal(censar(sintetico, RENOMBRADAS.snake).length, 1);
});

test('las excepciones declaradas siguen existiendo', () => {
  // Una excusa cuyo campo ya no está excusa cualquier campo futuro con ese
  // nombre: cuando la migración pase, esta lista tiene que vaciarse con ella.
  const vigentes = new Set(EN_CAMEL.map((campo) => campo.calificado));
  assert.deepEqual(
    [...EXCEPCIONES.keys()].filter((clave) => !vigentes.has(clave)),
    [],
  );
});

test('ningún tipo NUEVO declara un timestamp del mapa en camel', () => {
  assert.deepEqual(
    EN_CAMEL.filter((campo) => !EXCEPCIONES.has(campo.calificado)).map(
      (campo) => `${campo.calificado} — ${campo.donde}`,
    ),
    [],
  );
});
