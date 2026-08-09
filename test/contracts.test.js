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
test('el catálogo consolidado expone 193 códigos de error únicos', () => {
  const values = Object.values(errors.ErrorCode);

  assert.equal(values.length, 193);
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
