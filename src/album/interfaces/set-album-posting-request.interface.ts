import type { AlbumPostingSchedule } from './album-posting-schedule.type';

/**
 * Lo que manda quien organiza para cambiar quién puede publicar.
 *
 * ── POR QUÉ EL HORARIO ENTERO Y NO UN PARCHE DE CAMPOS ────────────────────
 * Porque el horario es una unión discriminada: cambiar de la ventana única a la
 * diaria no es tocar dos campos, es reemplazar la forma. Un parche parcial
 * obligaría al servidor a decidir qué hacer con los campos del modo viejo —o
 * sea a limpiarlos a mano en cada rama— y ése es exactamente el olvido que deja
 * una fila con el modo nuevo y los datos del anterior. Mandando la forma
 * completa, la fila inválida no se puede ni expresar, y lo que la base guarda
 * es lo que el `CHECK` admite.
 *
 * ── NINGÚN CAMPO DE AUTORIDAD ─────────────────────────────────────────────
 * No hay «soy organizador» acá ni lo va a haber: quién puede mover el
 * interruptor lo decide el servidor contra la membresía. Lo sostiene el gate
 * que prohíbe los nombres de autoridad en los DTO, no la buena intención.
 *
 * Los instantes viajan como texto ISO, que es lo que el JSON tiene.
 */
export interface SetAlbumPostingRequest {
  readonly schedule: AlbumPostingSchedule<string>;
}
