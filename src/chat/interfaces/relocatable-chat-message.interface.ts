import type { ChatMessageType } from '../enums';

/**
 * Lo MÍNIMO que hay que saber de un mensaje para contestar si puede mudarse a
 * otro chat.
 *
 * No es un `Pick<ChatMessageResponse, …>` a propósito: el api pregunta con una
 * fila de la base y el cliente con el mensaje ya normalizado, y las dos formas
 * satisfacen esto sin que ninguna tenga que convertirse a la otra. Que el
 * mínimo esté escrito es lo que impide que la puerta empiece a leer campos que
 * uno de los dos lados no tiene.
 *
 * **Crece con `ChatContentBinding`, no por gusto**: cada estado que ata un
 * mensaje a su chat necesita un predicado en `CHAT_CONTENT_BINDING_HOLDS`, y
 * ese predicado necesita su campo acá. Al revés no: un campo sin predicado que
 * lo lea no tiene por qué estar.
 */
export interface RelocatableChatMessage {
  readonly type: ChatMessageType;
  /**
   * La bandera de `ChatContentBinding.VIEW_ONCE`.
   *
   * OPCIONAL porque hay formas de mensaje que legítimamente no la traen: el eco
   * de un mensaje de SISTEMA no proyecta la columna, porque un aviso de sistema
   * no puede verse una sola vez. Exigirla obligaría a esas formas a inventar un
   * `false`, que es peor: un dato fabricado se lee como medido.
   *
   * Y no abre un agujero, porque los tipos cuya forma la omite son los que la
   * regla YA rechaza por origen —la puerta contesta que no antes de mirar
   * ningún estado—. Si igual llegara ausente sobre un tipo que sí se muda, el
   * servidor la lee de la columna y rechaza: la app se equivocaría ofreciendo
   * un botón que da 403, nunca mudando algo que no debía.
   */
  readonly viewOnce?: boolean;
  /**
   * La marca de `ChatContentBinding.LIVE`: hasta cuándo transmite —o transmitía—
   * un compartir de ubicación en vivo. Ausente o `null` = punto fijo.
   *
   * ── POR QUÉ EL TIPO ES UNA UNIÓN Y NO UN `Date` NI UN `string` ────────────
   * Porque las dos puntas preguntan con lo que ya tienen y ninguna convierte
   * nada para preguntar: el api pasa la fila de Postgres, donde la columna es
   * un `Date`, y el cliente pasa el mensaje normalizado, donde el mismo campo
   * llegó por JSON y es un `string`. Es exactamente el motivo por el que esta
   * interfaz no es un `Pick` de la respuesta.
   *
   * ── LA PUERTA SÓLO MIRA SI ESTÁ, NUNCA CUÁNTO FALTA ──────────────────────
   * Y por eso el tipo del valor da igual. Comparar contra un reloj acá haría
   * que la misma fila se clasificara distinto según quién pregunte y cuándo —el
   * defecto de eje de ORDEN §5—. El vencimiento se hace cumplir en la EMISIÓN,
   * del lado del servidor, que es el único lugar donde puede significar algo.
   */
  readonly liveLocationExpiresAt?: Date | string | null;
}
