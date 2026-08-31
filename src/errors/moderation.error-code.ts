export enum ModerationErrorCode {
  MODERATION_CASE_NOT_FOUND = 'MODERATION_CASE_NOT_FOUND',
  MODERATION_BAN_NOT_FOUND = 'MODERATION_BAN_NOT_FOUND',
  /** La pieza que el expediente manda remover no existe (o ya se removio). */
  MODERATED_CONTENT_NOT_FOUND = 'MODERATED_CONTENT_NOT_FOUND',
  /**
   * La pieza EXISTE, pero este camino no la sabe remover.
   *
   * Nace separado de `MODERATED_CONTENT_NOT_FOUND` porque las dos causas piden
   * cosas distintas del moderador: «no existe» manda a revisar el id, y este
   * manda a elegir OTRA de las tres salidas que los terminos §10.1 le dan a un
   * reclamo valido —avisarle a quien administra el album, removerlo, o
   * suspender la cuenta—. Contestar «no existe» sobre una pieza que esta
   * publicada es mandarlo a buscar un id que estaba bien.
   *
   * Hoy lo produce un solo caso, y esta escrito en el docblock de
   * `ModeratedContentType.PHOTO`: una foto PROFESSIONAL, que en el vocabulario
   * de moderacion nunca fue lo que `PHOTO` nombra.
   */
  MODERATED_CONTENT_TYPE_NOT_REMOVABLE = 'MODERATED_CONTENT_TYPE_NOT_REMOVABLE',
}
