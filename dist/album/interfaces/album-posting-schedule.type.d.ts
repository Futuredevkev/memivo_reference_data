import type { AlbumPostingMode } from '../enums/album-posting-mode.enum';
/**
 * El horario de publicación de UN álbum: el modo, más exactamente los campos
 * que ese modo necesita y ninguno más.
 *
 * ── POR QUÉ UNA UNIÓN Y NO UN OBJETO CON TODO NULLABLE ────────────────────
 * Con un objeto plano, `{ mode: EVERYONE, opensAt: null, closesAtMinute: null }`
 * compila, y también compila `{ mode: DAILY, opensAt: <un instante> }`, que es
 * una fila que miente: declara una ventana diaria y trae el dato de la única.
 * La unión hace que esa fila no exista en el tipo, y el `CHECK` de la tabla
 * hace que no exista en la base. Las dos mitades hacen falta: un DTO es una
 * convención, y siempre hay un segundo escritor posible —una migración, un fix
 * a mano en el VPS—.
 *
 * ── POR QUÉ LOS MIEMBROS VAN ACÁ ADENTRO Y NO UN ARCHIVO CADA UNO ─────────
 * Porque ninguno se sostiene solo: nadie nombra «la variante diaria» sin la
 * unión, se llega a ella narrowing por `mode`. Publicarlos sueltos los dejaría
 * sin consumidor, que es lo que `knip` corta en este repo — y con razón. Es la
 * misma forma que [ChatContentRelocationRule], el hermano de este árbol.
 *
 * ── EL PARÁMETRO DE INSTANTE ──────────────────────────────────────────────
 * `TTimestamp` sigue la convención del repo: `string` (ISO) cuando esto viaja
 * por el cable, `Date` cuando el servidor lo tiene en la mano. Sin él, la punta
 * que recibe JSON tendría que mentir sobre el tipo o convertir a mano.
 */
export type AlbumPostingSchedule<TTimestamp = string> = {
    /** Publica cualquier miembro: no hay nada más que declarar. */
    readonly mode: AlbumPostingMode.EVERYONE;
} | {
    /** El interruptor manual, sin horario: tampoco hay nada más. */
    readonly mode: AlbumPostingMode.ORGANIZERS_ONLY;
} | {
    readonly mode: AlbumPostingMode.ONE_SHOT;
    /** Instante absoluto en que abre. El intervalo lo incluye. */
    readonly opensAt: TTimestamp;
    /**
     * Instante absoluto en que cierra. El intervalo NO lo incluye: a las
     * `closesAt` en punto ya no se publica. Se eligió `[opensAt, closesAt)`
     * porque es la única convención que deja pegar dos ventanas sin que un
     * instante pertenezca a las dos.
     */
    readonly closesAt: TTimestamp;
} | {
    readonly mode: AlbumPostingMode.DAILY;
    /** Minuto del día en que abre, en [postingTimezone]. */
    readonly opensAtMinute: number;
    /**
     * Minuto del día en que cierra, en [timezone], excluido igual que en la
     * ventana única.
     *
     * **Puede ser MENOR que el de apertura, y ése es el caso principal**: una
     * ventana de 20:00 a 02:00 cruza la medianoche. Lo que no puede es ser
     * IGUAL: «de 20:00 a 20:00» se lee como cero minutos o como el día
     * entero, y las dos lecturas ya tienen forma exacta —para el día entero
     * está `EVERYONE`—. Lo prohíbe el `CHECK`, no sólo el DTO.
     */
    readonly closesAtMinute: number;
    /**
     * La zona horaria del ÁLBUM, en id IANA.
     *
     * Es del evento, no de quien mira: si alguien invitado viaja, la fiesta
     * no cambia de hora. Usar la zona del usuario sería llavear la decisión
     * por el eje equivocado.
     */
    readonly timezone: string;
};
