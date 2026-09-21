import { AlbumPostingClosedReason } from '../enums/album-posting-closed-reason.enum';
import { AlbumPostingMode } from '../enums/album-posting-mode.enum';
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
export const resolveAlbumPosting = (
  schedule: AlbumPostingSchedule<Date>,
  now: Date,
): AlbumPostingResolution => {
  switch (schedule.mode) {
    case AlbumPostingMode.EVERYONE:
      return { closedReason: null, nextChangeAt: null, openedAt: null };

    case AlbumPostingMode.ORGANIZERS_ONLY:
      return {
        closedReason: AlbumPostingClosedReason.ORGANIZERS_ONLY,
        nextChangeAt: null,
        openedAt: null,
      };

    case AlbumPostingMode.ONE_SHOT: {
      const at = now.getTime();
      if (at < schedule.opensAt.getTime()) {
        return {
          closedReason: AlbumPostingClosedReason.NOT_OPEN_YET,
          nextChangeAt: schedule.opensAt,
          openedAt: null,
        };
      }
      // El intervalo es `[opensAt, closesAt)`: a las `closesAt` en punto ya
      // está cerrado. El porqué de esa convención está en el docblock de la
      // unión, que es donde vive la forma.
      if (at < schedule.closesAt.getTime()) {
        return {
          closedReason: null,
          nextChangeAt: schedule.closesAt,
          openedAt: schedule.opensAt,
        };
      }
      return {
        closedReason: AlbumPostingClosedReason.ALREADY_CLOSED,
        nextChangeAt: null,
        openedAt: null,
      };
    }

    case AlbumPostingMode.DAILY: {
      const { timezone } = schedule;
      const today = wallClockIn(timezone, now);
      const isOpen = isWithinDailyWindow(
        today.hour * 60 + today.minute,
        schedule,
      );

      return {
        closedReason: isOpen ? null : AlbumPostingClosedReason.NOT_OPEN_YET,
        nextChangeAt: nextDailyStateChange(schedule, now, today, isOpen),
        // La apertura que dio comienzo a la ventana vigente: la última vez que
        // el reloj de pared marcó el minuto de apertura. Sólo se busca cuando
        // está abierto — cerrado no hay ventana vigente que fechar.
        openedAt: isOpen ? lastDailyOpening(schedule, now, today) : null,
      };
    }
  }
};

/**
 * ¿Ese minuto del día cae adentro de la ventana?
 *
 * La que NO cruza la medianoche y la que sí son la misma regla con el conector
 * dado vuelta. Están escritas juntas a propósito: partirlas en dos funciones
 * dejaría dos lugares donde arreglar el mismo off-by-one, y el extremo de
 * cierre excluido —`[opens, closes)`— tendría que declararse dos veces.
 */
const isWithinDailyWindow = (
  minuteOfDay: number,
  window: { readonly opensAtMinute: number; readonly closesAtMinute: number },
): boolean =>
  window.opensAtMinute < window.closesAtMinute
    ? minuteOfDay >= window.opensAtMinute && minuteOfDay < window.closesAtMinute
    : minuteOfDay >= window.opensAtMinute || minuteOfDay < window.closesAtMinute;

/** El reloj de pared de un instante en una zona, partido en sus campos. */
interface WallClock {
  readonly year: number;
  /** 1..12, como lo escribe la gente y NO como lo indexa `Date`. */
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
}

/**
 * Qué hora marca el reloj de pared de esa zona en ese instante.
 *
 * Se lee por `formatToParts` y no armando un `Date` desde el texto formateado:
 * el texto depende del locale, y el parseo de vuelta es justo donde se cuelan
 * los formatos de doce horas y los separadores de cada idioma. El `hourCycle`
 * explícito es lo que evita que la medianoche salga como 24.
 */
const wallClockIn = (timeZone: string, instant: Date): WallClock => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant);

  const read = (type: Intl.DateTimeFormatPartTypes): number => {
    const found = parts.find((part) => part.type === type);
    // Si el runtime deja de contestar un campo que se le pidió, esto tiene que
    // caerse y no seguir con un cero: un cero en la hora abre la ventana a la
    // medianoche de todos los álbumes diarios, y lo hace en silencio.
    if (!found) {
      throw new Error(
        'El runtime no devolvió el campo "' +
          type +
          '" de la zona "' +
          timeZone +
          '": sin reloj de pared no se puede resolver una ventana diaria.',
      );
    }
    return Number(found.value);
  };

  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: read('hour'),
    minute: read('minute'),
    second: read('second'),
  };
};

/**
 * Cuánto hay que sumarle a un instante para leer su reloj de pared en esa zona,
 * en milisegundos. Positivo al este de Greenwich.
 */
