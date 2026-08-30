import type { ChatMutationRefusal } from '../enums';

/**
 * La respuesta de las puertas de edición y de borrado.
 *
 * ── EL «SÍ» NO TRAE NADA ADENTRO, Y SU HERMANO SÍ ──────────────────────────
 * `ChatRelocationVerdict` devuelve la CARGA con el permiso porque quien
 * autoriza la mudanza es el mismo que después la ejecuta y necesita saber qué
 * copiar. Acá no hay nada equivalente: el endpoint de edición reescribe
 * `content` y el de borrado borra la fila, así que un campo con lo que se
 * puede editar sería superficie muerta con forma de dato — el mismo criterio
 * que aquel verdicto usó para NO traer motivo en su «no».
 *
 * ── EL «NO» SÍ TRAE MOTIVO, Y POR EL MISMO CRITERIO ────────────────────────
 * Porque acá el motivo TIENE lector: las negativas salen del servidor por
 * códigos HTTP distintos según cuál escalón cortó. Sin el discriminante, el
 * borde tendría que volver a decidir por qué la puerta rechazó y habría dos
 * dueños de la misma regla.
 *
 * Es una UNIÓN DISCRIMINADA y no un objeto con dos opcionales: así el
 * compilador impide leer el motivo de un permiso concedido, y impide conceder
 * sin haber contestado.
 */
export type ChatMutationVerdict =
  | { readonly allowed: true }
  | { readonly allowed: false; readonly refusal: ChatMutationRefusal };
