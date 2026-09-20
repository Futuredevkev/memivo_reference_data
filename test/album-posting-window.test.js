const assert = require('node:assert/strict');
const test = require('node:test');

const {
  AlbumPostingClosedReason,
  AlbumPostingMode,
  resolveAlbumPosting,
} = require('../dist/album/index.js');

/**
 * **LA VENTANA DE PUBLICACIÓN SE RESUELVE EN UN SOLO LUGAR, Y ACÁ SE PRUEBA
 * QUE ESE LUGAR ACIERTA.**
 *
 * ── POR QUÉ LOS CASOS VIVEN ACÁ Y NO EN EL API ────────────────────────────
 * Porque el sujeto es la REGLA, y la regla vive en este paquete. Probarla desde
 * el api la probaría a través de su pin, o sea midiendo el `dist` de un tag que
 * puede ser otro que el del árbol: un rojo ahí no diría si el defecto es de la
 * regla o del repin. Los casos de SISTEMA —dos publicaciones simultáneas en el
 * filo, el doble submit, el cron— sí son del api, y viven allá.
 *
 * ── LO QUE ESTOS CASOS NO MIDEN ───────────────────────────────────────────
 *  · **Nada de autorización.** La regla contesta por los invitados; que quien
 *    organiza publique siempre lo decide el validador del api y se prueba allá.
 *  · **Nada de la base.** Que la fila no pueda ser inválida lo sostiene el
 *    `CHECK` de la tabla, no esto: acá se le pueden pasar formas que la base
 *    rechazaría.
 *  · **El tz database es el del runtime.** Si Node se actualiza con reglas
 *    nuevas para una zona, las fechas fijas de abajo pueden moverse. Se
 *    eligieron zonas con saltos estables y de años pasados para que eso no pase
 *    en silencio; si pasa, el rojo es correcto y hay que volver a medir.
 */

const BA = 'America/Argentina/Buenos_Aires';
const NY = 'America/New_York';
const SYD = 'Australia/Sydney';

const daily = (opens, closes, timezone) => ({
  mode: AlbumPostingMode.DAILY,
  opensAtMinute: opens,
  closesAtMinute: closes,
  timezone,
});
const at = (hour, minute = 0) => hour * 60 + minute;
const openFor = (schedule, iso) =>
  resolveAlbumPosting(schedule, new Date(iso)).closedReason === null;

test('los dos modos sin horario contestan sin próximo borde', () => {
  const now = new Date('2026-09-19T12:00:00Z');

  assert.deepEqual(resolveAlbumPosting({ mode: AlbumPostingMode.EVERYONE }, now), {
    closedReason: null,
    nextChangeAt: null,
  });
  assert.deepEqual(
    resolveAlbumPosting({ mode: AlbumPostingMode.ORGANIZERS_ONLY }, now),
    {
      closedReason: AlbumPostingClosedReason.ORGANIZERS_ONLY,
      nextChangeAt: null,
    },
  );
});

/**
 * El intervalo es `[opensAt, closesAt)`. Los dos extremos se afirman por
 * separado porque son la mitad de los off-by-one que tiene una ventana.
 */
test('la ventana única incluye el instante de apertura y excluye el de cierre', () => {
  const schedule = {
    mode: AlbumPostingMode.ONE_SHOT,
    opensAt: new Date('2026-09-19T18:00:00Z'),
    closesAt: new Date('2026-09-20T04:00:00Z'),
  };

  assert.equal(
    resolveAlbumPosting(schedule, new Date('2026-09-19T17:59:59.999Z'))
      .closedReason,
    AlbumPostingClosedReason.NOT_OPEN_YET,
  );
  assert.equal(
    resolveAlbumPosting(schedule, new Date('2026-09-19T18:00:00.000Z'))
      .closedReason,
    null,
  );
  assert.equal(
    resolveAlbumPosting(schedule, new Date('2026-09-20T03:59:59.999Z'))
      .closedReason,
    null,
  );
  assert.equal(
    resolveAlbumPosting(schedule, new Date('2026-09-20T04:00:00.000Z'))
      .closedReason,
    AlbumPostingClosedReason.ALREADY_CLOSED,
  );
});

/**
 * Una ventana única vencida NO vuelve a abrir sola, y eso se dice con un motivo
 * PROPIO. Sin él la app no puede distinguir «todavía no abrió» de «ya se
 * cerró», y la diferencia no es de texto: en el primer caso hay un instante que
 * esperar y en el segundo hay que decirle a la persona que no espere nada.
 */
