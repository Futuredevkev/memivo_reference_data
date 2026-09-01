const test = require('node:test');
const assert = require('node:assert/strict');

const notifications = require('../dist/notifications/index.js');

const {
  NOTIFICATION_DELIVERY_POLICY,
  NotificationType,
  activeViewSuppressesNotification,
  getNotificationDeliveryPolicy,
  resolveNotificationContextId,
} = notifications;

/**
 * El vocabulario va escrito a mano acá A PROPÓSITO, no derivado de los tipos.
 * `tsc` ya valida las uniones al compilar; lo que este test agrega es fricción:
 * sumar un eje, un motivo de foreground o una fuente de id pone el gate en rojo
 * y obliga a pasar por acá a decidir si la tabla y sus consumidores lo
 * contemplan. Un test que se derive solo no puede hacer esa pregunta.
 */
const ACTIVE_VIEW_KEYS = ['albumId', 'chatGroupId', 'postId', 'storyId'];
const FOREGROUND_REDUNDANCIES = [
  'none',
  'self-confirmed',
  're-engagement',
  'echoed-in-app',
];
const CONTEXT_ID_SOURCES = [
  'resourceId',
  'metadata.albumId',
  'metadata.groupId',
  'metadata.guestPostId',
  'metadata.storyId',
];

const entries = () => Object.entries(NOTIFICATION_DELIVERY_POLICY);

const emptyView = () => ({
  albumId: null,
  chatGroupId: null,
  postId: null,
  storyId: null,
});

/**
 * EL GATE DE EXHAUSTIVIDAD.
 *
 * `Record<NotificationType, …>` ya lo garantiza en `tsc`, pero este test lo
 * verifica sobre el `dist/` compilado: es la red que también atrapa un tipo
 * borrado del enum que quedó con fila huérfana, cosa que el `Record` no ve.
 */
test('la tabla tiene exactamente una fila por tipo de notificación', () => {
  const types = Object.values(NotificationType);
  const rows = Object.keys(NOTIFICATION_DELIVERY_POLICY);

  assert.equal(rows.length, types.length);
  for (const type of types) {
    assert.ok(
      NOTIFICATION_DELIVERY_POLICY[type],
      `falta la fila de ${type} en NOTIFICATION_DELIVERY_POLICY`,
    );
  }
  for (const row of rows) {
    assert.ok(types.includes(row), `${row} no es un NotificationType válido`);
  }
});

test('todos los campos usan valores del vocabulario declarado', () => {
  for (const [type, policy] of entries()) {
    assert.ok(
      policy.redundantWhenViewing === null ||
        ACTIVE_VIEW_KEYS.includes(policy.redundantWhenViewing),
      `${type}: redundantWhenViewing inválido`,
    );
    assert.ok(
      FOREGROUND_REDUNDANCIES.includes(policy.foregroundRedundancy),
      `${type}: foregroundRedundancy inválido`,
    );
    assert.equal(typeof policy.persistsBellRow, 'boolean', `${type}: persistsBellRow`);
    for (const source of policy.contextIdSources) {
      assert.ok(CONTEXT_ID_SOURCES.includes(source), `${type}: fuente ${source}`);
    }
  }
});

test('contextIdSources está poblado si y sólo si el tipo es contextual', () => {
  for (const [type, policy] of entries()) {
    const isContextual = policy.redundantWhenViewing !== null;

    assert.equal(
      policy.contextIdSources.length > 0,
      isContextual,
      `${type}: un tipo contextual necesita fuentes, y uno no contextual no puede tenerlas`,
    );
  }
});

/**
 * EL GATE QUE IMPORTA: no se puede silenciar sin nombrar el sustituto.
 *
 * Es la regla que evita que "suprimir" degenere en "sacarlo y ya". Si una push
 * se calla, algo in-app tiene que estar diciéndolo — y ese algo queda escrito
 * en la fila, no en un comentario que envejece.
 */
test('suprimir por pantalla o por foreground exige nombrar la superficie que sustituye', () => {
  for (const [type, policy] of entries()) {
    const suppresses =
      policy.redundantWhenViewing !== null ||
      policy.foregroundRedundancy === 'self-confirmed' ||
      policy.foregroundRedundancy === 'echoed-in-app';

    if (suppresses) {
      assert.ok(
        policy.replacedBy,
        `${type} se suprime pero no declara replacedBy: silenciar sin sustituto es perder el evento`,
      );
    }
  }
});

