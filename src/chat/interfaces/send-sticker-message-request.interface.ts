/**
 * El cuerpo wire del alta de un sticker en el chat.
 *
 * Tiene endpoint propio porque un sticker no admite `content`: ofrecer ese
 * campo dejaría al contrato prometer una forma que el `CHECK` de la tabla
 * rechaza. Sólo viaja la identidad externa; el servidor deriva las URLs en vez
 * de aceptar una que después cargaría toda la conversación.
 */
export interface SendStickerMessageRequest {
  stickerExternalId: string;
  replyToMessageId?: string;
  clientTempId?: string;
}
