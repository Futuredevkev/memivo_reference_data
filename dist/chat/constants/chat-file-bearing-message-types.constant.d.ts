import type { ChatFileBearingMessageType } from '../types';
/**
 * Los tipos de mensaje que LLEVAN ARCHIVOS, o sea los que pueden salir del
 * pipeline de subida. DERIVADO del catálogo total.
 *
 * Es la lista que el `@IsIn` del finalize aplica, la que el validador del alta
 * de media exige, y la que el cliente consulta antes de encolar una subida.
 * Estuvo confundida con la de la galería hasta que apareció `DOCUMENT`: una
 * sola lista para las dos preguntas dejaba los documentos sin camino de subida
 * o metía un `.pdf` en la grilla de miniaturas.
 */
export declare const CHAT_FILE_BEARING_MESSAGE_TYPES: readonly ChatFileBearingMessageType[];