/**
 * La contracara, acotada al caso puro. `re-engagement` se calla SIN sustituto
 * porque no hay información que entregar: el fin de la push era traer al
 * usuario a la app y ya está adentro. Pero si el tipo además es contextual,
 * manda la regla del otro eje —ahí sí se está ocultando algo que otra pantalla
 * muestra— y el sustituto vuelve a ser obligatorio. Por eso el filtro excluye
 * a los contextuales en vez de mirar sólo el motivo de foreground.
 */
test('un re-enganche puro no declara superficie: no hay nada que sustituir', () => {
  for (const [type, policy] of entries()) {
    const isPureReEngagement =
      policy.foregroundRedundancy === 're-engagement' &&
      policy.redundantWhenViewing === null;

    if (isPureReEngagement) {
      assert.equal(
        policy.replacedBy,
        null,
        `${type}: un re-enganche no sustituye información, la descarta`,
      );
    }
  }
});

/**
 * Las push-only no tienen fila revisitable: silenciarlas en foreground las
 * borra para siempre. Está permitido —es justo lo que se hace con los
 * `*_UPLOAD_READY`— pero exige que el sustituto in-app exista de verdad.
 * Este test fija cuáles son, para que sumar una a la lista sea deliberado.
 */
test('las push-only silenciadas en foreground son exactamente las esperadas', () => {
  const silenced = entries()
    .filter(
      ([, policy]) =>
        !policy.persistsBellRow && policy.foregroundRedundancy !== 'none',
    )
    .map(([type]) => type)
    .sort();

  assert.deepEqual(silenced, [
    'DAILY_MOTIVATIONAL',
    'DOWNLOAD_READY',
    'GUEST_POST_UPLOAD_FAILED',
    'GUEST_POST_UPLOAD_READY',
    'HIGHLIGHTS_REMINDER',
    'PROFESSIONAL_PHOTOS_UPLOAD_FAILED',
    'PROFESSIONAL_PHOTOS_UPLOAD_READY',
    'STORY_UPLOAD_FAILED',
    'STORY_UPLOAD_READY',
    'CHAT_MEDIA_UPLOAD_FAILED',
  ].sort());
});

test('los tipos que dejan fila en la campanita son 31 de 43', () => {
  const withBellRow = entries().filter(([, policy]) => policy.persistsBellRow);

  // El número de la izquierda importa más que el de la derecha: un tipo nuevo
  // que NO deja fila es push-only, o sea que suprimirlo pierde el evento para
  // siempre. Que los dos suban juntos es lo esperable; que suba sólo el total
  // es una decisión que alguien tiene que haber tomado a conciencia.
  //
  // v17.0.0: **los dos suben en TRES**, que es lo esperable. Los tres nuevos son
  // avisos de sanción de plataforma —suspensión de álbum, su reinstalación, y
  // la advertencia— y los tres dejan fila por el mismo motivo que su hermano de
  // remoción: **no hay superficie in-app donde vivan las sanciones**, así que
  // callar la push perdería el hecho entero. Y en los tres el aviso es lo único
  // que le dice a la persona a dónde escribir para pedir la revisión que el
  // corpus legal ya le promete.
  assert.equal(entries().length, 43);
  assert.equal(withBellRow.length, 31);
});

test('getNotificationDeliveryPolicy devuelve null ante un tipo desconocido', () => {
  assert.equal(getNotificationDeliveryPolicy('NOPE'), null);
  assert.equal(getNotificationDeliveryPolicy(undefined), null);
  assert.equal(getNotificationDeliveryPolicy(42), null);
  assert.ok(getNotificationDeliveryPolicy(NotificationType.LIKE_PHOTO));
});

test('resolveNotificationContextId respeta el orden de las fuentes', () => {
  // Chat: metadata primero, recurso como respaldo.
  const chat = NOTIFICATION_DELIVERY_POLICY[NotificationType.NEW_CHAT_MESSAGE];

  assert.equal(
    resolveNotificationContextId(chat, 'message-1', { groupId: 'group-1' }),
    'group-1',
  );
  assert.equal(resolveNotificationContextId(chat, 'group-fallback', {}), 'group-fallback');
  assert.equal(resolveNotificationContextId(chat, undefined, {}), null);
  // Un string vacío no cuenta como fuente resuelta: cae a la siguiente.
  assert.equal(
    resolveNotificationContextId(chat, 'group-fallback', { groupId: '' }),
    'group-fallback',
  );
});

