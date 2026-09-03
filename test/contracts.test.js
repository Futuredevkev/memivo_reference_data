const test = require('node:test');
const assert = require('node:assert/strict');

const contracts = require('../dist/index.js');
const errors = require('../dist/errors/index.js');
const media = require('../dist/media/index.js');
const sockets = require('../dist/sockets/index.js');
const auth = require('../dist/auth/index.js');
const chat = require('../dist/chat/index.js');
const notifications = require('../dist/notifications/index.js');
const social = require('../dist/social/index.js');

// El número se mueve con el catálogo, y por eso el test vale: obliga a que
// agregar o borrar un código sea un acto deliberado. Bloque 24: +4 códigos que
// describen la condición real (`CHAT_MESSAGE_ALREADY_PINNED`,
// `GUEST_POST_EDIT_FORBIDDEN`, `USER_PASSWORD_NOT_SET`,
// `REACTION_TARGET_FORBIDDEN`) y −2 que quedaron sin ningún emisor en el api
// (`USER_INVALID_PASSWORD`, `PHOTO_DELETE_FORBIDDEN`).
//
// Bloque 28: −1 más. `UPLOAD_INTENT_FILE_ALREADY_COMPLETED` tenía UN emisor,
// `validateFileNotCompleted`, que no llamaba nadie: el camino real de
// re-completar un archivo devuelve el `File` existente en vez de tirar 409, que
// es el comportamiento idempotente correcto y el que el bloque 7 consagró. El
// código estaba declarado y traducido a tres idiomas para una condición que el
// usuario no podía ver nunca.
// Bloque 42: −2 más. `CHAT_MEMBER_ALREADY_EXISTS` y `STORY_FILE_REQUIRED` los
// emitían los dos validators que ese bloque borró por no tener llamador, y sus
// condiciones ya están cubiertas por otro mecanismo: `inviteMembers` FILTRA a
// los que ya son miembros en batch (invitar es idempotente, no tira 409) y el
// archivo de la historia llega ya resuelto por el finalize del upload intent.
// Ninguna de las dos podía llegarle al usuario. Se fueron con sus 3 copias.
// 193 y no 194: se fue `ALBUM_ALREADY_SCANNED` con `POST /album/scan`, el
// tercer camino de entrada al álbum que ningún QR de la app alcanzaba. Ningún
// código del api puede emitirlo ya —el validator que lo tiraba se borró— y su
// clave i18n quedaba huérfana en los tres idiomas, que es lo que destapó el
// `audit:consumers`: un errorCode sin traducción es un cartel en blanco.
// Ola B4b: +1. `ALBUM_QR_CODE_EXPIRED`. El `qrCode` del álbum dejó de ser
// eterno, y sin código propio el único emisor posible del vencimiento era el
// 404 de `ALBUM_NOT_FOUND` — o sea que el cliente tenía que decir «no existe»
// sobre un álbum que existe y un código que fue válido. Va con sus tres
// traducciones desde el día uno, por lo que enseñó `ALBUM_ALREADY_SCANNED`.
// Ola P6: −7, y NINGUNO es de P6 — es la deuda que B10 y B11 declararon y que
// nadie había podido pagar porque es CRUZADA. Los siete tenían cero emisores en
// `memivo_api`, medido por grep, y `audit:consumers` los bloquea sin allowlist:
// o sea que el paquete llevaba desde B11 sin poder publicarse, y el ledger de
// B11 declaró lo contrario («ningún gate del paquete exige que un código tenga
// emisor»). Lo destapó P6 al ser la primera ola que intentó publicar después.
//   · `AUTH_PASSWORD_EMPTY`, `AUTH_PASSWORD_TOO_LONG` y
//     `AUTH_PASSWORD_CONFIRMATION_REQUIRED`: los emitía la carpeta
//     `password-rules/`, que B11 borró entera por ser la copia INALCANZABLE de
//     la política —el `ValidationPipe` global corre antes del controller—.
//   · `UPLOAD_URL_MISSING`: se fue con el upload por URL (B10).
//   · `STORY_TAG_NOT_FOUND`, `STORY_TAG_FORBIDDEN` y
//     `STORY_TAG_ALREADY_EXISTS`: eran de un API de gestión de etiquetas de
//     historia que NO EXISTE. Las etiquetas se persisten al CREAR la historia y
//     no hay endpoint que las quite. Borrarlos no borra ninguna funcionalidad:
//     borra tres nombres que nadie tira. Lo que sí quedó ABIERTO y ruteado es
//     más grande que ellos — `StoryUntaggedEvent` tiene DOS listeners y CERO
//     emisores, así que el `STORY_TAG_REMOVED` que el cliente escucha no puede
//     llegar nunca. Eso es una decisión de producto (¿se cablea o se borra?) y
//     no se toma acá. **Se decidió: SE BORRA**, y lo ejecutaron B29 (los dos
//     repos) y la v8.0.0 (el evento y su payload en el paquete).
// Ola B30: −3, y los tres son la misma clase que los siete de arriba, pagada
// tres olas más tarde porque acá sacarlos es BREAKING y hasta la v8.0.0 no
// había dónde. `audit:consumers` los venía acusando y su `EXIT=1` no lo miraba
// nadie, porque este `quality` no lo corría ningún repo (N-198, N-365).
//   · `ALBUM_PRIVATE`: B17 colapsó las tres causas de ausencia de álbum en una
//     sola voz —«no existe» contra «existe pero no podés verlo» delataba el
//     bloqueo— y desde entonces el api no lo emite. El cliente lo tenía en su
//     tabla de voz de ausencia mapeado al texto único, o sea que ya no decía
//     nada propio.
//   · `VIDEO_NOT_FOUND` y `AUDIO_NOT_FOUND` (N-285): los emitían sólo
//     `validateVideoFile` / `validateAudioFile`, las dos ramas de `uploadFile`
//     que producción no puede alcanzar (por ahí sólo pasan imágenes; video y
//     audio suben por el intent firmado). `IMAGE_NOT_FOUND`, su hermano, SÍ
//     tiene emisor y se queda.
//   · `CHAT_MESSAGE_NOT_RELOCATABLE` (N1a): el que suma el reenvío. Lo tira el
//     endpoint cuando el contenido no puede mudarse de chat —lo construyó la
//     app, o un estado suyo lo ata a su sala—, y sólo es alcanzable con una
//     request armada a mano: la app pregunta por la misma puerta antes de
//     ofrecer el botón.
//   · `CHAT_LIVE_LOCATION_NOT_ACTIVE` y `CHAT_LIVE_LOCATION_FAILED` (N1c): los
//     dos que suma la ubicación en vivo. El primero contesta a las TRES causas
//     por las que un canal deja de estar abierto —se venció, lo cortaron, o
//     nunca fue en vivo— con el mismo código a propósito: separarlas no le
//     sirve a quien empuja una posición, que en los tres casos tiene que dejar
//     de hacerlo, y la variante «hay un bloqueo» delataría el bloqueo. El
//     segundo es el fallo genérico de las dos mutaciones del canal.
//
// v14.0.0: +1. `STICKER_CONTENT_NOT_EDITABLE` entró junto con sus TRES emisores
// —el endpoint de edición del comentario, el de la respuesta y el del
// comentario de historia— y con el gate de la app que decide si dibuja el
// botón. Es su propio código y no el `..._FORBIDDEN` de cada superficie porque
// el motivo no es de permisos: el autor tampoco puede editar un sticker, y
// contestarlo con el código de permiso haría que la app explique «no es tuyo»
// sobre algo que sí lo es.
// v15.0.0: +4, todos de la ola de reclamos de derechos (N2). Tres del reporte y
// uno de la remoción, y son cuatro y no uno porque cada uno manda a hacer algo
// distinto:
//   · `PROFILE_REPORT_CONTENT_REQUIRED`: el motivo exige señalar la pieza y no
//     vino ninguna. Manda a volver y elegirla.
//   · `PROFILE_REPORT_CONTENT_NOT_ALLOWED`: el motivo la RECHAZA y vino igual.
//     Manda a sacarla; con este motivo se juzga a la persona, no una pieza.
//   · `PROFILE_REPORT_CONTENT_INCOMPLETE`: vino media referencia —tipo sin id, o
//     al revés—. Manda a completarla, que es otra acción que las dos de arriba.
//   · `MODERATED_CONTENT_NOT_FOUND`: la pieza que el expediente manda remover no
//     existe. Es del otro lado del flujo y lo lee un moderador, no quien
//     denuncia.
//   La entrada de esta ola faltaba: la v15.0.0 movió el número de 191 a 195 y no
//   lo explicó acá, que es exactamente lo que este ledger existe para impedir.
//   Se escribe ahora, junto con la de la v15.2.0.
//
// v15.2.0: +1. `MODERATED_CONTENT_TYPE_NOT_REMOVABLE`, y nace SEPARADO de
// `MODERATED_CONTENT_NOT_FOUND` por la misma razón por la que este ledger
// separa los cuatro de arriba: las dos causas piden cosas distintas del
// moderador. «No existe» manda a revisar el id; ésta manda a elegir otra de las
// tres salidas que los términos §10.1 dan para un reclamo válido. Contestar «no
// existe» sobre una pieza que está publicada —una foto PROFESSIONAL, que en el
// vocabulario de moderación nunca fue lo que `PHOTO` nombra— lo mandaba a
// buscar un id que estaba bien.
//
// v16.0.0: +1 −1, y el total NO se mueve. Es la primera vez que este ledger
// registra un empate, y por eso se escribe con más cuidado que un número que
// cambia: quien mire sólo el ancla de abajo va a leer «no pasó nada».
//   · ENTRA `ALBUM_SUSPENDED`. Memivo puede apagar un álbum entero sin borrarlo
//     —la información es evidencia y tiene que quedar—, y quien lo organiza
//     necesita que se lo digan con una dirección a la que escribir. A cualquier
//     otro la ausencia se le cuenta con la voz colapsada de siempre: separar
//     «no existe» de «existe pero no podés verlo» es el dato que no se da.
//     Éste es la excepción justificada, no un olvido — quien organiza YA sabe
//     que su álbum existía, así que la causa no le revela nada de nadie.
//   · SALE `MODERATED_CONTENT_TYPE_NOT_REMOVABLE`, que había entrado en la
//     v15.2.0 y vivió **veinticuatro horas**. No se saca por prolijidad ni
//     porque estuviera mal: fue correcto durante esas veinticuatro horas, y
//     dejó de tener sentido el día que el dueño decidió que una foto
//     PROFESIONAL también se puede remover. Sin esa restricción el código se
//     quedó **sin un solo emisor en todo el árbol**, y un errorCode sin emisor
//     es superficie publicada que nadie produce, que es lo que ORDEN §7 llama
//     código muerto. Cuando la restricción se va, se va el código que la
//     nombra.
//
// v17.0.0: **+2**, los dos del mismo eje. El hold legal de un expediente dejó de
// ser dos columnas mutables y pasó a ser un registro append-only, y con eso
// nacieron transiciones que se pueden nombrar:
//   · `MODERATION_LEGAL_HOLD_TRANSITION_INVALID`, para abrir un hold ya abierto
//     o liberar uno que no lo está.
//   · `MODERATION_CASE_ALREADY_RESOLVED`, para resolver algo ya resuelto.
// Los dos cierran el MISMO defecto: esas tres puertas contestaban `200` con el
// estado sin cambios, que es **indistinguible de haber funcionado**. Que quien
// modera crea que reabrió un hold es grave, porque de ese hold depende que el
// material no se destruya.
// v19.0.0: **+2**, los dos del mismo eje —«la operación falló» donde sólo
// había nombres para CONDICIONES puntuales—, y los dos salieron de un barrido
// de 327 agentes sobre los 364 archivos de servicio y borde del api:
//   · `MODERATED_CONTENT_REMOVAL_FAILED`. La única superficie que baja UNA
//     pieza con expediente no clasificaba sus errores, así que quien atiende un
//     reclamo legal de un tercero leía «error interno del servidor».
//   · `CHAT_VIEW_ONCE_OPEN_FAILED`. Abrir un mensaje de una sola vista prestaba
//     `CHAT_MESSAGE_SEND_FAILED`, que el cliente traduce «No se pudo enviar el
//     mensaje.»: una frase FALSA sobre una operación que estaba abriendo. Un
//     código prestado es peor que el genérico — el genérico no afirma nada.
// v18.2.0: **+2**, los dos porque un código estaba nombrando DOS reglas y una
// frase que dijera el número de una mentía sobre la otra:
//   · `FILES_DIMENSIONS_TOO_LARGE`. `FILES_TOO_LARGE` salía de seis emisores:
//     tres comparan BYTES y tres comparan PÍXELES contra el lado máximo. Con el
//     rechazo diciendo su tope —que es lo que la ola vino a hacer— «el máximo es
//     de 5 MB» habría sido falso en la mitad de los sitios que lo producen, que
//     es la misma mentira que ya costó borrar `IMAGE_TOO_LARGE`.
//   · `FILES_CONTENT_INVALID`. Dos de los seis emisores de
//     `FILES_UNSUPPORTED_FORMAT` no hablan de formato: uno dispara cuando la
//     imagen no se puede leer y el otro cuando el contenido no coincide con el
//     tipo declarado. Con la lista de formatos dicha en la frase, ahí se leería
//     «se aceptan JPG, PNG…» sobre un archivo que ES un PNG.
test('el catálogo consolidado expone 203 códigos de error únicos', () => {
  const values = Object.values(errors.ErrorCode);

  assert.equal(values.length, 203);
  assert.equal(new Set(values).size, values.length);
});