test('la ventana única vencida no promete un próximo borde', () => {
  const resolution = resolveAlbumPosting(
    {
      mode: AlbumPostingMode.ONE_SHOT,
      opensAt: new Date('2026-09-19T18:00:00Z'),
      closesAt: new Date('2026-09-20T04:00:00Z'),
    },
    new Date('2026-09-25T00:00:00Z'),
  );

  assert.equal(resolution.closedReason, AlbumPostingClosedReason.ALREADY_CLOSED);
  assert.equal(resolution.nextChangeAt, null);
});

test('la ventana única que todavía no abrió apunta al instante de apertura', () => {
  const opensAt = new Date('2026-09-19T18:00:00Z');
  const resolution = resolveAlbumPosting(
    {
      mode: AlbumPostingMode.ONE_SHOT,
      opensAt,
      closesAt: new Date('2026-09-20T04:00:00Z'),
    },
    new Date('2026-09-19T10:00:00Z'),
  );

  assert.equal(resolution.closedReason, AlbumPostingClosedReason.NOT_OPEN_YET);
  assert.equal(resolution.nextChangeAt.getTime(), opensAt.getTime());
});

/**
 * **EL CASO PRINCIPAL DE LA VENTANA DIARIA ES EL QUE CRUZA LA MEDIANOCHE.**
 * «De 20:00 a 02:00» es la forma en que la gente describe una fiesta, y es
 * justo la que rompe el `>= && <` escrito sin pensar. Buenos Aires no tiene
 * cambio de hora, así que estos casos miden la ventana y nada más.
 */
test('la ventana diaria que cruza la medianoche abre de los dos lados del día', () => {
  const schedule = daily(at(20), at(2), BA);

  assert.equal(openFor(schedule, '2026-09-19T19:59:59-03:00'), false);
  assert.equal(openFor(schedule, '2026-09-19T20:00:00-03:00'), true);
  assert.equal(openFor(schedule, '2026-09-19T23:00:00-03:00'), true);
  assert.equal(openFor(schedule, '2026-09-20T01:59:59-03:00'), true);
  assert.equal(openFor(schedule, '2026-09-20T02:00:00-03:00'), false);
  assert.equal(openFor(schedule, '2026-09-20T10:00:00-03:00'), false);
});

test('la ventana diaria que no cruza la medianoche usa la misma regla', () => {
  const schedule = daily(at(9), at(18), BA);

  assert.equal(openFor(schedule, '2026-09-19T08:59:59-03:00'), false);
  assert.equal(openFor(schedule, '2026-09-19T09:00:00-03:00'), true);
  assert.equal(openFor(schedule, '2026-09-19T17:59:59-03:00'), true);
  assert.equal(openFor(schedule, '2026-09-19T18:00:00-03:00'), false);
  assert.equal(openFor(schedule, '2026-09-19T23:00:00-03:00'), false);
});

test('el próximo borde de la ventana diaria es el otro extremo', () => {
  const schedule = daily(at(20), at(2), BA);

  // Abierta a las 23:00 de un día: cierra a las 02:00 del SIGUIENTE.
  assert.equal(
    resolveAlbumPosting(schedule, new Date('2026-09-19T23:00:00-03:00'))
      .nextChangeAt.toISOString(),
    new Date('2026-09-20T02:00:00-03:00').toISOString(),
  );
  // Abierta a la 01:00: cierra a las 02:00 de ESE mismo día.
  assert.equal(
    resolveAlbumPosting(schedule, new Date('2026-09-20T01:00:00-03:00'))
      .nextChangeAt.toISOString(),
    new Date('2026-09-20T02:00:00-03:00').toISOString(),
  );
  // Cerrada a las 10:00: abre a las 20:00 de ese día.
  assert.equal(
    resolveAlbumPosting(schedule, new Date('2026-09-20T10:00:00-03:00'))
      .nextChangeAt.toISOString(),
    new Date('2026-09-20T20:00:00-03:00').toISOString(),
  );
  // Cerrada a las 03:00, o sea justo después del cierre: abre a las 20:00 de
  // HOY, no de mañana. Es el caso que se rompe si el «ya pasó» se calcula
  // restando minutos en vez de comparando instantes.
  assert.equal(
    resolveAlbumPosting(schedule, new Date('2026-09-20T03:00:00-03:00'))
      .nextChangeAt.toISOString(),
    new Date('2026-09-20T20:00:00-03:00').toISOString(),
  );
});

