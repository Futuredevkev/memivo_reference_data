"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION_DELIVERY_POLICY = void 0;
const enums_1 = require("../enums");
/**
 * LA TABLA. Una fila por tipo de notificación: qué hace esa push cuando la app
 * del destinatario está viva.
 *
 * Es la fuente ÚNICA de la que salen todas las decisiones de supresión de los
 * dos lados del cable. Antes estaban repartidas en seis catálogos y dos
 * implementaciones espejadas a mano —`CHAT/POST/STORY/REACTION_POST_SUPPRESSION_TYPES`,
 * `FOREGROUND_SUPPRESSED_NOTIFICATION_TYPES` y `PUSH_ONLY_NOTIFICATION_TYPES`—,
 * y agregar un tipo al enum no obligaba a nadie a decidir nada: 24 de los 37
 * entraron sin una sola línea escrita sobre qué debía pasar con ellos.
 *
 * Ahora el `Record` es EXHAUSTIVO: un tipo nuevo en `NotificationType` sin fila
 * acá **no compila**. Ésa es toda la idea.
 *
 * Y la contracara, que la verifica `notification-delivery-policy.test.js`:
 * suprimir exige nombrar la superficie in-app que sustituye a la push
 * (`replacedBy`). No se puede callar algo sin decir quién lo dice en su lugar.
 */
/**
 * En chat el grupo viaja en metadata; el `resourceId` es el mensaje. Se mira
 * metadata primero y el recurso como respaldo.
 */
const CHAT_ID_SOURCES = [
    'metadata.groupId',
    'resourceId',
];
/** En posts el `resourceId` YA es el post; metadata es el respaldo. */
const POST_ID_SOURCES = [
    'resourceId',
    'metadata.guestPostId',
];
/**
 * En reacciones el `resourceId` es el comentario o la respuesta, NO el post:
 * el id del post vive sólo en metadata. Éste era el motivo de existir de
 * `REACTION_POST_SUPPRESSION_TYPES`, un catálogo entero para marcar dos tipos.
 */
const REACTION_POST_ID_SOURCES = [
    'metadata.guestPostId',
];
/** En historias el id viaja en metadata; el recurso puede ser el comentario. */
const STORY_ID_SOURCES = [
    'metadata.storyId',
    'resourceId',
];
/**
 * Metadata primero y no al revés: hay tipos álbum-scoped cuyo `resourceId` NO
 * es el álbum, y leerlo primero compararía otro id contra el `albumId` activo.
 * Todas las metadatas extienden `AlbumNotificationMetadata`, así que `albumId`
 * siempre está y el respaldo por recurso casi nunca hace falta.
 */
const ALBUM_ID_SOURCES = [
    'metadata.albumId',
    'resourceId',
];
/**
 * Constructor de fila. No tiene valores por defecto para las tres decisiones
 * —`foreground`, `bellRow`, `replacedBy` y `anonymousActor` son obligatorias—
 * justamente para que
 * agregar un tipo obligue a pensarlas. `viewing` sí es opcional: ausente
 * significa «no depende de ninguna pantalla».
 */
