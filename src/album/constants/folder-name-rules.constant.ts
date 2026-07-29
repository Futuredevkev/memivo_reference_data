/**
 * La regla del nombre de carpeta, en UN solo lugar (bloque 36, H-325).
 *
 * El servidor rechazaba la barra y la contrabarra con un `@Matches` y el cliente
 * no lo impedía ni lo decía: nombrar una carpeta «Boda 12/09» —un input
 * completamente normal para un organizador— dejaba el botón «Crear» habilitado,
 * mandaba el POST y volvía un 400 genérico. El modal no se cerraba y el usuario
 * reintentaba el mismo nombre en loop sin ninguna pista de cuál era el carácter
 * prohibido.
 *
 * Vive en el paquete porque es una regla que las DOS puntas tienen que aplicar:
 * el cliente para impedir el nombre imposible y decir el motivo, el servidor
 * como autoridad. Escrita dos veces, divergen — es exactamente lo que el bloque
 * 22 desarmó para quince símbolos más.
 */
/** El separador de rutas de Windows, sin escapes que confundan al lector. */
const BACKSLASH = String.fromCharCode(92);

export const FOLDER_NAME_FORBIDDEN_CHARACTERS: readonly string[] = [
  '/',
  BACKSLASH,
];

/**
 * El patrón que el DTO aplica, DERIVADO de la lista de arriba: escrito a mano
 * en dos lugares, las dos declaraciones divergen en cuanto alguien agregue un
 * carácter a una sola.
 */
export const FOLDER_NAME_PATTERN = new RegExp(
  '^[^' +
    FOLDER_NAME_FORBIDDEN_CHARACTERS.map(
      (character) => BACKSLASH + character,
    ).join('') +
    ']+$',
);

/** `true` cuando el nombre NO contiene caracteres prohibidos. */
export const isValidFolderName = (name: string): boolean =>
  FOLDER_NAME_PATTERN.test(name);
