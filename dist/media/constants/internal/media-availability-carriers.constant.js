"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEDIA_AVAILABILITY_CARRIERS = void 0;
const resource_type_enum_1 = require("../../enums/resource-type.enum");
/**
 * QUÉ RECURSOS PUEDE LLEVAR CADA FORMA DEL CABLE QUE DECLARA [MediaAvailability].
 *
 * ── PARA QUÉ EXISTE: PARA QUE LA PROMESA SE PUEDA CRUZAR ──────────────────
 * `MediaAvailability` es una promesa: «yo te digo si mi asset todavía existe».
 * Quién puede hacerla NO es una elección libre — sólo puede prometerlo un
 * payload cuyo recurso esté en el barrido, porque si no el campo viaja siempre
 * en `false` y el tipo declara un dato que nadie mantiene.
 *
 * Los dos extremos de ese cruce ya existían y **nada los unía**:
 * [MEDIA_AVAILABILITY_BY_RESOURCE] dice qué se sondea, y el `extends` de cada
 * interfaz dice quién promete. Esta tabla es el eslabón, y con ella el cruce
 * pasa a ser un gate en vez de una revisión que alguien tiene que acordarse de
 * hacer.
 *
 * ── EL DEFECTO QUE CIERRA, CON NOMBRE ─────────────────────────────────────
 * `CoverPhotoData` declaró la forma mientras `ALBUM_COVER` estaba —y sigue—
 * excluido del barrido: los dos helpers de portada escribían `unavailable:
 * false` a mano, el cliente no lo leía, y el tipo prometía algo que el dato no
 * cumplía. Ningún compilador puede ver eso, porque las dos mitades son ciertas
 * por separado.
 *
 * ── POR QUÉ SE ESCRIBE A MANO Y NO SE DERIVA DEL TIPO ─────────────────────
 * Porque el tipo no lo sabe: las cuatro formas declaran `resourceType:
 * ResourceType`, la unión entera, y el recorte es un hecho del DOMINIO —una
 * respuesta de archivo del chat nunca lleva una historia—. Declararlo es
 * justamente el trabajo: obliga a contestar «¿de qué sale esto?» antes de
 * prometer que avisa cuando muere.
 *
 * ── POR QUÉ VIVE EN `internal/` ───────────────────────────────────────────
 * Porque no la importa ningún consumidor: es metadata del propio paquete, y su
 * único lector es el gate que la cruza. Publicarla la volvería un símbolo
 * exportado sin consumidor, que es rojo a propósito en este repo.
 *
 * ── CÓMO SE AUDITA, EN LOS DOS SENTIDOS ───────────────────────────────────
 * El gate cruza tres cosas y ninguna se puede dejar a medias:
 *  1. toda forma que compone `MediaAvailability` tiene su entrada acá —una
 *     forma nueva no entra en silencio—;
 *  2. toda entrada nombra una forma que existe —una entrada que se quedó sin
 *     dueño cae, en vez de tapar en blanco a la próxima con ese nombre—;
 *  3. todo recurso listado está en `true` en [MEDIA_AVAILABILITY_BY_RESOURCE].
 */
exports.MEDIA_AVAILABILITY_CARRIERS = {
    /** Un archivo adjunto a un mensaje del chat. */
    ChatMessageFileResponse: [
        resource_type_enum_1.ResourceType.CHAT_IMAGE,
        resource_type_enum_1.ResourceType.CHAT_VIDEO,
        resource_type_enum_1.ResourceType.CHAT_AUDIO,
        resource_type_enum_1.ResourceType.CHAT_DOCUMENT,
    ],
    /** El archivo que se revela al abrir una pieza de una sola vez: imagen o video. */
    OpenViewOnceResponseFile: [resource_type_enum_1.ResourceType.CHAT_IMAGE, resource_type_enum_1.ResourceType.CHAT_VIDEO],
    /** El archivo de una foto del álbum, sea de invitado o profesional. */
    PhotoFile: [
        resource_type_enum_1.ResourceType.GUEST_PHOTO,
        resource_type_enum_1.ResourceType.GUEST_VIDEO,
        resource_type_enum_1.ResourceType.PROFESSIONAL_PHOTO,
    ],
    /** El archivo de una historia. */
    StoryFileInfo: [resource_type_enum_1.ResourceType.IMAGE_STORY, resource_type_enum_1.ResourceType.VIDEO_STORY],
};
