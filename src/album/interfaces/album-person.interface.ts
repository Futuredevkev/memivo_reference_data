import type { AlbumMemberRole } from '../enums';

/**
 * Una PERSONA de un álbum, tal como la dibuja el filtro por persona.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * Las tres superficies que filtran por persona —el feed de invitados por
 * ETIQUETADO, el Baúl por AUTORÍA y el registro de actividad por ACTOR—
 * alimentan el MISMO control (`ParticipantFilter`) y publicaban tres formas
 * distintas del mismo concepto: tres nombres para el id (`id`, `id`,
 * `userId`), tres para el avatar (`avatar`, `avatarUrl?`, `avatarUrl`) y dos
 * para el rol más una superficie que directamente no lo llevaba.
 *
 * Esa tercera omisión no era teórica: el control dibuja corona y escudo
 * leyendo el rol, así que los chips del registro de actividad —la única
 * pantalla cuyo eje ES «organizador»— no dibujaban ninguno de los dos.
 *
 * ── POR QUÉ `avatarUrl` Y NO `avatar` ─────────────────────────────────────
 * Las tres emiten una URL ya derivada de Cloudinary, no un objeto de archivo.
 * `avatar` prometía la forma anidada que el resto del repo usa para la entidad
 * y obligaba a un adaptador por superficie; el nombre dice hoy lo que el campo
 * ES. Y va `| null` en vez de opcional porque «no tiene foto» es un hecho, no
 * una ausencia de dato.
 *
 * ── LO QUE NO ES ──────────────────────────────────────────────────────────
 * No es {@link AlbumGuest}: eso es la membresía —lleva `scannedAt` y las dos
 * banderas de la vista de gestión— y se pagina por cursor. Esto es quién
 * aparece en un filtro, y su corte lo confiesa {@link AlbumPeopleResponse}.
 */
export interface AlbumPerson {
  id: string;
  name: string;
  lastName: string;
  avatarUrl: string | null;
  /**
   * El rol EN ESE ÁLBUM, cuando la persona todavía es miembro. Un actor
   * degradado, dado de baja o baneado sigue apareciendo en el registro de
   * actividad y ahí no hay rol que informar.
   */
  albumRole?: AlbumMemberRole;
}
