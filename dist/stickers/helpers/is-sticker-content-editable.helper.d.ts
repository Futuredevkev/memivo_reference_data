import type { StickerReference } from '../interfaces';
/**
 * LA PUERTA de la edición en las superficies de TEXTO-O-STICKER: el comentario
 * de un post, la respuesta a ese comentario y el comentario de una historia.
 *
 * Vive del lado del contrato y no del api por el mismo motivo que su hermana
 * `canEditChatMessage`: la llaman las DOS puntas —el servidor como gate del
 * endpoint, la app para decidir si dibuja el botón «Editar»— y así no pueden
 * contestar distinto.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * Editar significa REESCRIBIR EL TEXTO, y una fila de sticker no tiene texto:
 * su columna es nula porque el sticker ocupa ese lugar. Sin esta puerta, el
 * endpoint de edición aceptaba un texto sobre una fila de sticker y la escritura
 * moría contra el `CHECK` de la tabla —el que exige exactamente uno de los dos—
 * o sea un 500 de Postgres en vez de un rechazo con nombre. Y del lado de la
 * app el botón se dibujaba igual, así que el único final posible de tocarlo era
 * un toast rojo.
 *
 * ── POR QUÉ NO ES UNA TABLA POR TIPO ──────────────────────────────────────
 * Porque acá no hay tipos: hay un binario que la columna garantiza. La hermana
 * del chat sí necesita `Record` porque su eje es un enum de siete miembros y
 * cada uno decide distinto. Modelar esto como una tabla sería inventarle un eje
 * a una decisión que no lo tiene.
 *
 * ── POR QUÉ RECIBE EL CUERPO Y NO UN OBJETO CON FORMA FIJA ───────────────
 * Porque las dos puntas guardan ese hecho con formas distintas y ninguna firma
 * única las abarcaba: la fila lleva la columna `stickerId`, que es una cadena,
 * y a la app le llega la referencia resuelta. Con un parámetro de objeto, la
 * firma cómoda para una dejaba a la otra construyendo un objeto de mentira para
 * poder preguntar; y con un booleano, la decisión volvía al call-site, que es
 * lo que esto existe para impedir.
 *
 * Lo que se pregunta es si **hay cuerpo de sticker**, y el tipo dice las dos
 * caras que ese cuerpo tiene. `undefined` cuenta como que lo hay: la ausencia
 * llega cuando una proyección no trajo la columna o cuando un campo no viajó, y
 * ahí lo seguro es rechazar. Negar una edición legítima se ve y se reporta;
 * permitir una que el `CHECK` va a rechazar es un 500.
 *
 * ── LO QUE NO DECIDE, dicho y no vendido de más ───────────────────────────
 * No decide la AUTORÍA. Que el contenido sea editable y que quien lo pide sea
 * su autor son dos escalones distintos, y el segundo ya tiene dueño en cada
 * superficie. Juntarlos acá obligaría a esta función a conocer sesiones, que es
 * justamente lo que la vuelve inútil como predicado de dibujo.
 *
 * ── BORRAR SÍ SE PUEDE ─────────────────────────────────────────────────────
 * Y no se pregunta acá. Sacar la fila entera no toca el `CHECK` ni pide texto,
 * así que un sticker se borra como cualquier comentario. Es la misma asimetría
 * que ya declara la tabla de mutación del chat, donde el sticker es
 * `edits: NONE` y `deletable: true`.
 */
export declare const isStickerContentEditable: (stickerBody: StickerReference | string | null | undefined) => boolean;