const offsetAt = (timeZone: string, instant: number): number => {
  const wall = wallClockIn(timeZone, new Date(instant));
  const asIfUtc = Date.UTC(
    wall.year,
    wall.month - 1,
    wall.day,
    wall.hour,
    wall.minute,
    wall.second,
  );
  // El instante se trunca al segundo porque el reloj de pared se leyó con esa
  // resolución: sin truncar, los milisegundos entrarían al offset como ruido.
  return asIfUtc - Math.floor(instant / 1000) * 1000;
};

/**
 * A qué distancia del minuto buscado se sondean los offsets de la zona, en
 * milisegundos.
 *
 * Es un día, y el número sale de la pregunta que contesta: alrededor de un
 * salto de DST conviven DOS offsets, y para encontrarlos los dos hay que
 * pararse a cada lado del salto. Un día es lo más chico que garantiza caer del
 * otro lado —ningún huso cambia dos veces en 24 h— sin irse tan lejos como para
 * cruzar un cambio permanente de huso horario de un país.
 *
 * No se escribe como «minutos por día»: esto no es una conversión de unidades,
 * es la distancia de un sondeo.
 */
const OFFSET_PROBE_DISTANCE_MS = 24 * 60 * 60 * 1000;

/**
 * El instante en que el reloj de pared de esa zona marca ese día a ese minuto.
 *
 * ── POR QUÉ SE SONDEA A LOS DOS LADOS Y NO SE ITERA DESDE EL RESULTADO ────
 * Porque iterar desde el candidato **no encuentra el segundo offset cuando el
 * primero ya cayó del lado nuevo del salto**, y eso no es teórico: con la
 * ventana que cierra a las 02:00 en Sídney, el día que el reloj se atrasa las
 * dos pasadas caían las dos en AEST y contestaban la SEGUNDA de las dos 02:00.
 * O sea el borde una hora tarde — y durante esa hora la app dibuja el composer
 * abierto mientras el servidor rechaza, que es exactamente el desacuerdo que
 * esta regla existe para que no pase. Sondeando un día antes y un día después
 * los dos offsets aparecen siempre, venga el minuto del lado que venga.
 *
 * ── LOS DOS DÍAS RAROS DEL AÑO ────────────────────────────────────────────
 * Cuando el reloj **se atrasa**, el minuto pedido ocurre dos veces y los dos
 * candidatos son válidos: se toma el PRIMERO, que es el que la gente entiende
 * por «a la una y media».
 *
 * Cuando el reloj **se adelanta**, el minuto pedido no ocurre y ninguno de los
 * dos candidatos marca la hora pedida. Ahí se toma el MÁS TARDÍO, que es correr
 * el borde lo que dura el salto.
 */
const instantOfWallMinute = (
  timeZone: string,
  date: Pick<WallClock, 'year' | 'month' | 'day'>,
  minuteOfDay: number,
): Date => {
  const asIfUtc = Date.UTC(
    date.year,
    date.month - 1,
    date.day,
    Math.floor(minuteOfDay / 60),
    minuteOfDay % 60,
  );

  const candidates = [
    asIfUtc - offsetAt(timeZone, asIfUtc - OFFSET_PROBE_DISTANCE_MS),
    asIfUtc - offsetAt(timeZone, asIfUtc + OFFSET_PROBE_DISTANCE_MS),
  ];

  const hits = candidates.filter((candidate) => {
    const wall = wallClockIn(timeZone, new Date(candidate));
    return wall.hour * 60 + wall.minute === minuteOfDay;
  });

  return new Date(hits.length ? Math.min(...hits) : Math.max(...candidates));
};

/**
 * Cuántos días se miran hacia adelante buscando el borde en que el estado
 * cambia de verdad.
 *
 * Tres, y el número sale del único caso que obliga a mirar más de uno: si la
 * ventana entera cae adentro del hueco que deja el adelanto de hora —«de 02:00
 * a 03:00» el día que esa hora no existe—, ese día la ventana no ocurre y el
 * borde hay que buscarlo al siguiente. Un salto de DST se come como mucho un
 * día, y no hay dos saltos en días consecutivos en ninguna zona: con tres, el
 * tercero siempre es un día normal.
 */
const MAX_DAYS_LOOKING_FOR_THE_NEXT_CHANGE = 3;

/**
 * La ÚLTIMA vez que el reloj de pared de la zona marcó el minuto de apertura,
 * mirando hacia atrás desde el instante dado.
 *
 * ── POR QUÉ HAY QUE BUSCARLA HACIA ATRÁS Y NO ALCANZA CON «HOY» ──────────
 * Porque una ventana que cruza la medianoche está abierta a la 01:00 por una
 * apertura que fue AYER a las 20:00. Tomar la de hoy daría un instante en el
 * futuro, y el aviso se llavearía por una apertura que todavía no ocurrió — o
 * sea que se mandaría dos veces: una ahora con la llave equivocada y otra
 * cuando esa apertura llegue de verdad.
 *
 * Se recorre el calendario hacia atrás y se toma el primer candidato que ya
 * pasó, con el mismo techo de días que su hermana: el día del adelanto de hora
 * puede no tener ese minuto.
 */
