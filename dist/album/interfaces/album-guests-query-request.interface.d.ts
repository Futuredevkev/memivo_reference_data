/**
 * Lo que estrecha la lista de participantes de un álbum, además de la
 * paginación.
 *
 * ── POR QUÉ `managersOnly` ES UN BOOLEANO Y NO UN ROL ───────────────────
 * Porque el eje que la superficie que lo pide necesita es «quién ADMINISTRA
 * este álbum», y eso no es un rol sino DOS: el dueño y los organizadores. Un
 * parámetro `role` obligaría a pedir la lista dos veces y a unirlas en el
 * cliente, que es el filtro en memoria que el proyecto prohíbe — y encima
 * dejaría al llamador reconstruyendo una regla de permisos que el servidor ya
 * tiene escrita en un solo lugar.
 *
 * ── QUIÉN LO USA, Y POR QUÉ NO SE ENUMERA ──────────────────────────────
 * Lo pide toda superficie que necesite elegir a alguien que administre el
 * álbum. La primera es la marca, que sólo puede acreditar a quien lo hace; el
 * grep contesta el resto.
 */
export interface AlbumGuestsQueryRequest {
    /** Nombre o apellido, infijo y sin distinguir mayúsculas. */
    search?: string;
    /**
     * Sólo quienes ADMINISTRAN el álbum: su dueño y sus organizadores.
     *
     * Viaja como texto en la query string, así que el DTO del api lo transforma;
     * acá se declara la forma que el cliente quiere decir.
     */
    managersOnly?: boolean;
}
