import type { AlbumPostingClosedReason } from '../enums/album-posting-closed-reason.enum';
/**
 * Lo que contesta [resolveAlbumPosting]: si el álbum admite publicaciones de
 * los invitados en el instante que se le pasó, y cuándo cambia eso.
 *
 * ── POR QUÉ EL PRÓXIMO BORDE VIENE ACÁ Y NO DE UNA SEGUNDA FUNCIÓN ────────
 * Porque es el MISMO cálculo. Quien sabe si la ventana está abierta ya tuvo que
 * ubicar los bordes para saberlo; pedirlo aparte obliga a recorrer la ventana
 * dos veces y deja dos lugares que pueden discrepar sobre dónde está el borde.
 * Ese es el defecto que abre todas las ventanas mal cerradas.
 */
export interface AlbumPostingResolution {
    /**
     * Por qué está cerrado para los invitados, o `null` si está abierto.
     *
     * `null` ES la respuesta afirmativa: no hay un booleano al lado porque sería
     * la segunda copia del mismo hecho.
     */
    readonly closedReason: AlbumPostingClosedReason | null;
    /**
     * El próximo instante en que [closedReason] cambia, o `null` si no se sabe
     * de ninguno.
     *
     * Es una promesa fuerte y se cumple: **estrictamente posterior** al instante
     * consultado, y el estado en él ES el otro. No es «la próxima vez que el
     * reloj marque la hora del borde» — un borde que cae en el hueco que deja el
     * adelanto de hora no cambia nada, y prometerlo haría que la app habilite el
     * composer sola contra un servidor que rechaza.
     *
     * Siempre absoluto: el cliente lo compara contra su reloj sin convertir
     * zonas.
     *
     * `null` en los dos modos sin horario y en la ventana única ya vencida,
     * donde de verdad no hay próximo cambio. Y también cuando la regla no lo
     * pudo ubicar —degradación declarada, no un estado alcanzable con una
     * ventana válida—: ahí lo que se pierde es el temporizador, no el veredicto.
     */
    readonly nextChangeAt: Date | null;
}
