/**
 * Tope de longitud del `clientTempId` que genera el cliente (idempotencia del
 * background upload, retries de chat). Vivía duplicado a mano en el
 * decorador `@IsClientTempId` del api (`is-client-temp-id.decorator.ts`), sin
 * que el cliente tuviera cómo validar con la misma regla ANTES de mandar el
 * request — la única fuente de verdad era el 400 que devolvía el servidor.
 * Publicado acá (ficha #111) para que el decorador importe en vez de
 * redeclarar, y quede una sola constante que mover si el formato cambia.
 */
export const CLIENT_TEMP_ID_MAX_LENGTH = 128;