test('incluye todos los códigos OAuth que antes faltaban en el cliente', () => {
  const requiredOAuthCodes = [
    'OAUTH_APPLE_NOTIFICATION_INVALID',
    'OAUTH_CANNOT_REMOVE_ONLY_METHOD',
    'OAUTH_EMAIL_NOT_VERIFIED',
    'OAUTH_IDENTITY_ALREADY_LINKED',
    'OAUTH_IDENTITY_NOT_FOUND',
    'OAUTH_ONBOARDING_TICKET_EXPIRED',
    'OAUTH_ONBOARDING_TICKET_INVALID',
    'OAUTH_PROVIDER_ALREADY_CONNECTED',
    'OAUTH_PROVIDER_UNAVAILABLE',
    'OAUTH_TOKEN_INVALID',
    'OAUTH_VERIFICATION_FAILED',
  ];

  for (const code of requiredOAuthCodes) {
    assert.equal(errors.ErrorCode[code], code);
  }
});

test('cada ResourceType público tiene un límite de upload', () => {
  const resourceTypes = Object.values(media.ResourceType);

  assert.deepEqual(Object.keys(media.RESOURCE_UPLOAD_LIMITS).sort(), resourceTypes.sort());
  for (const resourceType of resourceTypes) {
    assert.ok(media.RESOURCE_UPLOAD_LIMITS[resourceType].maxFileSize > 0);
  }
});

