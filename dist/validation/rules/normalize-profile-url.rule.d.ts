/**
 * Le pone `https://` adelante a lo que no traiga esquema; el vacío se queda
 * vacío.
 *
 * Vive con las reglas y no adentro del predicado porque tiene un segundo lector
 * legítimo: el formulario, que guarda la forma NORMALIZADA y no la que se
 * tipeó. Si cada uno normalizara por su cuenta, se podría validar una cosa y
 * guardar otra.
 */
export declare const normalizeProfileUrl: (value: string) => string;