const lastDailyOpening = (
  window: {
    readonly opensAtMinute: number;
    readonly timezone: string;
  },
  now: Date,
  today: WallClock,
): Date | null => {
  let day: Pick<WallClock, 'year' | 'month' | 'day'> = today;

  for (let back = 0; back < MAX_DAYS_LOOKING_FOR_THE_NEXT_CHANGE; back++) {
    const candidate = instantOfWallMinute(
      window.timezone,
      day,
      window.opensAtMinute,
    );
    if (candidate.getTime() <= now.getTime()) return candidate;

    const previousDay = new Date(
      Date.UTC(day.year, day.month - 1, day.day - 1),
    );
    day = {
      year: previousDay.getUTCFullYear(),
      month: previousDay.getUTCMonth() + 1,
      day: previousDay.getUTCDate(),
    };
  }

  // Inalcanzable con una ventana válida: un minuto del día ocurre cada 24 h,
  // así que en tres días hacia atrás siempre hay uno. Degrada a `null` en vez
  // de tirar por lo mismo que su hermana: lo que se pierde es el aviso, no el
  // veredicto.
  return null;
};

/**
 * El primer instante ESTRICTAMENTE posterior al dado en que la ventana diaria
 * cambia de estado.
 *
 * ── POR QUÉ NO ALCANZA CON «LA PRÓXIMA VEZ QUE EL RELOJ MARQUE ESE MINUTO» ─
 * Porque ese minuto puede NO EXISTIR. Una ventana de 02:00 a 03:00 en una zona
 * que adelanta a las 02:00 no ocurre ese día: el borde de apertura se corre al
 * salto, y en ese instante el reloj ya marca 03:00, que está afuera. O sea que
 * el borde calculado a ciegas promete un cambio que no pasa.
 *
 * Y acá eso no es cosmético: **la app no puede re-evaluar**. No tiene ICU
 * completo, así que confía en este instante para habilitar el composer sola. Un
 * borde que miente le hace dibujar abierto un álbum que el servidor rechaza —
 * exactamente el desacuerdo que esta regla existe para evitar. Por eso se
 * verifica que en el candidato el estado SEA el otro, y si no, se sigue
 * buscando.
 *
 * ── POR QUÉ DEGRADA A `null` EN VEZ DE TIRAR ──────────────────────────────
 * Si en tres días no encontró un cambio —lo que con una ventana válida no puede
 * pasar, porque los dos minutos son distintos—, contesta `null` en vez de
 * romper. Tirar acá voltearía la lectura del álbum entera por un dato de
 * horario, y el veredicto de ESTE instante ya está bien calculado: lo único que
 * se pierde es el temporizador, y sin él la app dibuja el estado vigente hasta
 * que algo la refresque. Degradar a no saber cuándo cambia es peor que saberlo
 * y mucho mejor que un 500.
 */
const nextDailyStateChange = (
  window: {
    readonly opensAtMinute: number;
    readonly closesAtMinute: number;
    readonly timezone: string;
  },
  now: Date,
  today: WallClock,
  isOpenNow: boolean,
): Date | null => {
  const { timezone } = window;
  const targetMinute = isOpenNow ? window.closesAtMinute : window.opensAtMinute;
  let day: Pick<WallClock, 'year' | 'month' | 'day'> = today;

  for (let ahead = 0; ahead < MAX_DAYS_LOOKING_FOR_THE_NEXT_CHANGE; ahead++) {
    const candidate = instantOfWallMinute(timezone, day, targetMinute);

    // Que el borde de hoy ya haya pasado lo decide la comparación de instantes
    // y no una resta de minutos: restar minutos se rompe justo el día que dura
    // 23 horas, que es el día que hay que acertar.
    if (candidate.getTime() > now.getTime()) {
      const wall = wallClockIn(timezone, candidate);
      const isOpenThere = isWithinDailyWindow(
        wall.hour * 60 + wall.minute,
        window,
      );
      if (isOpenThere !== isOpenNow) return candidate;
    }

    // El día siguiente se pide por `Date.UTC`, que normaliza el 32 de enero sin
    // que nadie tenga que saber cuántos días tiene el mes ni si el año es
    // bisiesto. Se avanza por CALENDARIO y no sumando 24 h, justamente porque
    // el día del cambio de hora no tiene 24 h.
    const nextDay = new Date(Date.UTC(day.year, day.month - 1, day.day + 1));
    day = {
      year: nextDay.getUTCFullYear(),
      month: nextDay.getUTCMonth() + 1,
      day: nextDay.getUTCDate(),
    };
  }

  return null;
};
