import type { AlbumPostingState } from './album-posting-state.interface';

/**
 * Lo que contesta el endpoint que cambia quién puede publicar.
 *
 * ── POR QUÉ DEVUELVE EL ESTADO Y NO UN `{ message }` ──────────────────────
 * Su hermano de visibilidad contesta un mensaje y alcanza, porque el resultado
 * de apagar un booleano es el booleano dado vuelta y el cliente ya lo sabe.
 * Acá no: el horario tiene cuatro formas, una de ellas trae el próximo borde
 * —el instante en que la ventana cambia de estado— y ese dato **sólo lo puede
 * calcular el servidor**, que es el único de los dos lados que puede convertir
 * zonas horarias. Con un mensaje, la hoja tendría que volver a pedir el álbum
 * entero para saber qué quedó guardado: un viaje más por algo que el servidor
 * acaba de resolver.
 *
 * ── POR QUÉ EL SOBRE Y NO EL ESTADO PELADO ────────────────────────────────
 * Porque la clave deja lugar para que la misma respuesta gane un segundo campo
 * sin romperle la forma al cuerpo, que es la misma decisión que su request ya
 * tomó al envolver el horario. Y porque un sobre anónimo escrito a mano en el
 * consumidor es exactamente lo que el auditor de superficies de transporte
 * persigue: el tipo de una respuesta es contrato, no un genérico inline en la
 * llamada de axios.
 */
export interface AlbumPostingResponse<TTimestamp = string> {
  readonly posting: AlbumPostingState<TTimestamp>;
}
