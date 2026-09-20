const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const { join, relative, resolve, sep } = require('node:path');
const ts = require('typescript');

const { MEDIA_AVAILABILITY_BY_RESOURCE } = require('../dist/media/index.js');
// Por su ruta y no por el barrel: la tabla de portadores vive en `internal/`
// —es metadata del paquete, no algo que un consumidor importe— y esas piezas no
// se re-exportan, igual que sus hermanas de ese directorio.
const {
  MEDIA_AVAILABILITY_CARRIERS,
} = require('../dist/media/constants/internal/media-availability-carriers.constant.js');

/**
 * **QUIEN PROMETE QUE AVISA CUANDO MUERE TIENE QUE PODER CUMPLIRLO.**
 *
 * ── SU GEMELO CUBRE LA OTRA DIRECCIÓN, Y ÉSTA FALTABA ─────────────────────
 * `a-delivered-asset-declares-its-availability` contesta «¿toda pieza entregada
 * DECLARA disponibilidad?». Falta la inversa, que es por donde entró el
 * defecto: **«¿todo el que la declara puede CUMPLIRLA?»**. Las dos juntas
 * cierran el canal; cualquiera sola deja una punta abierta.
 *
 * ── EL DEFECTO QUE CIERRA, CON NOMBRE Y FECHA ─────────────────────────────
 * `CoverPhotoData` heredó `MediaAvailability` en la línea de pagos mientras
 * `ALBUM_COVER` estaba —y sigue— en `false` en el barrido. O sea que el tipo
 * prometía «yo te digo si mi imagen todavía existe» sobre un archivo que nadie
 * sondea: los dos helpers de portada escribían `unavailable: false` a mano y el
 * cliente ni siquiera lo leía.
 *
 * Y NINGÚN COMPILADOR PUEDE VER ESO, que es lo que lo vuelve un gate y no una
 * revisión: las dos mitades son ciertas por separado —la interfaz compone bien,
 * la tabla del barrido clasifica bien— y el desacuerdo sólo existe entre ellas.
 * Su gemelo tampoco lo veía: `CoverPhotoData` no declara `resourceType`, así que
 * nunca entró a su corpus.
 *
 * ── LOS TRES CRUCES, Y POR QUÉ NINGUNO SOBRA ──────────────────────────────
 *  1. **Toda forma que hereda el contrato tiene entrada.** Sin esto, la forma
 *     nueva entra en silencio con la promesa sin respaldo, que es exactamente
 *     lo que pasó.
 *  2. **Toda entrada nombra una forma que existe y que hereda.** Una entrada
 *     que se quedó sin dueño no es inocua: queda tapando en blanco a la próxima
 *     forma que se llame igual. Es la misma doctrina que las allowlists
 *     auto-auditadas de este árbol.
 *  3. **Todo recurso listado está en el barrido.** Es el cruce que da sentido a
 *     los otros dos: sin él, la tabla de portadores sería una lista de deseos.
 *
 * ── ALCANCE, DICHO ────────────────────────────────────────────────────────
 *  · Lee TEXTO parseado con el compilador y ve la herencia ESCRITA, igual que
 *    su gemelo: una forma que reciba la marca por un alias intermedio
 *    (`type X = Y & MediaAvailability`) no entra al corpus. Hoy no hay ninguna;
 *    si apareciera, el síntoma sería que su entrada acá sobra —cruce 2— y el
 *    gate se pone rojo, que es fallar hacia el lado seguro.
 *  · **No mide que el recorte por portador sea el correcto.** Que una respuesta
 *    de archivo del chat lleve los cuatro recursos del chat y no una historia
 *    es un hecho del dominio, declarado a mano. Lo que sí impide es que ese
 *    recorte nombre algo que el barrido no sondea.
 *  · No mide quién EMITE ni quién LEE: eso vive un repo a cada lado, con sus
 *    propios gates.
 *
 * Verificado ROMPIÉNDOLO por los tres cruces.
 */

const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'src');

const CONTRATO = 'MediaAvailability';

const fuentes = (dir, acc = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) fuentes(full, acc);
    else if (entry.name.endsWith('.ts')) acc.push(full);
  }
  return acc;
};

