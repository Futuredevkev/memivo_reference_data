/**
 * `name` REQUERIDO: es el único campo editable de una carpeta, así que un body
 * sin él es un PATCH que no puede cambiar nada.
 *
 * Mientras fue opcional, el DTO del servidor lo copiaba —`implements` obliga a
 * que las dos puntas digan lo mismo— y `PATCH /folders/:id` con `{}` pasaba el
 * `ValidationPipe`, no entraba a ningún `if`, no escribía audit-log, igual
 * emitía `FOLDER_UPDATED` y respondía 200 `Folder updated successfully`. Quien
 * creyera haber renombrado veía el nombre nuevo hasta el próximo refetch. Es el
 * mismo defecto que `TextRequest` ya tenía cerrado para la edición de
 * comentarios.
 */
export interface UpdateFolderRequest {
  name: string;
}
