import type { ChatMemberRole } from '../enums';
/**
 * Quién pregunta, y con cuánta autoridad, sobre un mensaje de un chat.
 *
 * ── LOS DOS CAMPOS DE AUTORIDAD SON OPCIONALES Y ESO ES EL LADO SEGURO ─────
 * `role` falta cuando quien mira todavía no tiene fila de miembro cargada, y
 * `groupCreatorId` falta cuando la consulta no trajo el grupo. Ausente NO se
 * lee como «tiene el permiso»: cada escalón de la jerarquía exige su dato
 * PRESENTE para conceder, así que un dato que no llegó sólo puede quitar
 * autoridad, nunca darla. Exigirlos obligaría al que pregunta a inventar un
 * `null` con forma de respuesta, que es peor.
 *
 * ── NO LLEVA EL MENSAJE ADENTRO ────────────────────────────────────────────
 * La autoría se cruza afuera, contra `MutableChatMessage`: meter «es mi
 * mensaje» acá haría que el mismo espectador tuviera que reconstruirse para
 * cada mensaje de la lista, y devolvería la decisión al call-site que arma ese
 * objeto — que es donde vivía repartida antes de que hubiera una puerta.
 */
export interface ChatMessageMutationViewer {
    readonly userId: string;
    /** El rol de quien mira EN ESE chat. */
    readonly role?: ChatMemberRole | null;
    /** Quién creó el chat, para poder reconocer al dueño de la sala. */
    readonly groupCreatorId?: string | null;
}
