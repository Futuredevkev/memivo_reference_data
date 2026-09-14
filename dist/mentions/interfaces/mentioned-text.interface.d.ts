import type { MentionAnnotation } from './mention-annotation.interface';
/**
 * Un texto con sus menciones, como UN valor: lo que se escribe en un composer y
 * lo que se guarda en un comentario, una respuesta, un comentario de historia o
 * un mensaje de chat.
 *
 * Vive en el contrato porque las dos puntas lo comparan con la misma regla
 * (`isSameMentionedText`): el servidor, para no marcar «editado» lo que no
 * cambió, y la app, para no ofrecer guardar un borrador idéntico. Declarado en
 * cada lado, era la misma forma escrita dos veces.
 *
 * ── POR QUÉ UN VALOR Y NO DOS ─────────────────────────────────────────────
 * El borrador de un composer se escribe desde AFUERA —su dueño lo vacía al
 * enviar, lo carga al entrar a editar y lo devuelve si el envío falla— y desde
 * adentro, tecla por tecla. Con el texto y las menciones en dos estados, cada
 * uno de esos setters tendría que acordarse de mover los dos, y el que se olvide
 * deja menciones apuntando a un texto que ya no es el suyo. Como un solo valor,
 * no hay forma de escribir uno sin el otro.
 */
export interface MentionedText {
    readonly text: string;
    readonly mentions: readonly MentionAnnotation[];
}