const policy = (row) => ({
    redundantWhenViewing: row.viewing?.key ?? null,
    contextIdSources: row.viewing?.from ?? [],
    foregroundRedundancy: row.foreground,
    persistsBellRow: row.bellRow,
    replacedBy: row.replacedBy,
    anonymousActor: row.anonymousActor,
});
exports.NOTIFICATION_DELIVERY_POLICY = {
    // ───────────────────────────────────────────────────────────────────────
    // Interacción sobre un post. Redundantes sólo si tenés ESE post abierto.
    // ───────────────────────────────────────────────────────────────────────
    [enums_1.NotificationType.LIKE_PHOTO]: policy({
        viewing: { key: 'postId', from: POST_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'post-detail',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.COMMENT_PHOTO]: policy({
        viewing: { key: 'postId', from: POST_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'post-detail',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.REPLY_COMMENT]: policy({
        viewing: { key: 'postId', from: POST_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'post-detail',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.TAGGED_IN_PHOTO]: policy({
        viewing: { key: 'postId', from: POST_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'post-detail',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.REACTION_COMMENT]: policy({
        viewing: { key: 'postId', from: REACTION_POST_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'post-detail',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.REACTION_RESPONSE]: policy({
        viewing: { key: 'postId', from: REACTION_POST_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'post-detail',
        anonymousActor: false,
    }),
    // ───────────────────────────────────────────────────────────────────────
    // Chat. Redundantes con ESA sala abierta: el mensaje, la encuesta o la
    // reacción aparecen solos en el hilo.
    // ───────────────────────────────────────────────────────────────────────
    [enums_1.NotificationType.NEW_CHAT_MESSAGE]: policy({
        viewing: { key: 'chatGroupId', from: CHAT_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'chat-room',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.CHAT_MESSAGE_REPLY]: policy({
        viewing: { key: 'chatGroupId', from: CHAT_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'chat-room',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.POLL_CREATED]: policy({
        viewing: { key: 'chatGroupId', from: CHAT_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'chat-room',
        anonymousActor: true,
    }),
    [enums_1.NotificationType.CHAT_MESSAGE_REACTION]: policy({
        viewing: { key: 'chatGroupId', from: CHAT_ID_SOURCES },
        foreground: 'none',
        // Push-only por diseño: la reacción se pinta en vivo sobre la burbuja.
        bellRow: false,
        replacedBy: 'chat-room',
        anonymousActor: false,
    }),
    // ───────────────────────────────────────────────────────────────────────
    // Historias. Redundantes con ESA historia abierta en el visor.
    // ───────────────────────────────────────────────────────────────────────
    [enums_1.NotificationType.TAGGED_IN_STORY]: policy({
        viewing: { key: 'storyId', from: STORY_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'story-viewer',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.STORY_COMMENT]: policy({
        viewing: { key: 'storyId', from: STORY_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'story-viewer',
        anonymousActor: false,
    }),
    // ───────────────────────────────────────────────────────────────────────
    // Álbum-scoped. Redundantes con ESE álbum abierto — pero SÓLO valen para
    // superficies que se refrescan solas por socket. Ésa es la línea, y separa
    // este grupo del siguiente.
    // ───────────────────────────────────────────────────────────────────────
    [enums_1.NotificationType.MEMIVO_MOMENTS]: policy({
        viewing: { key: 'albumId', from: ALBUM_ID_SOURCES },
        // NO es incondicional: va a TODOS los miembros del álbum y es push-only.
        // Callarla en foreground a secas se la borraría para siempre a la mayoría,
        // que está en la app pero en otra pantalla.
        foreground: 'none',
        bellRow: false,
        replacedBy: 'album-moments-banner',
        anonymousActor: false,
    }),
    // ───────────────────────────────────────────────────────────────────────
    // Re-enganche. Su único fin es traerte a la app; si ya estás adentro, el
    // objetivo está cumplido y no queda información sin entregar. Únicos casos
    // legítimos de `replacedBy: null` con supresión.
    // ───────────────────────────────────────────────────────────────────────
    [enums_1.NotificationType.DAILY_MOTIVATIONAL]: policy({
        foreground: 're-engagement',
        bellRow: false,
        replacedBy: null,
        anonymousActor: false,
    }),
    [enums_1.NotificationType.HIGHLIGHTS_REMINDER]: policy({
        // Los DOS ejes, y no es contradicción: como re-enganche se calla en
        // foreground sin sustituir nada (ya estás en la app), pero como
        // álbum-scoped el servidor —que no sabe nada de foreground— también la
        // saltea si estás adentro de ese álbum, y ahí el sustituto sí existe y hay
        // que nombrarlo: los highlights están en esa misma pantalla.
        viewing: { key: 'albumId', from: ALBUM_ID_SOURCES },
        foreground: 're-engagement',
        bellRow: false,
        replacedBy: 'album-feed',
        anonymousActor: false,
    }),
    // ───────────────────────────────────────────────────────────────────────
    // Auto-confirmación. El destinatario ES quien hizo la acción y la app ya le
    // está mostrando el resultado, encima del propio contenido que subió o bajó.
    //
    // SÍ dependen de la pantalla, y ésa es la corrección: mientras el sustituto
    // era un panel global se asumía que estaba siempre a la vista, y no lo estaba
    // —quedaba debajo de cualquier ventana modal—. Como estas filas además son
    // `bellRow: false`, un fallo suprimido ahí se perdía para siempre. Quien
    // decide si la superficie se ve de verdad es el cliente, que es el único que
    // sabe qué modal hay abierto.
    // ───────────────────────────────────────────────────────────────────────
    [enums_1.NotificationType.GUEST_POST_UPLOAD_READY]: policy({
        foreground: 'self-confirmed',
        bellRow: false,
        replacedBy: 'transfer-on-content',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.PROFESSIONAL_PHOTOS_UPLOAD_READY]: policy({
        foreground: 'self-confirmed',
        bellRow: false,
        replacedBy: 'transfer-on-content',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.STORY_UPLOAD_READY]: policy({
        foreground: 'self-confirmed',
        bellRow: false,
        replacedBy: 'transfer-on-content',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.DOWNLOAD_READY]: policy({
        foreground: 'self-confirmed',
        bellRow: false,
        replacedBy: 'transfer-on-content',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.GUEST_POST_UPLOAD_FAILED]: policy({
        foreground: 'self-confirmed',
        bellRow: false,
        replacedBy: 'transfer-on-content',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.PROFESSIONAL_PHOTOS_UPLOAD_FAILED]: policy({
        foreground: 'self-confirmed',
        bellRow: false,
        replacedBy: 'transfer-on-content',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.STORY_UPLOAD_FAILED]: policy({
        foreground: 'self-confirmed',
        bellRow: false,
        replacedBy: 'transfer-on-content',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.CHAT_MEDIA_UPLOAD_FAILED]: policy({
        // El sustituto es la burbuja optimista, que se pinta en error con su
        // propio reintento — el mismo patrón que el resto, pero nombrando la
        // superficie concreta del chat.
        foreground: 'self-confirmed',
        bellRow: false,
        replacedBy: 'chat-message-bubble',
        anonymousActor: false,
    }),
    // ───────────────────────────────────────────────────────────────────────
    // Eco in-app. Eventos de otros donde el socket global ya muestra un toast
    // —en CUALQUIER pantalla— que además dice MÁS que la push: los templates son
    // deliberadamente vagos por privacidad de pantalla bloqueada.
    // El evento no se pierde: los cuatro dejan fila en la campanita.
    // ───────────────────────────────────────────────────────────────────────
    [enums_1.NotificationType.ALBUM_DELETED]: policy({
        foreground: 'echoed-in-app',
        bellRow: true,
        replacedBy: 'global-toast',
        anonymousActor: true,
    }),
    [enums_1.NotificationType.MEMBER_KICKED]: policy({
        foreground: 'echoed-in-app',
        bellRow: true,
        replacedBy: 'global-toast',
        anonymousActor: true,
    }),
    // ───────────────────────────────────────────────────────────────────────
    // El álbum pasó a privado y perdiste el acceso. NO es eco: el álbum
    // desaparece de la lista sin un solo cartel, y el toast que antes lo
    // decía se borró justamente porque esta fila lo reemplaza —dos avisos por
    // el mismo hecho es lo que ORDEN §9 prohíbe—. O sea que acá la push es el
    // único aviso, y por eso `foreground: 'none'` y `replacedBy: null`.
    // ───────────────────────────────────────────────────────────────────────
    [enums_1.NotificationType.ALBUM_HIDDEN]: policy({
        foreground: 'none',
        bellRow: true,
        replacedBy: null,
        anonymousActor: true,
    }),
    [enums_1.NotificationType.ALBUM_ORGANIZER_PROMOTED]: policy({
        foreground: 'echoed-in-app',
        bellRow: true,
        replacedBy: 'global-toast',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.ALBUM_ORGANIZER_REMOVED]: policy({
        foreground: 'echoed-in-app',
        bellRow: true,
        replacedBy: 'global-toast',
        anonymousActor: true,
    }),
    // ───────────────────────────────────────────────────────────────────────
    // Gestión de chat. NO son eco incondicional: la explicación in-app existe
    // sólo DENTRO de la sala (mensaje de sistema, o toast + salida). Desde la
    // lista de chats el grupo desaparece sin un solo cartel, así que fuera de la
    // sala la push sigue siendo el único aviso.
    // ───────────────────────────────────────────────────────────────────────
    [enums_1.NotificationType.CHAT_MEMBER_KICKED]: policy({
        viewing: { key: 'chatGroupId', from: CHAT_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'chat-room',
        anonymousActor: true,
    }),
    [enums_1.NotificationType.CHAT_GROUP_DELETED]: policy({
        viewing: { key: 'chatGroupId', from: CHAT_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'chat-room',
        anonymousActor: true,
    }),
    [enums_1.NotificationType.MEMBER_PROMOTED_ADMIN]: policy({
        viewing: { key: 'chatGroupId', from: CHAT_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'chat-room',
        anonymousActor: false,
    }),
    [enums_1.NotificationType.MEMBER_DEMOTED_ADMIN]: policy({
        viewing: { key: 'chatGroupId', from: CHAT_ID_SOURCES },
        foreground: 'none',
        bellRow: true,
        replacedBy: 'chat-room',
        anonymousActor: true,
    }),
    // ───────────────────────────────────────────────────────────────────────
    // Se entregan SIEMPRE, y cada una por su motivo escrito.
    // ───────────────────────────────────────────────────────────────────────
    /**
     * Fotos oficiales: las sube UNA persona, el fotógrafo, y por tanda con su
     * contador — no por foto. No escala con la cantidad de invitados, así que no
     * es spam: es el momento que el álbum entero está esperando.
     *
     * No se suprime aunque tengas el álbum abierto, y el motivo es el mismo que
     * mató a `NEW_GUEST_POST`: el feed NO se refresca solo (la sala tiene
     * `POST_DELETED` pero no su simétrico de creado, y la query corre con
     * `refetchOnWindowFocus: false`). Es el agujero que `replacedBy` no puede
     * tapar solo — el gate verifica que la superficie esté NOMBRADA, no que
     * exista. Poner `album-feed` acá pasaría el test y rompería al usuario.
     */
    [enums_1.NotificationType.PROFESSIONAL_PHOTOS_UPLOADED]: policy({
        foreground: 'none',
        bellRow: true,
        replacedBy: null,
        anonymousActor: false,
    }),
    [enums_1.NotificationType.CHAT_INVITATION]: policy({
        // La fila de la campanita trae sus propios botones aceptar/rechazar, pero
        // no hay ninguna superficie que la anuncie sola: sin push no te enterás.
        foreground: 'none',
        bellRow: true,
        replacedBy: null,
        anonymousActor: false,
    }),
    [enums_1.NotificationType.ALBUM_OWNERSHIP_TRANSFERRED]: policy({
        foreground: 'none',
        bellRow: true,
        replacedBy: null,
        anonymousActor: true,
    }),
    [enums_1.NotificationType.CHAT_GROUP_OWNERSHIP_TRANSFERRED]: policy({
        foreground: 'none',
        bellRow: true,
        replacedBy: null,
        anonymousActor: true,
    }),
    [enums_1.NotificationType.ALBUM_MODERATION_ALERT]: policy({
        // El activity-log está detrás del panel de organizador y no tiene badge ni
        // contador de no-vistos: sin la push, el owner no se entera.
        foreground: 'none',
        bellRow: true,
        replacedBy: null,
        anonymousActor: false,
    }),
    [enums_1.NotificationType.ALBUM_QR_CODE_EXPIRING]: policy({
        // El único aviso que existe sobre un código por vencer. No hay superficie
        // in-app que lo diga sola: el vencimiento se dibuja adentro del modal del
        // QR, o sea a dos toques de distancia y sólo si el dueño entra a mirarlo
        // sin motivo. Por eso NO se suprime por nada — ni por foreground ni por
        // tener el álbum abierto, que es justo donde el dato no está.
        //
        // Y el eje de `viewing` no aplica aunque el tipo sea álbum-scoped: estar
        // adentro del álbum no te muestra el vencimiento de su código. Declararlo
        // redundante con esa pantalla sería nombrar un sustituto que no sustituye.
        foreground: 'none',
        bellRow: true,
        replacedBy: null,
        // No hay actor: lo emite un cron, no una persona. `false` acá significa
        // «no se oculta a nadie», que es lo correcto cuando no hay nadie que ocultar.
        anonymousActor: false,
    }),
    [enums_1.NotificationType.CONTENT_REMOVED_BY_ORGANIZER]: policy({
        // El post desaparece del feed sin un solo cartel. La push es la ÚNICA
        // explicación de que fue moderación y no un bug. Suprimirla exige antes
        // construir esa superficie, que hoy no existe.
        foreground: 'none',
        bellRow: true,
        replacedBy: null,
        anonymousActor: true,
    }),
};
