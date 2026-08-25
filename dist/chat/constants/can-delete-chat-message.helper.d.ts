import type { ChatMessageMutationViewer, MutableChatMessage } from '../interfaces';
import type { ChatMutationVerdict } from '../types';
/**
 * LA PUERTA del borrado. Contesta si esta persona puede sacar este mensaje de
 * su chat.
 *
 * Vive al lado de la puerta de edición y por el mismo motivo: las dos puntas
 * cruzan esta función —`validateDeletePermissions` en el api y
 * `useChatMessageActions` en el cliente—, por lo que la jerarquía no queda
 * repetida a mano ni puede divergir en silencio.
 *
 * ── EL TIPO SE MIRA ANTES QUE LA AUTORIDAD ────────────────────────────────
 * Y no es cosmético: hay mensajes que no borra NADIE, ni el creador del grupo.
 * Poner la autoridad primero haría que el escalón de tipo quedara escondido
 * detrás de un permiso, o sea que el más poderoso de la sala sería el único que
 * podría toparse con él.
 *
 * ── LA JERARQUÍA, DE ARRIBA HACIA ABAJO ───────────────────────────────────
 * El autor siempre borra lo suyo; el creador del grupo borra cualquier cosa; un
 * admin borra lo de los demás pero NO lo del creador. Ese último escalón es la
 * razón de que la jerarquía no se pueda expresar con un booleano «puede
 * moderar»: depende de quién escribió el mensaje, no sólo de quién mira.
 *
 * `scripts/audit-consumers.js` garantiza que ambos consumidores sigan usando
 * esta puerta y no reintroduzcan una política paralela.
 */
export declare const canDeleteChatMessage: (message: MutableChatMessage, viewer: ChatMessageMutationViewer) => ChatMutationVerdict;
