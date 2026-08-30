import type { ChatDocumentKind } from './internal/chat-document-kind.interface';
/**
 * EL DUEÑO de qué documentos entran a un chat. Uno solo, y de él salen las dos
 * listas que el resto del sistema usa.
 *
 * ── LA DECISIÓN, Y QUIÉN LA TOMÓ ───────────────────────────────────────────
 * PDF · Word · Excel · PowerPoint · txt · csv · ZIP · RAR. Decisión del dueño
 * del producto, 15 ago 2026. **Los ejecutables quedan afuera**, y no por
 * omisión: un binario que se abre en el teléfono de otra persona es la única
 * clase de adjunto que puede hacer daño por sí sola.
 *
 * ── DEUDA DECLARADA QUE EL DUEÑO ACEPTÓ AL ELEGIR ──────────────────────────
 * Un comprimido ESCONDE su contenido. No se puede moderar ni escanear lo que
 * hay adentro de un `.zip`: para cualquier control que se ponga después es una
 * caja cerrada. Se declara acá, no se esconde.
 *
 * ── POR QUÉ UNA SOLA TABLA Y NO UNA LISTA POR CALL-SITE ────────────────────
 * Tres lugares necesitan esto y cada uno la quiere en una forma distinta: el
 * selector del teléfono filtra por MIME, la clasificación del `ResourceType`
 * compara el MIME declarado, y `allowed_formats` de Cloudinary se firma en
 * EXTENSIONES. Escritas por separado, un formato nuevo entra en dos de las
 * tres y el usuario ve un rechazo del ingress sobre algo que la app le dejó
 * elegir — que es exactamente el defecto que `ALLOWED_IMAGE_MIME_TYPES` ya
 * pagó una vez, con `image/jpg` presente en una copia y ausente en otra.
 *
 * ── LOS ALIAS NO SON RUIDO ─────────────────────────────────────────────────
 * `application/x-zip-compressed` y `application/x-rar-compressed` los emiten
 * los selectores de Android y de Windows para los mismos archivos que otros
 * describen con el MIME registrado. Sin ellos, un `.zip` elegido en Android se
 * clasificaría como imagen y moriría en el ingress de Cloudinary.
 */
export declare const CHAT_DOCUMENT_KINDS: readonly ChatDocumentKind[];
