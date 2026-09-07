import { ResourceType } from '../enums';
import { ALLOWED_AUDIO_FORMATS } from './allowed-audio-formats.constant';
import { ALLOWED_DOCUMENT_FORMATS } from './allowed-document-formats.constant';
import { ALLOWED_IMAGE_FORMATS } from './allowed-image-formats.constant';
import { ALLOWED_VIDEO_FORMATS } from './allowed-video-formats.constant';
import { MB } from './mb.constant';
import type { PublicResourceUploadLimit } from './internal/public-resource-upload-limit.interface';

/**
 * Todo lo que un tipo de recurso acota al subirse: cuánto puede pesar, cuánto
 * puede durar y qué extensiones acepta.
 *
 * ── POR QUÉ EL FORMATO ENTRÓ A ESTA TABLA (y no a una hermana) ─────────────
 * El reparto tipo → lista vivía en `RESOURCE_CONFIG`, del lado del api, así que
 * el cliente podía decir el PESO que un recurso admite y no los FORMATOS. El
 * mensaje de «formato no soportado» quedaba sin poder nombrar los que sí
 * entran, que es exactamente la clase de defecto que esta ola vino a cerrar:
 * anunciar una regla sin decirla. Publicarlo como tabla APARTE habría dejado
 * dos filas por recurso en dos archivos, y una fila nueva podría declarar el
 * peso y olvidarse del formato sin que nada se pusiera rojo. Acá el tipo lo
 * impide.
 */
export const RESOURCE_UPLOAD_LIMITS: Readonly<Record<ResourceType, PublicResourceUploadLimit>> = {
  [ResourceType.AVATAR]: { maxFileSize: 5 * MB, formats: ALLOWED_IMAGE_FORMATS },
  [ResourceType.CHAT_GROUP_AVATAR]: { maxFileSize: 5 * MB, formats: ALLOWED_IMAGE_FORMATS },
  [ResourceType.ALBUM_COVER]: { maxFileSize: 5 * MB, formats: ALLOWED_IMAGE_FORMATS },
  [ResourceType.PROFESSIONAL_PHOTO]: { maxFileSize: 15 * MB, formats: ALLOWED_IMAGE_FORMATS },
  /**
   * El video profesional, y sus dos números están ATADOS ENTRE SÍ.
   *
   * ── POR QUÉ 500 MB Y NO LOS 100 DE TODOS LOS DEMÁS ────────────────────
   * Porque los otros tres videos del producto los graba un teléfono para
   * mirarse en un teléfono, y éste es una ENTREGA: es la pieza por la que se
   * paga el plan. Con 100 MB, diez minutos de video son 1,3 Mbps — un bitrate
   * que se ve mal en 1080p y peor en una tele. A 500 MB los mismos diez
   * minutos son ~6,7 Mbps, que es una entrega real.
   *
   * ── Y POR QUÉ LOS DOS NÚMEROS SE ELIGIERON JUNTOS ─────────────────────
   * Un tope de duración que el de bytes no puede sostener es una promesa
   * falsa: si dijera 30 minutos con 500 MB, el único video de 30 minutos que
   * entra es uno a 2,2 Mbps, o sea que el tope real seguiría siendo el de
   * bytes y el número escrito acá mentiría. Los 600 s son el plazo que 500 MB
   * pueden entregar con calidad, no un número elegido aparte.
   *
   * ── DE DÓNDE SALE EL PLAZO, Y QUÉ NO ES ───────────────────────────────
   * 10 minutos es el highlight film de una boda, que es la pieza que un
   * fotógrafo entrega junto con las fotos. NO alcanza para la ceremonia
   * entera ni para el film largo: Memivo entrega el álbum, no es una
   * plataforma de entrega de películas. Si algún día lo fuera, lo que cambia
   * no es este número sino la forma de servirlo (streaming adaptativo), y eso
   * es una ola propia.
   *
   * ── EL TOPE DE DURACIÓN CUESTA UN `ErrorCode`, Y SE PAGÓ ──────────────
   * Declarar `maxDurationSeconds` obliga a que el tipo tenga su propio código
   * `…_TOO_LONG` (lo sostiene un gate del api). La salida barata era no
   * declararlo: el video quedaría acotado sólo por bytes, y un video de dos
   * horas muy comprimido entraría — pagando transcodificación y entrega por
   * algo que el producto no quiere alojar. Se eligió declararlo.
   */
  [ResourceType.PROFESSIONAL_VIDEO]: {
    maxFileSize: 500 * MB,
    maxDurationSeconds: 600,
    formats: ALLOWED_VIDEO_FORMATS,
  },
  [ResourceType.GUEST_PHOTO]: { maxFileSize: 10 * MB, formats: ALLOWED_IMAGE_FORMATS },
  [ResourceType.GUEST_VIDEO]: {
    maxFileSize: 100 * MB,
    maxDurationSeconds: 120,
    formats: ALLOWED_VIDEO_FORMATS,
  },
  [ResourceType.CHAT_IMAGE]: { maxFileSize: 5 * MB, formats: ALLOWED_IMAGE_FORMATS },
  [ResourceType.CHAT_VIDEO]: {
    maxFileSize: 100 * MB,
    maxDurationSeconds: 600,
    formats: ALLOWED_VIDEO_FORMATS,
  },
  [ResourceType.CHAT_AUDIO]: {
    maxFileSize: 10 * MB,
    maxDurationSeconds: 240,
    formats: ALLOWED_AUDIO_FORMATS,
  },
  // 25 MB, y es EL tope de un documento: los tres lugares que lo aplican —el
  // selector del teléfono, el alta del intent y el `/complete` sobre el asset ya
  // medido— leen esta fila. Sin dueño único, el que se quedó corto rechaza
  // después de subir y el que se quedó largo deja pasar.
  [ResourceType.CHAT_DOCUMENT]: {
    maxFileSize: 25 * MB,
    formats: ALLOWED_DOCUMENT_FORMATS,
  },
  [ResourceType.IMAGE_STORY]: { maxFileSize: 10 * MB, formats: ALLOWED_IMAGE_FORMATS },
  [ResourceType.VIDEO_STORY]: {
    maxFileSize: 100 * MB,
    maxDurationSeconds: 60,
    formats: ALLOWED_VIDEO_FORMATS,
  },
  [ResourceType.PROFILE_REPORT_SCREENSHOT]: {
    maxFileSize: 10 * MB,
    formats: ALLOWED_IMAGE_FORMATS,
  },
  // Los mismos 5 MB que la portada y el avatar de grupo, y por el mismo
  // motivo: es una imagen chica que se dibuja al lado de un nombre. Un logo
  // que necesite más que eso no es un logo, es una foto.
  [ResourceType.ALBUM_BRANDING_LOGO]: {
    maxFileSize: 5 * MB,
    formats: ALLOWED_IMAGE_FORMATS,
  },
};
