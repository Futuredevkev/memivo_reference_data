/**
 * UN SÍMBOLO POR ARCHIVO (ORDEN §2), la regla más citada del estándar.
 *
 * POR QUÉ VIVE ACÁ Y NO EN CADA REPO. `ORDEN.md` gobierna `memivo_api` y
 * `memivo_client`, pero esta regla sólo corría en el API: en el cliente era
 * honor system, y siete olas pasaron por ahí sin nada que las midiera. La
 * salida obvia —copiar la regla al cliente— era exactamente el defecto que la
 * regla existe para impedir: una segunda copia de una forma, y encima de la
 * pieza que existe para que no haya segundas copias.
 *
 * QUÉ CUENTA COMO SÍMBOLO PUBLICADO: toda declaración exportada de primer nivel
 * y todo `export { … }` local. Los re-exports con `from` NO cuentan: un barrel
 * publica lo de otros, no lo suyo.
 *
 * EL INVENTARIO ES POR REPO Y ES EXACTO, no un allowlist ancho. Es el mecanismo
 * de `ERROR_COLOR_RENDER_COUNTS`: archivo → cantidad de hoy. Un archivo que
 * crece rompe el build; uno que se parte OBLIGA a bajar su número, así que la
 * lista sólo puede achicarse y la deuda no puede quedar declarada de más. El
 * API va con inventario vacío, que es lo que ya cumplía.
 *
 * LAS FORMAS SANCIONADAS NO SON DEUDA Y NO VAN AL INVENTARIO. ORDEN §2 sanciona
 * explícitamente la hoja hermana de estilos: la hoja estática más la mitad que
 * NO puede ser estática. Son dos símbolos, y meterlas en el inventario habría
 * hecho dos cosas malas a la vez — dejar entradas que nadie va a «pagar» nunca
 * porque no hay nada que pagar, y obligar a AGREGAR una entrada cada vez que
 * alguien escribe una hoja nueva, en una lista cuyo docblock dice que sólo puede
 * achicarse.
 *
 * UNA FORMA SANCIONADA SE VERIFICA POR ESTRUCTURA, NO POR NOMBRE, y eso es un
 * arreglo de eje (ORDEN §5), no una comodidad. La primera versión declaraba dos
 * PATRONES DE NOMBRE —`^styles$` y `^get<X>ThemeStyles$`— y el nombre no es la
 * propiedad que decide. Cobró las dos mentiras que se le pueden pedir a alguien
 * para que el gate calle:
 *
 *  · Una hoja COMPARTIDA por varios componentes no puede llamar `styles` a su
 *    export: el consumidor importa además el `styles` de su propia hoja y los
 *    dos nombres chocan. Se midió: cuatro hojas, y `tsc` cortó las cuatro. O sea
 *    que el patrón de nombre exigía algo que no se puede cumplir.
 *  · Una fábrica que deriva de GEOMETRÍA o de ESTADO —insets, medidas de la
 *    caja, variante— no puede llamarse `…ThemeStyles` sin mentir: no recibe
 *    `colors`, recibe medidas. Eran veinte hojas inventariadas como deuda por
 *    no poder mentir.
 *
 * La propiedad que decide es QUÉ PUBLICA el archivo: una hoja estática y la
 * fábrica de lo que depende de un valor de runtime. Que ese valor sea el TEMA o
 * sea una MEDIDA es la misma clase — lo que no puede hornearse en un
 * `StyleSheet.create` porque todavía no se conoce.
 *
 * LA CARDINALIDAD NO SE AMPLÍA, y es lo único que impide que «forma sancionada»
 * degenere en «cualquier cosa adentro de un `.styles.ts`»: el censo declarado es
 * COMPLETO. Un tercer export —una constante, un tipo, una paleta, una segunda
 * fábrica— cae de vuelta en la regla y se inventaría. Es lo que mantiene
 * declaradas como deuda a la hoja con ocho fábricas (una de ellas de OTRO
 * componente) y a la que publica cuatro medidas sueltas.
 *
 * ── ALCANCE, dicho y no vendido de más ────────────────────────────────────
 *
 *  · Mira sólo lo que está bajo `/src/`. El árbol de tests, los scripts y la
 *    configuración quedan afuera a propósito: son otro tipo de archivo y su
 *    orden lo gobiernan otras convenciones.
 *  · `index.ts` y `*.d.ts` están exentos por construcción: el primero existe
 *    para publicar varios, y el segundo es declaración.
 *  · La clave del inventario se arma desde la PRIMERA aparición de `/src/` en
 *    la ruta. Un repo con un `src` anidado adentro de otro `src` mediría el de
 *    afuera; hoy no existe en ninguno de los dos.
 *  · NO mira si los símbolos «van juntos». Un archivo con dos constantes
 *    hermanas y uno con dos conceptos sin relación le dan igual: lo que
 *    persigue es el archivo bolsa, y quién es hermano de quién es prosa.
 *  · NO reemplaza al gate de sufijos de `src/types/` del cliente: éste cuenta
 *    símbolos, aquél mira el nombre del archivo. Son ejes distintos.
 *  · Del censo de una forma sancionada verifica la ESTRUCTURA, no el
 *    SIGNIFICADO: sabe que el archivo publica una función, no que esa función
 *    devuelva estilo. Una hoja con `styles` y un helper de datos adentro pasaría
 *    sancionada. Eso es un símbolo en la carpeta equivocada —otro eje, y lo
 *    gobiernan `style-file-naming` y `component-styles-in-style-files`— y no se
 *    vende como cubierto acá. Verificarlo pediría TIPOS, y esta regla no tipa.
 *  · Los buckets se comparan por TEXTO del callee: `StyleSheet.create` casa por
 *    cómo está escrito, no por el símbolo que resuelve. Un alias
 *    (`const SS = StyleSheet`) se escapa; hoy no existe en ninguno de los dos
 *    repos, y si apareciera el archivo cae del lado seguro —desanciona y se
 *    reporta—, nunca del laxo.
 */