/**
 * ── LOS DOS SALTOS DE HORA, EN LOS DOS HEMISFERIOS ────────────────────────
 * La ventana se define en el RELOJ DE PARED, así que el día del salto dura en
 * tiempo real una hora más o una menos. Eso es lo correcto —la gente mira el
 * reloj de la pared— y acá se afirma con el número, no con prosa.
 *
 * Las fechas son de 2026 y las zonas tienen saltos estables desde hace décadas.
 */
test('la ventana diaria que contiene el salto dura una hora menos o una más', () => {
  const realHours = (schedule, openedAtIso) => {
    const closesAt = resolveAlbumPosting(schedule, new Date(openedAtIso))
      .nextChangeAt;
    return (closesAt.getTime() - new Date(openedAtIso).getTime()) / 3600000;
  };

  // Nueva York, 2026-03-08: 02:00 EST pasa a ser 03:00 EDT. Una ventana de
  // 20:00 a 06:00 (10 h de reloj de pared) CONTIENE el salto y dura 9 h reales.
  assert.equal(realHours(daily(at(20), at(6), NY), '2026-03-07T20:00:00-05:00'), 9);
  // Y el 2026-11-01 el reloj se atrasa: la misma ventana dura 11 h reales.
  assert.equal(realHours(daily(at(20), at(6), NY), '2026-10-31T20:00:00-04:00'), 11);

  // Sídney, al revés: adelanta el 2026-10-04 y atrasa el 2026-04-05.
  assert.equal(realHours(daily(at(20), at(6), SYD), '2026-10-03T20:00:00+10:00'), 9);
  assert.equal(realHours(daily(at(20), at(6), SYD), '2026-04-04T20:00:00+11:00'), 11);
});

/**
 * **EL CASO QUE EL MUESTREO AL AZAR NO ENCUENTRA.**
 *
 * La hora que se repite cuando el reloj se atrasa es 1 de las 8.760 del año, así
 * que dos mil casos aleatorios la pegan menos de una vez. Va escrito a mano
 * porque es el que destapó un defecto real: resolviendo el borde por iteración
 * desde el candidato, las dos pasadas caían del lado nuevo del salto y el cierre
 * de Sídney contestaba la SEGUNDA de las dos 02:00 — el borde una hora tarde, y
 * durante esa hora la app dibujando el composer abierto contra un servidor que
 * rechaza.
 */
test('cuando el borde cae en la hora repetida, gana la PRIMERA vez que ocurre', () => {
  // Sídney atrasa el 2026-04-05: las 02:00 ocurren a las 15:00Z (AEDT) y otra
  // vez a las 16:00Z (AEST).
  const schedule = daily(at(20), at(2), SYD);
  const resolution = resolveAlbumPosting(
    schedule,
    new Date('2026-04-04T21:00:00+11:00'),
  );

  assert.equal(resolution.closedReason, null);
  assert.equal(resolution.nextChangeAt.toISOString(), '2026-04-04T15:00:00.000Z');
  // Y la otra mitad, que es la que prueba que el borde no llega tarde: un
  // minuto antes todavía está abierto, y en el borde ya no.
  assert.equal(
    openFor(schedule, new Date(resolution.nextChangeAt.getTime() - 60000).toISOString()),
    true,
  );
  assert.equal(openFor(schedule, resolution.nextChangeAt.toISOString()), false);

  // Nueva York atrasa el 2026-11-01: la 01:30 ocurre a las 05:30Z y a las 06:30Z.
  assert.equal(
    resolveAlbumPosting(
      daily(at(1, 30), at(5), NY),
      new Date('2026-11-01T00:30:00-04:00'),
    ).nextChangeAt.toISOString(),
    '2026-11-01T05:30:00.000Z',
  );
});

/**
 * El caso simétrico: el reloj se adelanta y el minuto del borde NO EXISTE ese
 * día. Se corre hacia adelante lo que dura el salto. La alternativa lo correría
 * a un reloj de pared anterior al pedido, o sea abriendo antes de la hora que
 * la app dice — que es peor, porque contradice lo que está escrito en pantalla.
 */