test('los subpaths exponen la misma identidad que el barrel raíz', () => {
  assert.equal(errors.ErrorCode, contracts.ErrorCode);
  assert.equal(media.ResourceType, contracts.ResourceType);
  assert.equal(sockets.ALBUM_SOCKET_EVENTS, contracts.ALBUM_SOCKET_EVENTS);
});

test('los límites públicos críticos conservan sus unidades y valores', () => {
  assert.equal(media.STORY_VIDEO_MAX_DURATION_MS, 60_000);
  assert.equal(media.GUEST_POST_VIDEO_MAX_DURATION_MS, 120_000);
  assert.equal(media.CHAT_VIDEO_MAX_DURATION_MS, 600_000);
  assert.equal(media.CHAT_AUDIO_MAX_DURATION_MS, 240_000);
  assert.equal(media.PROFILE_REPORT_SCREENSHOT_MAX_COUNT, 4);
});

test('runtime decision contracts expose values in addition to TypeScript types', () => {
  assert.equal(auth.EmailActionRequired.SET_PERSONAL_EMAIL, 'SET_PERSONAL_EMAIL');
  assert.equal(chat.ChatRoleBadge.CREATOR, 'CREATOR');
  assert.equal(chat.ChatRoleBadge.ADMIN, 'ADMIN');
});