const rel = (file) => relative(ROOT, file).split(sep).join('/');

/**
 * Las interfaces que HEREDAN el contrato, por la forma del árbol y no por
 * buscar el nombre en el texto: `ProfessionalPhotoListItem` lo NOMBRA en un
 * docblock sin heredarlo, y un `includes` la contaría — que es justo la clase
 * de detector que se degrada solo.
 */
const portadoras = () => {
  const encontradas = [];
  for (const file of fuentes(SRC)) {
    const source = ts.createSourceFile(
      file,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    );
    const visit = (node) => {
      if (ts.isInterfaceDeclaration(node)) {
        const heredadas = (node.heritageClauses ?? []).flatMap((clause) =>
          clause.types.map((type) => type.expression.getText(source)),
        );
        if (heredadas.includes(CONTRATO)) {
          encontradas.push({ nombre: node.name.text, archivo: rel(file) });
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return encontradas;
};

const PORTADORAS = portadoras();

test('mide algo: el recorrido encuentra portadoras y las dos tablas están cargadas', () => {
  // Cota inferior, no censo: el día que el parseo se rompa o el contrato se
  // renombre, el gate se cae en vez de aprobar sobre el conjunto vacío — que es
  // la forma en que un gate se apaga sin que nadie lo note.
  assert.ok(
    PORTADORAS.length > 0,
    `ninguna interfaz hereda ${CONTRATO}: el roto es el recorrido, no el árbol`,
  );
  assert.ok(
    Object.keys(MEDIA_AVAILABILITY_CARRIERS).length > 0,
    'la tabla de portadores llegó vacía: revisá que `dist` esté construido',
  );
  assert.ok(
    Object.keys(MEDIA_AVAILABILITY_BY_RESOURCE).length > 0,
    'la tabla del barrido llegó vacía: revisá que `dist` esté construido',
  );
});

test('toda forma que hereda el contrato declara de qué recursos sale', () => {
  const sinDeclarar = PORTADORAS.filter(
    (forma) => !(forma.nombre in MEDIA_AVAILABILITY_CARRIERS),
  ).map(
    (forma) =>
      `${forma.archivo} · ${forma.nombre} hereda ${CONTRATO} y no tiene entrada en ` +
      '`MEDIA_AVAILABILITY_CARRIERS`. Prometer «te aviso cuando muera» sin decir de ' +
      'qué recurso sale deja la promesa sin nada que la respalde: declará sus ' +
      'recursos, o sacale el `extends`.',
  );

  assert.deepEqual(sinDeclarar, []);
});

test('toda entrada de la tabla nombra una forma que existe y que hereda', () => {
  const nombres = new Set(PORTADORAS.map((forma) => forma.nombre));
  const huerfanas = Object.keys(MEDIA_AVAILABILITY_CARRIERS)
    .filter((nombre) => !nombres.has(nombre))
    .map(
      (nombre) =>
        `MEDIA_AVAILABILITY_CARRIERS.${nombre} no nombra ninguna interfaz que herede ` +
        `${CONTRATO}. Una entrada sin dueño no es inocua: queda tapando en blanco a la ` +
        'próxima forma que se llame igual. Borrala.',
    );

  assert.deepEqual(huerfanas, []);
});

test('todo recurso declarado por un portador está en el barrido', () => {
  const rotos = Object.entries(MEDIA_AVAILABILITY_CARRIERS).flatMap(
    ([portador, recursos]) =>
      recursos
        .filter((recurso) => MEDIA_AVAILABILITY_BY_RESOURCE[recurso] !== true)
        .map(
          (recurso) =>
            `${portador} dice llevar \`${recurso}\`, que está en \`false\` en ` +
            '`MEDIA_AVAILABILITY_BY_RESOURCE`. Nadie sondea ese recurso, así que su ' +
            '`unavailable` viajaría SIEMPRE en `false` y el tipo prometería un dato que ' +
            'nadie mantiene. O el recurso entra al barrido, o el portador no puede ' +
            'declarar disponibilidad.',
        ),
  );

  assert.deepEqual(rotos, []);
});
