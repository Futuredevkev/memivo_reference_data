/**
 * Lo que necesita saber el aviso de una ADVERTENCIA de plataforma.
 *
 * ── POR QUÉ NO EXTIENDE `AlbumNotificationMetadata` ──────────────────────
 * Porque una advertencia es sobre la PERSONA, no sobre un álbum. Es la
 * diferencia que la vuelve necesaria: la remoción de contenido y la suspensión
 * de álbum tienen un sujeto que se puede señalar, y la advertencia no —trata
 * sobre una conducta—. Colgarle un `albumId` para reusar la forma de al lado
 * obligaría a inventarle uno, y ahí la campanita mandaría a la persona a un
 * álbum que no tiene nada que ver.
 *
 * ── SIN EL MOTIVO REDACTADO POR EL MODERADOR ─────────────────────────────
 * `reason` es la CATEGORÍA, no el texto libre que escribió quien moderó. El
 * texto libre vive en el expediente, y publicarlo en una push lo pondría en la
 * pantalla de bloqueo del teléfono — una nota interna que nadie escribió para
 * que se lea así. Lo que la persona ve es la categoría, y el detalle lo pide
 * escribiendo al correo que el aviso le da.
 */
export interface WarningMetadata {
  /** La categoría de la advertencia. Es la misma que la del reporte. */
  reason: string;
}
