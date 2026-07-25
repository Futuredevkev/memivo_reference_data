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

test('el catálogo consolidado expone 195 códigos de error únicos', () => {
  const values = Object.values(errors.ErrorCode);

  assert.equal(values.length, 195);
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

test('los catálogos de supresión de push exponen tipos válidos de NotificationType', () => {
  const { NotificationType } = notifications;
  const allTypes = new Set(Object.values(NotificationType));
  const catalogs = [
    notifications.CHAT_SUPPRESSION_TYPES,
    notifications.POST_SUPPRESSION_TYPES,
    notifications.STORY_SUPPRESSION_TYPES,
    notifications.REACTION_POST_SUPPRESSION_TYPES,
  ];
  for (const catalog of catalogs) {
    assert.ok(catalog.length > 0);
    for (const type of catalog) assert.ok(allTypes.has(type), `${type} no es un NotificationType`);
  }
  // REACTION_POST es un subconjunto de POST (comparten el caso especial del id).
  const postSet = new Set(notifications.POST_SUPPRESSION_TYPES);
  for (const type of notifications.REACTION_POST_SUPPRESSION_TYPES) {
    assert.ok(postSet.has(type), `${type} debería estar en POST_SUPPRESSION_TYPES`);
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
