/**
 * El único parámetro de las tres listas de personas de un álbum.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * Los tres endpoints no aceptaban nada: bajaban la lista entera y el chip la
 * estrechaba EN MEMORIA con el texto del buscador del host. Es el movimiento
 * que `ORDEN.md` §8 nombra y prohíbe —el front haciendo el trabajo que el back
 * tiene que hacer para escalar— y además dejaba al Baúl, que no monta
 * buscador, sin ninguna forma de acortar el gesto.
 *
 * El término viaja acá y se resuelve contra `users` con los índices trigram
 * que ya sirven a la búsqueda de participantes.
 */
export interface AlbumPeopleQueryRequest {
  /** Nombre o apellido, infijo y sin distinguir mayúsculas. */
  search?: string;
}