test('UPLOAD_PARTIAL_FINALIZE_CONTEXTS solo admite professional_photo', () => {
  const { UPLOAD_PARTIAL_FINALIZE_CONTEXTS, UploadContext } = media;
  assert.ok(UPLOAD_PARTIAL_FINALIZE_CONTEXTS instanceof Set);
  assert.deepEqual([...UPLOAD_PARTIAL_FINALIZE_CONTEXTS], [UploadContext.PROFESSIONAL_PHOTO]);
  assert.equal(UPLOAD_PARTIAL_FINALIZE_CONTEXTS, contracts.UPLOAD_PARTIAL_FINALIZE_CONTEXTS);
});

test('el catálogo de notificaciones de chat solo contiene los tipos de mensajería', () => {
  const { NotificationType, CHAT_NOTIFICATION_TYPES } = notifications;
  assert.deepEqual([...CHAT_NOTIFICATION_TYPES], [
    NotificationType.NEW_CHAT_MESSAGE,
    NotificationType.CHAT_MESSAGE_REPLY,
  ]);
  assert.equal(CHAT_NOTIFICATION_TYPES, contracts.CHAT_NOTIFICATION_TYPES);
});

/**
 * Los cuatro catálogos de supresión los absorbió `NOTIFICATION_DELIVERY_POLICY`
 * (ver `notification-delivery-policy.test.js`, que hereda sus invariantes:
 * tipos válidos, y el caso especial de las reacciones —que era la razón de
 * existir de `REACTION_POST_SUPPRESSION_TYPES`— convertido en la columna
 * `contextIdSources`).
 *
 * Este test es lo contrario del que reemplaza: verifica que NO vuelvan. Una
 * membresía paralela a la tabla es exactamente la extracción a medias que este
 * bloque vino a cerrar — deja el defecto y agrega la ilusión de haberlo
 * arreglado, porque el que agregue un tipo nuevo va a actualizar uno solo.
 */