/**
 * El caso especial que costaba un catálogo entero: en reacciones el recurso es
 * el comentario, y el post vive SÓLO en metadata. Si se leyera el recurso, se
 * compararía un commentId contra un postId y no suprimiría nunca.
 */
test('las reacciones resuelven el post por metadata y nunca por el recurso', () => {
  const reaction = NOTIFICATION_DELIVERY_POLICY[NotificationType.REACTION_COMMENT];

  assert.deepEqual(reaction.contextIdSources, ['metadata.guestPostId']);
  assert.equal(
    resolveNotificationContextId(reaction, 'comment-1', { guestPostId: 'post-1' }),
    'post-1',
  );
  assert.equal(resolveNotificationContextId(reaction, 'comment-1', {}), null);
});

/**
 * Metadata antes que recurso en el eje de álbum: hay tipos álbum-scoped cuyo
 * `resourceId` NO es el álbum, y leerlo primero compararía otro id contra el
 * albumId activo. El orden es la defensa.
 */
test('los álbum-scoped resuelven el álbum por metadata antes que por el recurso', () => {
  const moments = NOTIFICATION_DELIVERY_POLICY[NotificationType.MEMIVO_MOMENTS];

  assert.deepEqual(moments.contextIdSources, ['metadata.albumId', 'resourceId']);
  assert.equal(
    resolveNotificationContextId(moments, 'otra-cosa', { albumId: 'album-1' }),
    'album-1',
  );
  // Sin metadata cae al recurso, que para este tipo YA es el álbum.
  assert.equal(resolveNotificationContextId(moments, 'album-1', {}), 'album-1');
});

/**
 * Las fotos OFICIALES no son contextuales, y el test lo fija a propósito: el
 * feed del álbum no se refresca en vivo (la sala tiene `POST_DELETED` pero no su
 * simétrico de creado), así que con el álbum abierto la push es el único aviso.
 *
 * Es el límite de lo que `replacedBy` puede garantizar: el gate verifica que la
 * superficie esté nombrada, no que exista. Moverla exige construir el refresco
 * en vivo primero.
 */
test('las fotos oficiales no se suprimen sin feed en vivo', () => {
  const policy =
    NOTIFICATION_DELIVERY_POLICY[NotificationType.PROFESSIONAL_PHOTOS_UPLOADED];

  assert.equal(policy.redundantWhenViewing, null);
  assert.equal(policy.foregroundRedundancy, 'none');
  assert.equal(policy.replacedBy, null);
});

/**
 * `NEW_GUEST_POST` —una push al álbum ENTERO por cada foto de cada invitado—
 * está ELIMINADO del enum, no suprimido. Escalaba con la cantidad de gente y no
 * con la actividad relevante: en un álbum grande son cientos de avisos que el
 * destinatario no puede accionar, y la única salida era apagar Memivo entero.
 *
 * El test existe para que no vuelva por descuido. Si alguien lo re-agrega al
 * enum, el `Record` exhaustivo lo va a obligar a escribir una fila — y esto le
 * va a recordar por qué se fue.
 */
test('el aviso de post nuevo al álbum entero no volvió al catálogo', () => {
  assert.equal(NotificationType.NEW_GUEST_POST, undefined);
  assert.equal(
    Object.keys(NOTIFICATION_DELIVERY_POLICY).includes('NEW_GUEST_POST'),
    false,
  );
});

test('activeViewSuppressesNotification cruza política y contexto activo', () => {
  const post = NOTIFICATION_DELIVERY_POLICY[NotificationType.LIKE_PHOTO];

  assert.equal(
    activeViewSuppressesNotification(
      { ...emptyView(), postId: 'post-1' },
      post,
      'post-1',
      {},
    ),
    true,
  );
  assert.equal(
    activeViewSuppressesNotification(
      { ...emptyView(), postId: 'otro' },
      post,
      'post-1',
      {},
    ),
    false,
  );
  assert.equal(
    activeViewSuppressesNotification(emptyView(), post, 'post-1', {}),
    false,
  );
});

test('un tipo no contextual nunca lo suprime una pantalla', () => {
  const upload = NOTIFICATION_DELIVERY_POLICY[NotificationType.GUEST_POST_UPLOAD_READY];

  assert.equal(upload.redundantWhenViewing, null);
  assert.equal(
    activeViewSuppressesNotification(
      { ...emptyView(), postId: 'post-1', albumId: 'album-1' },
      upload,
      'post-1',
      { albumId: 'album-1' },
    ),
    false,
  );
});
