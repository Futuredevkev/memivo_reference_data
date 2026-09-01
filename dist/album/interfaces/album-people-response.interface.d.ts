import type { AlbumPerson } from './album-person.interface';
/**
 * La respuesta de las tres listas de personas de un álbum, con su corte
 * CONFESADO.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * Las tres devolvían un array pelado y el servidor corta la hidratación de
 * identidad en un techo. Deslizando, una lista cortada se ve igual que una
 * lista larga y nadie afirma nada; con caja de texto, buscar a alguien que
 * está en el álbum pero quedó del otro lado del techo devuelve la fila VACÍA,
 * y una fila vacía después de escribir un nombre se lee como que esa persona
 * no está. El silencio pasa a ser una respuesta, y es falsa.
 *
 * Con `truncated` la superficie puede ofrecer otra salida en vez de afirmar
 * una ausencia. Es la misma forma que ya usa
 * {@link InvitedChatMembersResponse}, y por el mismo motivo.
 */
export interface AlbumPeopleResponse {
    data: AlbumPerson[];
    /**
     * `true` cuando había más personas que el techo del servidor y la lista
     * viene cortada. Con un término de búsqueda activo responde por el resultado
     * de ESE término, no por el álbum entero.
     */
    truncated: boolean;
}