test('cuando el borde cae en el hueco del adelanto, se corre hacia adelante', () => {
  // Nueva York, 2026-03-08: no existen las 02:30.
  const resolution = resolveAlbumPosting(
    daily(at(2, 30), at(4), NY),
    new Date('2026-03-08T01:00:00-05:00'),
  );

  assert.equal(resolution.closedReason, AlbumPostingClosedReason.NOT_OPEN_YET);
  // 07:30Z es la 03:30 EDT: las 02:30 pedidas más la hora que el reloj saltó.
  assert.equal(resolution.nextChangeAt.toISOString(), '2026-03-08T07:30:00.000Z');
});

/**
 * **LA VENTANA QUE CAE ENTERA ADENTRO DEL HUECO NO OCURRE ESE DÍA.**
 *
 * De 02:00 a 03:00 en Nueva York el día que el reloj adelanta: esa hora no
 * existe, así que la ventana no abre — y el próximo cambio es el del día
 * siguiente, no un borde de hoy que no cambiaría nada.
 *
 * Lo destapó la invariante de abajo, y es exactamente por qué el borde se
 * verifica en vez de calcularse a ciegas: la app NO PUEDE re-evaluar —no tiene
 * ICU completo— así que un borde que miente le hace habilitar el composer
 * contra un servidor que rechaza.
 */
test('la ventana que cae entera en el hueco del adelanto se saltea ese día', () => {
  const schedule = daily(at(2), at(3), NY);
  const resolution = resolveAlbumPosting(
    schedule,
    new Date('2026-03-08T00:17:00Z'),
  );

  assert.equal(resolution.closedReason, AlbumPostingClosedReason.NOT_OPEN_YET);
  // 2026-03-09 02:00 EDT, o sea el día siguiente: el 8 de marzo esa hora no
  // existió. `07:00Z` —el instante del salto— sería el borde ingenuo, y en él
  // el reloj marca 03:00, que ya está afuera de la ventana.
  assert.equal(resolution.nextChangeAt.toISOString(), '2026-03-09T06:00:00.000Z');
  assert.equal(openFor(schedule, '2026-03-08T07:00:00.000Z'), false);
  assert.equal(openFor(schedule, resolution.nextChangeAt.toISOString()), true);
});

/**
 * La invariante que tiene que valer para CUALQUIER ventana diaria en cualquier
 * zona: el próximo borde es estrictamente posterior, el estado cambia ahí, y
 * **un minuto antes todavía no cambió**.
 *
 * Esa tercera mitad es la que le da filo: sin ella, un borde que llega tarde
 * pasa las dos primeras sin que nada avise — que es exactamente como el defecto
 * de Sídney sobrevivió a una corrida de dos mil casos.
 *
 * Los casos son deterministas a propósito: un `Math.random()` acá haría que un
 * rojo no se pueda reproducir.
 */
test('para toda ventana diaria, el borde es el PRIMER instante en que cambia', () => {
  const zones = [BA, NY, SYD, 'Europe/Madrid', 'Asia/Kolkata', 'Pacific/Chatham'];
  const days = [
    '2026-03-08', '2026-03-09', '2026-04-05', '2026-06-15',
    '2026-10-04', '2026-11-01', '2026-11-02', '2026-12-31',
  ];
  const windows = [[at(20), at(2)], [at(9), at(18)], [at(0), at(1)], [at(23), at(0, 30)], [at(2), at(3)]];

  for (const timezone of zones) {
    for (const day of days) {
      for (const hour of [0, 1, 2, 3, 12, 19, 20, 23]) {
        for (const [opens, closes] of windows) {
          const schedule = daily(opens, closes, timezone);
          const now = new Date(`${day}T${String(hour).padStart(2, '0')}:17:00Z`);
          const here = resolveAlbumPosting(schedule, now);
          const label = `${timezone} ${now.toISOString()} ${opens}->${closes}`;

          assert.ok(here.nextChangeAt > now, `${label}: el borde no es posterior`);

          const atEdge = resolveAlbumPosting(schedule, here.nextChangeAt);
          assert.notEqual(
            atEdge.closedReason === null,
            here.closedReason === null,
            `${label}: el estado no cambia en el borde`,
          );

          const beforeEdge = here.nextChangeAt.getTime() - 60000;
          if (beforeEdge > now.getTime()) {
            assert.equal(
              resolveAlbumPosting(schedule, new Date(beforeEdge)).closedReason === null,
              here.closedReason === null,
              `${label}: el estado ya había cambiado ANTES del borde`,
            );
          }
        }
      }
    }
  }
});
