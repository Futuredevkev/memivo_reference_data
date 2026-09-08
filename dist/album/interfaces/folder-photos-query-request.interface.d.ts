import type { FolderPieceKind } from '../enums/folder-piece-kind.enum';
/**
 * Lo que estrecha la grilla de una carpeta, además de la paginación ordenada.
 *
 * ── POR QUÉ ESTÁ ACÁ Y NO ESCRITO A MANO EN CADA PUNTA ────────────────────
 * Porque la CLAVE del parámetro es lo que el `ValidationPipe` del servidor
 * rechaza si alguna punta la renombra —corre con `whitelist` y
 * `forbidNonWhitelisted`—, y estaba escrita dos veces: una en el DTO del api y
 * otra como literal de objeto anónimo en el servicio del cliente. Que el ENUM
 * ya fuera compartido no alcanza: lo que se desincroniza es el nombre del
 * parámetro, no su valor.
 *
 * Y era el único `const params:` del cliente tipado con un literal anónimo
 * —todos los demás se tipan con una interfaz nombrada de este paquete—, así que
 * además se le escapaba al auditor de transporte, que sólo mira los `params`
 * cuyo inicializador es un objeto literal.
 *
 * ── AUSENTE = TODAS ───────────────────────────────────────────────────────
 * No hay miembro «todas» en el enum a propósito: la ausencia del parámetro ES
 * la respuesta, y un tercer valor obligaría a que cada lector decidiera si
 * `ALL` es una clase de pieza o la falta de filtro.
 */
export interface FolderPhotosQueryRequest {
    /** Qué clase de pieza. Ausente = todas. */
    pieceKind?: FolderPieceKind;
}
