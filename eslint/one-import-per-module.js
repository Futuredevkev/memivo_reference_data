/**
 * UN MÓDULO SE IMPORTA UNA SOLA VEZ POR ARCHIVO.
 *
 * ── POR QUÉ VIVE ACÁ Y NO EN CADA REPO ────────────────────────────────────
 * Por lo mismo que su hermana de un-símbolo-por-archivo: la convención es de
 * `ORDEN.md`, o sea de los dos repos, y copiar la regla al otro sería el mismo
 * defecto que la regla persigue — dos puertas a lo mismo.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * Dos `import` del mismo módulo en el mismo archivo son dos puertas a una sola
 * fuente. No rompe nada hoy, y ése es el problema: cuando alguien sale a ver
 * «quién usa esto» lee una de las dos y da el archivo por revisado, y cuando
 * hay que mover un símbolo de módulo queda la mitad migrada. Se midió sobre el
 * árbol el 20 de septiembre de 2026: **doce archivos en el cliente y cinco en
 * el api**, y el primero que se arregló era una constante de tiempo importada
 * en dos renglones consecutivos del mismo `constants/time`.
 *
 * ── LO QUE NO CUENTA, Y NO ES INDULGENCIA: ES QUE NO SE PUEDE ────────────
 *  1. **Un `import type` al lado de un `import` de valores.** Son dos clases
 *     distintas de declaración y separarlas es la forma idiomática de este
 *     árbol, no una copia. Se miden por separado: dos `import type` del mismo
 *     módulo SÍ sobran.
 *  2. **Un `import * as N`** al lado de uno con llaves. `import * as N, { a }`
 *     no es sintaxis válida de JavaScript, así que no hay nada que unificar —
 *     exigirlo sería pedir algo que no se puede cumplir, que es exactamente la
 *     trampa que la regla hermana documenta con sus patrones de nombre.
 *  3. **Un `import 'm'` pelado** (sólo efectos). Su lugar en el orden puede ser
 *     deliberado —un polyfill antes que quien lo usa— y unificarlo lo movería.
 *
 * ── SIN AUTOFIX, A PROPÓSITO ──────────────────────────────────────────────
 * Fusionar dos listas de especificadores parece mecánico y no lo es: hay
 * default, alias, `type` inline y comentarios entre renglones. Un fixer que se
 * equivoca en uno de esos casos rompe el build de otra forma. La regla dice
 * DÓNDE está la otra puerta y quien edita decide cómo juntarlas.
 */
const DECLARACION_NAMESPACE = 'ImportNamespaceSpecifier';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prohíbe importar el mismo módulo dos veces en el mismo archivo, por clase de importación.',
    },
    schema: [],
    messages: {
      duplicado:
        "'{{modulo}}' ya se importa en la línea {{linea}} con la misma clase de " +
        'importación. Dos puertas a un módulo dejan medio archivo migrado el día ' +
        'que un símbolo se mude, y el grep de consumidores lee una sola. Juntá ' +
        'los especificadores en esa declaración.',
    },
  },

  create(context) {
    /** `clase` + `módulo` → la PRIMERA declaración que lo trajo. */
    const primeras = new Map();

    return {
      ImportDeclaration(node) {
        // Sin especificadores es un import de efectos: ver el punto 3.
        if (node.specifiers.length === 0) return;
        // Un namespace no se puede fusionar con llaves: ver el punto 2.
        if (
          node.specifiers.some(
            (specifier) => specifier.type === DECLARACION_NAMESPACE,
          )
        ) {
          return;
        }

        const modulo = node.source.value;
        // `importKind` separa `import type` de `import`: ver el punto 1. Un
        // `import { type A, B }` es de VALOR, y está bien que lo sea.
        const clave = `${node.importKind ?? 'value'} ${modulo}`;
        const primera = primeras.get(clave);

        if (primera === undefined) {
          primeras.set(clave, node);
          return;
        }

        context.report({
          node,
          messageId: 'duplicado',
          data: { modulo, linea: String(primera.loc.start.line) },
        });
      },
    };
  },
};