test('los catálogos de supresión sueltos no volvieron: la tabla es el único lugar', () => {
  const retired = [
    'CHAT_SUPPRESSION_TYPES',
    'POST_SUPPRESSION_TYPES',
    'STORY_SUPPRESSION_TYPES',
    'REACTION_POST_SUPPRESSION_TYPES',
    'FOREGROUND_SUPPRESSED_NOTIFICATION_TYPES',
    'PUSH_ONLY_NOTIFICATION_TYPES',
  ];

  for (const name of retired) {
    assert.equal(
      notifications[name],
      undefined,
      `${name} volvió a existir: la membresía de supresión vive SÓLO en NOTIFICATION_DELIVERY_POLICY`,
    );
    assert.equal(contracts[name], undefined, `${name} se filtró por el barrel raíz`);
  }
});

test('los presets de aspect ratio de guest post conservan valores y el snap coincide', () => {
  assert.equal(social.GUEST_POST_PORTRAIT_DISPLAY_ASPECT_RATIO, 4 / 5);
  assert.equal(social.GUEST_POST_SQUARE_DISPLAY_ASPECT_RATIO, 1);
  assert.equal(social.GUEST_POST_LANDSCAPE_DISPLAY_ASPECT_RATIO, 1.91);
  assert.equal(social.DEFAULT_GUEST_POST_DISPLAY_ASPECT_RATIO, 1);
  assert.deepEqual([...social.GUEST_POST_DISPLAY_ASPECT_RATIO_PRESETS], [4 / 5, 1, 1.91]);

  const snap = social.normalizeGuestPostDisplayAspectRatio;
  assert.equal(snap(0.78), 4 / 5); // cerca de portrait
  assert.equal(snap(1.02), 1); // cerca de cuadrado
  assert.equal(snap(2.5), 1.91); // cerca de landscape
  assert.equal(snap(0), 1); // inválido -> default
  assert.equal(snap(null), 1);
  assert.equal(snap(undefined), 1);
  assert.equal(snap(Number.NaN), 1);
  assert.equal(snap(-3), 1);
});

test('la ventana de contexto de comentarios queda acotada por contrato', () => {
  assert.equal(social.COMMENT_CONTEXT_DEFAULT_LIMIT, 15);
  assert.equal(social.COMMENT_CONTEXT_MIN_LIMIT, 3);
  assert.equal(social.COMMENT_CONTEXT_MAX_LIMIT, 50);
  assert.ok(social.COMMENT_CONTEXT_MIN_LIMIT <= social.COMMENT_CONTEXT_DEFAULT_LIMIT);
  assert.ok(social.COMMENT_CONTEXT_DEFAULT_LIMIT <= social.COMMENT_CONTEXT_MAX_LIMIT);
});
