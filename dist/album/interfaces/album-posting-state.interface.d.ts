import type { AlbumPostingClosedReason } from '../enums/album-posting-closed-reason.enum';
import type { AlbumPostingSchedule } from './album-posting-schedule.type';
/**
 * Lo que el álbum le cuenta a quien lo está mirando sobre quién puede publicar.
 *
 * ── EL FLAG ES CACHÉ DE CONVENIENCIA, NUNCA AUTORIDAD ─────────────────────
 * Sirve para DIBUJAR: apagar el composer, elegir la frase, armar el timer. No
 * autoriza nada. El servidor vuelve a decidir en cada escritura, y si el reloj
 * del teléfono está desfasado la app dibuja abierto y el servidor rechaza con
 * su motivo — eso es correcto, y es la razón de que el rechazo no expulse de la
 * pantalla.
 *
 * ── POR QUÉ VIAJA EL HORARIO ENTERO Y NO SÓLO EL VEREDICTO ────────────────
 * Por dos lectores que el veredicto solo no alcanza a contestar: la hoja del
 * organizador, que tiene que llegar con el horario vigente cargado, y la frase
 * de la ventana única ya vencida —«se cerró el domingo»—, que necesita el
 * instante de cierre cuando ya no hay próximo borde. Sin el horario, esa
 * pantalla se queda muda, que es el estado que el producto prohíbe.
 *
 * Y no revela nada: todos los miembros ven el mismo estado del álbum, así que
 * decir «abre a las 20:00» no cuenta nada de nadie.
 */
export interface AlbumPostingState<TTimestamp = string> {
    /** El horario vigente, tal cual está guardado. */
    readonly schedule: AlbumPostingSchedule<TTimestamp>;
    /**
     * ¿Puede publicar **quien pide**? Ya tiene el rol adentro: a quien organiza
     * le llega `true` aunque el álbum esté cerrado para los invitados, porque
     * ésa es la razón de ser del interruptor.
     */
    readonly canPost: boolean;
    /**
     * Por qué está cerrado **para los invitados**, o `null` si está abierto.
     *
     * Es el eje del álbum, no el de quien mira, y por eso convive con [canPost]
     * sin duplicarlo: los dos juntos son lo que distingue «está cerrado y no
     * puedo» de «está cerrado pero yo sí», que es el estado en que la app le
     * dibuja a quien organiza el aviso de que apagó la luz.
     */
    readonly closedReason: AlbumPostingClosedReason | null;
    /**
     * Cuándo cambia [closedReason] solo, o `null` si no va a cambiar.
     *
     * Instante ABSOLUTO, ya resuelto por el servidor. La app lo compara contra su
     * reloj para re-habilitar el composer sin refrescar; no convierte zonas.
     */
    readonly nextChangeAt: TTimestamp | null;
}
