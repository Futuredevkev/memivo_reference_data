import type { AlbumPostingResolution } from '../interfaces/album-posting-resolution.interface';
import type { AlbumPostingSchedule } from '../interfaces/album-posting-schedule.type';
/**
 * ¿El álbum admite publicaciones de sus invitados en este instante, y cuándo
 * cambia eso?
 *
 * ── ES EL ÚNICO LUGAR DEL MONOREPO QUE COMPARA ESTAS COLUMNAS CON UN RELOJ ─
 * Lo sostiene un gate del api, no la buena voluntad. Cualquier segundo lugar
 * que mire el horario contra un reloj es, por construcción, una ventana que
 * puede discrepar con ésta — y la forma en que se nota es la peor: el servidor
 * rechaza una publicación que la app dibujó habilitada.
 *
 * ── LA VENTANA SE EVALÚA, NO SE MATERIALIZA ───────────────────────────────
 * Nada escribe «ahora está abierto» a las 20:00. Se descartó un cron que
 * volcara el estado a una columna por dos razones, y la segunda es la que
 * manda: sería una segunda copia del estado, y si ese cron no corre —deploy,
 * reinicio, lock tomado— el álbum queda cerrado sin que nadie pueda explicar
 * por qué. Evaluándola, a las 20:00 se publica aunque el servidor se haya
 * reiniciado a las 19:59.
 *
 * ── QUIÉN LA LLAMA: EL SERVIDOR ───────────────────────────────────────────
 * El modo diario necesita convertir zonas horarias, y eso pide un ICU completo
 * que Hermes no tiene —este árbol ya paga polyfills de `@formatjs` justamente
 * por eso—. Así que la evaluación es del servidor SIEMPRE, y lo que viaja al
 * cliente es el veredicto ya resuelto más el próximo borde en instante
 * absoluto. La app compara instantes y formatea minutos; nunca convierte.
 *
 * Vive igual en el contrato, como su hermana
 * [resolveAlbumAccessPasswordChangeKind], porque los nombres que devuelve son
 * los que la app usa para elegir la frase: con la regla de un solo lado, una
 * punta puede renombrar un desenlace y la otra seguir compilando.
 *
 * ── QUÉ NO AFIRMA ─────────────────────────────────────────────────────────
 * No sabe nada de ROLES. Contesta por los invitados; que quien organiza publica
 * siempre es una decisión de otra capa, y mezclarla acá obligaría a pasarle un
 * usuario a una función que es del álbum.
 *
 * ── EL DST SE DECLARA, NO SE «ARREGLA» ────────────────────────────────────
 * El día que la zona del álbum cambia de hora, una ventana diaria dura 23 o 25
 * horas. Es lo correcto: la gente mira el reloj de la pared, y «de 20:00 a
 * 02:00» significa lo que dice el reloj de la pared. Y si un borde cae dentro
 * del hueco que deja el adelanto —ese día no existen las 02:30—, se corre hacia
 * adelante lo que dura el salto, que es la misma desambiguación que eligió
 * `Temporal` para el caso: la alternativa lo correría a un reloj de pared
 * ANTERIOR al pedido, y una ventana que abre antes de la hora que dice es peor
 * que una que abre después.
 */
export declare const resolveAlbumPosting: (schedule: AlbumPostingSchedule<Date>, now: Date) => AlbumPostingResolution;
