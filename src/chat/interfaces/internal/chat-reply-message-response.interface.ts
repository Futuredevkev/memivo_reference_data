import type { ChatMessageType } from '../../enums';
import type { ChatMessageFileResponse } from './chat-message-file-response.interface';
import type { ChatUserSummary } from '../chat-user-summary.interface';

export interface ChatReplyMessageResponse {
  id: string;
  content: string | null;
  type: ChatMessageType;
  /**
   * Nullable porque el autor del mensaje CITADO puede no estar, y el contrato
   * tiene que saber decirlo.
   *
   * Declarado `ChatUserSummary` a secas no podía expresar «el remitente ya no
   * está», así que el productor tapaba el hueco fabricando una persona: cuando
   * la relación venía vacía emitía `{ id, name: '', lastName: '' }`. Al cliente
   * le viajaba **un usuario con el nombre en blanco** —la ausencia dibujada
   * como un dato válido y degradado— que es exactamente lo que el vocabulario
   * de «esto ya no está» existe para impedir. El campo espejo del mensaje
   * propio (`ChatMessageResponse.sender`) ya era nullable; el de la cita quedó
   * atrás.
   *
   * Las dos ausencias son reales y llegan por caminos distintos: al bloqueado o
   * baneado se le filtra la identidad en el `ON` del join, y el mensaje de
   * sistema no tiene autor —su `senderId` es NULL a propósito, la atribución
   * vive en `systemData`—. Las dos salen por acá como `null` y **con la misma
   * cara a propósito**: una ausencia que nombre su causa delata el bloqueo.
   */
  sender: ChatUserSummary | null;
  files?: ChatMessageFileResponse[];
  viewOnce?: boolean;
}
