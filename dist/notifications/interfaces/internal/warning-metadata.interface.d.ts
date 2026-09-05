import type { ModerationReason } from '../../../moderation';
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
 *
 * ── POR QUÉ EL TIPO ES EL ENUM Y NO `string` ──────────────────────────────
 * Porque escrito `string` esta frase era una promesa que nada sostenía, y el
 * api la incumplió: metía el texto libre del moderador en la metadata, que se
 * persiste en el JSONB de `notifications` y vuelve verbatim por
 * `GET /notifications` al propio sancionado. Con `string`, `tsc` no puede
 * distinguir la categoría de la nota interna — es la misma forma que un `select`
 * parcial tipado como entidad entera, con el tipo afirmando algo que el valor no
 * cumple. Con el enum, mandar el texto libre no compila.
 */
export interface WarningMetadata {
    /** La categoría de la advertencia. Es la misma que la del reporte. */
    reason: ModerationReason;
}
