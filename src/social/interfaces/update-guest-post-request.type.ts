/**
 * Ya NO es un alias de `CreateGuestPostRequest` (bloque 36, H-074): crear exige
 * una descripción y editar tiene que poder VACIARLA.
 *
 * `null` la vacía; un string la reemplaza. El DTO del servidor rechazaba `''`
 * con un 400 —`@IsNotEmpty`—, y ese 400 además abortaba los cambios de tags del
 * mismo guardado, porque el `await` de la descripción era la primera línea del
 * try.
 */
export interface UpdateGuestPostRequest {
  description: string | null;
}