const RULE = {
  meta: {
    type: 'problem',
    schema: [
      {
        type: 'object',
        properties: {
          inventory: {
            type: 'object',
            additionalProperties: { type: 'integer', minimum: 2 },
          },
          sanctionedShapes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                file: { type: 'string' },
                /**
                 * EL CENSO COMPLETO de lo que el archivo puede publicar, por
                 * BUCKET → cantidad exacta. Un bucket es el texto de la llamada
                 * que inicializa el binding (`StyleSheet.create`) o la palabra
                 * `function` para toda función exportada —arrow, expresión o
                 * declaración—. Completo quiere decir que un export que no cae
                 * en ningún bucket declarado desanciona el archivo entero: no
                 * hay «y además».
                 */
                publishes: {
                  type: 'object',
                  additionalProperties: { type: 'integer', minimum: 1 },
                  minProperties: 1,
                },
                reason: { type: 'string' },
              },
              required: ['file', 'publishes', 'reason'],
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      split:
        'Este archivo publica {{count}} símbolos. ORDEN §2: un símbolo por archivo, '
        + 'con su sufijo y en la carpeta de su eje. Separalos y re-exportá desde un '
        + '`index.ts` si la carpeta tiene barrel, o agregá `{{key}}: {{count}}` al '
        + 'inventario a conciencia.',
      grew:
        'Este archivo publica {{count}} símbolos y el inventario declara {{declared}}. '
        + 'Creció: se parte, no se sube el número.',
      shrank:
        'Este archivo publica {{count}} símbolos y el inventario declara {{declared}}. '
        + 'Bajá el número a {{count}} (o borrá la entrada si llegó a 1): el inventario '
        + 'es la foto de hoy y sólo puede achicarse.',
      sanctionedAndInventoried:
        'Este archivo publica una forma SANCIONADA ({{reason}}) y además tiene entrada '
        + 'en el inventario. Borrá la entrada: mientras esté, declara una deuda que no '
        + 'existe y nadie va a poder pagar.',
    },
  },
  create(context) {
    const filename = (context.filename ?? context.getFilename?.() ?? '').replaceAll(
      '\\',
      '/',
    );
    const lower = filename.toLowerCase();
    const marker = lower.indexOf('/src/');
    if (marker === -1 || lower.endsWith('/index.ts') || lower.endsWith('.d.ts')) {
      return {};
    }

    const key = filename.slice(marker + 1);
    const inventory = context.options[0]?.inventory ?? {};
    const sanctionedShapes = context.options[0]?.sanctionedShapes ?? [];

    /**
     * El bucket de toda función exportada, sea arrow, expresión o declaración.
     * Es una palabra reservada del censo y no un nombre de llamada: una fábrica
     * no se INICIALIZA llamando a nada, se escribe.
     */
    const FUNCTION_BUCKET = 'function';

    /**
     * La forma sancionada que el archivo publica, o `null`.
     *
     * Se exige que el censo declarado sea EXACTO en los dos sentidos: cada
     * bucket con su cantidad justa, y CERO exports fuera de los buckets. Un
     * símbolo de más —de cualquier clase— desanciona el archivo y lo devuelve a
     * la regla, que es lo que impide que la excepción se coma la norma.
     */
    const matchesSanctionedShape = (census) => {
      for (const shape of sanctionedShapes) {
        if (!new RegExp(shape.file).test(key)) continue;
        const declared = Object.entries(shape.publishes);
        const fits =
          census.unbucketed === 0 &&
          declared.length === census.buckets.size &&
          declared.every(([bucket, count]) => census.buckets.get(bucket) === count);
        if (fits) return shape;
      }
      return null;
    };
    const declared = Object.prototype.hasOwnProperty.call(inventory, key)
      ? inventory[key]
      : null;

    const symbols = new Set();
    /** Bucket → cuántos publica el archivo. Ver `publishes` en el esquema. */
    const buckets = new Map();
    /** Exports que no caen en ningún bucket: tipos, valores sueltos, `export {}`. */
    let unbucketed = 0;

    /**
     * El nombre punteado de un callee (`StyleSheet.create`), o `null` si no es
     * una cadena de identificadores. Se compara por TEXTO y no por símbolo
     * resuelto: la regla no tipa, y está dicho en el alcance de arriba.
     */
    const dottedCallee = (node) => {
      if (node.type === 'Identifier') return node.name;
      if (node.type === 'MemberExpression' && !node.computed && node.property.type === 'Identifier') {
        const object = dottedCallee(node.object);
        return object === null ? null : `${object}.${node.property.name}`;
      }
      return null;
    };

    const bucketOf = (initializer) => {
      if (!initializer) return null;
      if (
        initializer.type === 'ArrowFunctionExpression'
        || initializer.type === 'FunctionExpression'
      ) {
        return FUNCTION_BUCKET;
      }
      if (initializer.type === 'CallExpression') return dottedCallee(initializer.callee);
      return null;
    };

    const record = (name, bucket) => {
      symbols.add(name);
      if (bucket === null) unbucketed += 1;
      else buckets.set(bucket, (buckets.get(bucket) ?? 0) + 1);
    };

    const addDeclarationNames = (declaration) => {
      if (declaration.type === 'VariableDeclaration') {
        for (const item of declaration.declarations) {
          if (item.id.type === 'Identifier') record(item.id.name, bucketOf(item.init));
        }
        return;
      }
      if (declaration.id?.name) {
        record(
          declaration.id.name,
          declaration.type === 'FunctionDeclaration' ? FUNCTION_BUCKET : null,
        );
      }
    };

    return {
      ExportNamedDeclaration(node) {
        if (node.declaration) {
          addDeclarationNames(node.declaration);
        } else if (!node.source) {
          for (const specifier of node.specifiers) {
            record(specifier.exported.name, null);
          }
        }
      },
      ExportDefaultDeclaration(node) {
        record(node.declaration.id?.name ?? 'default', null);
      },
      'Program:exit'(node) {
        const count = symbols.size;
        const sanctioned = count > 1 ? matchesSanctionedShape({ buckets, unbucketed }) : null;
        if (sanctioned) {
          // LA ALLOWLIST SE AUDITA SOLA (ORDEN §10): una entrada de inventario
          // sobre un archivo ya sancionado es deuda declarada que no existe, y
          // como la regla corta antes de mirar el inventario, se quedaría ahí
          // para siempre sin que nada la nombre.
          if (declared !== null) {
            context.report({
              node,
              messageId: 'sanctionedAndInventoried',
              data: { reason: sanctioned.reason },
            });
          }
          return;
        }
        if (declared === null) {
          if (count > 1) {
            context.report({ node, messageId: 'split', data: { count: String(count), key } });
          }
          return;
        }
        if (count > declared) {
          context.report({
            node,
            messageId: 'grew',
            data: { count: String(count), declared: String(declared) },
          });
          return;
        }
        if (count < declared) {
          context.report({
            node,
            messageId: 'shrank',
            data: { count: String(count), declared: String(declared) },
          });
        }
      },
    };
  },
};

module.exports = RULE;
