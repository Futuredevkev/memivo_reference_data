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
    const declared = Object.prototype.hasOwnProperty.call(inventory, key)
      ? inventory[key]
      : null;

    const symbols = new Set();
    const addDeclarationNames = (declaration) => {
      if (declaration.type === 'VariableDeclaration') {
        for (const item of declaration.declarations) {
          if (item.id.type === 'Identifier') symbols.add(item.id.name);
        }
        return;
      }
      if (declaration.id?.name) symbols.add(declaration.id.name);
    };

    return {
      ExportNamedDeclaration(node) {
        if (node.declaration) {
          addDeclarationNames(node.declaration);
        } else if (!node.source) {
          for (const specifier of node.specifiers) {
            symbols.add(specifier.exported.name);
          }
        }
      },
      ExportDefaultDeclaration(node) {
        symbols.add(node.declaration.id?.name ?? 'default');
      },
      'Program:exit'(node) {
        const count = symbols.size;
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
