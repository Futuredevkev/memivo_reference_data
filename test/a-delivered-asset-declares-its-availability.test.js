const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const { join, relative, resolve, sep } = require('node:path');
const ts = require('typescript');

/**
 * **TODA FORMA DE ESTE PAQUETE QUE DESCRIBA UN ASSET ENTREGADO DICE SI TODAVÍA
 * EXISTE.**
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * El canal que dice «esta pieza ya no está» nació SIN un solo gate, y la prueba
 * de que hacía falta la dio él mismo: de las formas que tenían que llevar la
 * marca, dos nacieron sin cablear —una publicada en el paquete sin emisor ni
 * consumidor, y otra con la columna proyectada en la query y tirada en el
 * mapper—. Nada se puso rojo, porque «las formas que la llevan» vivía en la
 * prosa de dos docblocks y en el mensaje de un commit.
 *
 * ── EL CORPUS SALE DEL ÁRBOL, NO DE UNA LISTA ─────────────────────────────
 * El sujeto es **la interfaz que describe un asset que el servidor ENTREGA**, y
 * eso se reconoce por su forma: declara `url` Y `resourceType`. Las dos juntas
 * son lo que distingue la pieza servida por el CDN de un simple portador de url
 * —una portada denormalizada, el avatar de un grupo— y de un pedido de subida.
 * Una forma nueva con esas dos claves entra sola al conteo, que es lo que un
 * `Record` haría si esto fuera una tabla y no un conjunto de interfaces.
 *
 * ── LA OTRA MITAD: QUE EL CAMPO SIGA SIENDO OBLIGATORIO ───────────────────
 * Todo el diseño descansa en que `unavailable` NO sea opcional. Con `?`, el
 * mapper que se olvida de resolverlo compila, la clave desaparece del JSON y
 * quien la lee recibe `undefined` — indistinguible de «está bien»—; y una fila
 * de base cruda vuelve a ser asignable a la forma de respuesta, que es por donde
 * una superficie mandaba la columna interna mientras otra mandaba el booleano.
 * Eso no se puede dejar en un docblock: acá se afirma.
 *
 * ── ALCANCE, DICHO (ORDEN §10) ────────────────────────────────────────────
 *  · **Lee TEXTO parseado con el compilador, no tipos.** Ve la herencia
 *    ESCRITA: una forma que reciba la marca por un alias intermedio
 *    (`type X = Y & MediaAvailability`) no la cuenta. Hoy no hay ninguna, y si
 *    apareciera el síntoma es un ROJO —falla hacia el lado seguro y obliga a
 *    venir acá—, no un verde falso.
 *  · **No mide quién la EMITE ni quién la LEE.** Eso vive un repo a cada lado,
 *    y cada uno tiene su gate: acá no se lee el árbol del api ni el del
 *    cliente, porque el corpus de este paquete es el paquete.
 *  · **No mide que las formas de asset sean éstas y no otras.** Si mañana una
 *    pieza entregada se declara sin `resourceType`, este gate no la ve. El piso
 *    de abajo impide lo contrario —que el reconocedor deje de encontrar
 *    sujetos—, que es la forma en que un gate se apaga solo.
 *
 * Se verificó ROMPIÉNDOLO por los dos lados: sacándole el `extends` a una de las
 * formas y poniéndole el `?` al campo.
 */

const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'src');

const CONTRATO = 'MediaAvailability';

/** El único miembro del contrato de disponibilidad. */
const CAMPO = 'unavailable';

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
 * Las interfaces del paquete, con lo único que este gate necesita saber de cada
 * una: qué hereda ESCRITO y qué propiedades declara de su cuerpo.
 */
const interfaces = () => {
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
        const propiedades = node.members.filter(ts.isPropertySignature).map((member) => ({
          nombre: member.name.getText(source),
          opcional: member.questionToken !== undefined,
        }));
        encontradas.push({
          nombre: node.name.text,
          archivo: rel(file),
          heredadas,
          propiedades,
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return encontradas;
};

const TODAS = interfaces();

const declara = (forma, clave) =>
  forma.propiedades.some((propiedad) => propiedad.nombre === clave);

/** Un asset ENTREGADO: trae la url con la que se pide y el tipo con el que se sirve. */
const ES_ASSET_ENTREGADO = (forma) => declara(forma, 'url') && declara(forma, 'resourceType');

const ASSETS = TODAS.filter(ES_ASSET_ENTREGADO);

test('mide algo: el reconocedor encuentra formas de asset entregado', () => {
  // No es un censo: es una cota inferior para que el día que el parseo se
  // rompa —o que las dos claves se renombren— el gate se caiga en vez de
  // aprobar sobre el conjunto vacío, que es la forma en que un gate se apaga
  // sin que nadie lo note. Cuántas son lo contesta `ASSETS`.
  assert.ok(TODAS.length > 100, 'el recorrido tiene que ver las interfaces del paquete');
  assert.ok(ASSETS.length > 0, 'ninguna forma de asset entregado: el roto es el reconocedor');
});

test('el contrato de disponibilidad existe y su campo es OBLIGATORIO', () => {
  const contrato = TODAS.find((forma) => forma.nombre === CONTRATO);
  assert.ok(contrato, `${CONTRATO} tiene que existir en el paquete`);

  const campo = contrato.propiedades.find((propiedad) => propiedad.nombre === CAMPO);
  assert.ok(campo, `${CONTRATO} tiene que declarar \`${CAMPO}\``);
  assert.equal(
    campo.opcional,
    false,
    `\`${CAMPO}\` NO puede ser opcional: con \`?\` el mapper que se olvida de ` +
      'resolverlo compila, la clave desaparece del JSON y quien la lee recibe ' +
      '`undefined`, que es indistinguible de «está bien». Es el único mecanismo ' +
      'que obliga a los cinco emisores a contestar.',
  );
});

test('toda forma de asset entregado hereda el contrato de disponibilidad', () => {
  const mudas = ASSETS.filter((forma) => !forma.heredadas.includes(CONTRATO)).map(
    (forma) =>
      `${forma.archivo} · ${forma.nombre} describe un asset entregado (declara \`url\` y ` +
      `\`resourceType\`) y no hereda \`${CONTRATO}\`: el cliente no tendría cómo saber que ` +
      'esa pieza ya no está, y dibujaría un reintento que falla para siempre.',
  );

  assert.deepEqual(mudas, []);
});
