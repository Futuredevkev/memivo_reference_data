import type { ChatMediaMessageType } from '../types';
/**
 * Los tipos de mensaje cuyos archivos entran a la GALERÍA de multimedia del
 * chat. DERIVADO del catálogo total, no escrito a mano.
 *
 * Era un array literal con los tres de siempre, y de él colgaba el `WHERE` de
 * `IDX_chat_messages_group_media`: un tipo nuevo con archivos quedaba afuera
 * del índice sin que nada fallara —una consulta que deja de usar índice no se
 * pone roja, se pone lenta—. Derivándolo, el día que alguien agrega un
 * `ChatMessageType` tiene que contestar si entra o no, porque el `Record` no
 * compila sin su entrada (ORDEN §6).
 *
 * ⚠️ **Acá decía que era un subconjunto ESTRICTO de
 * `CHAT_FILE_BEARING_MESSAGE_TYPES` porque `DOCUMENT` llevaba archivos y no
 * estaba en la galería. Dejó de ser verdad el 21 de agosto de 2026**, cuando el
 * documento entró: hoy las dos listas tienen los mismos cuatro miembros. Lo que
 * se sostiene es la relación —toda entrada de la galería lleva archivos, y hay
 * un gate que lo afirma— y lo que se perdió es la ESTRICTEZ, que era una
 * observación sobre el árbol de ese día y no una regla. Nada acá supone
 * desigualdad, y por eso el cambio fue un booleano.
 *
 * El predicado del `filter` y el tipo `ChatMediaMessageType` leen el MISMO
 * campo de la MISMA tabla; por eso la firma del guard es una afirmación
 * verificable de un vistazo y no una promesa.
 */
export declare const CHAT_MEDIA_MESSAGE_TYPES: readonly ChatMediaMessageType[];
