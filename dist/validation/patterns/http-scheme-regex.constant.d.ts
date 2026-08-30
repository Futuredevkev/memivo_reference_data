/**
 * El prefijo `http://` o `https://`, sin distinguir mayúsculas.
 *
 * Vive suelto porque lo preguntan DOS reglas del mismo eje: la que normaliza una
 * URL de perfil —que le pone `https://` a lo que no traiga esquema— y la que la
 * valida, que necesita distinguir «no trae esquema» de «trae uno que no es
 * http(s)». Escrito en cada una, un cambio en el patrón se aplicaba a media
 * regla.
 */
export declare const HTTP_SCHEME_REGEX: RegExp;
