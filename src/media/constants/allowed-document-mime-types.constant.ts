import { CHAT_DOCUMENT_KINDS } from './chat-document-kinds.constant';

/**
 * Los MIME de documento que el chat acepta. DERIVADO de `CHAT_DOCUMENT_KINDS`.
 *
 * Lo consumen el selector del teléfono —para que la lista que el usuario ve sea
 * la misma que el servidor admite— y la clasificación del `ResourceType` en el
 * alta del intent. Ninguno de los dos escribe su propia lista: si lo hicieran,
 * la app dejaría elegir formatos que el ingress rechaza, o al revés.
 */
export const ALLOWED_DOCUMENT_MIME_TYPES: readonly string[] =
  CHAT_DOCUMENT_KINDS.map((kind) => kind.mimeType);
