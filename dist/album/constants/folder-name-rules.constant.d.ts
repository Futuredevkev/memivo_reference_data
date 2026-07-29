export declare const FOLDER_NAME_FORBIDDEN_CHARACTERS: readonly string[];
/**
 * El patrón que el DTO aplica, DERIVADO de la lista de arriba: escrito a mano
 * en dos lugares, las dos declaraciones divergen en cuanto alguien agregue un
 * carácter a una sola.
 */
export declare const FOLDER_NAME_PATTERN: RegExp;
/** `true` cuando el nombre NO contiene caracteres prohibidos. */
export declare const isValidFolderName: (name: string) => boolean;
