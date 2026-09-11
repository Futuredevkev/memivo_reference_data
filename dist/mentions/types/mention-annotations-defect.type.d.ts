/**
 * Por qué una lista de menciones no se puede guardar tal como vino.
 *
 * Es una unión y no un booleano porque cada punta hace algo distinto con cada
 * causa: el servidor elige el código de error por causa —pasarse del tope es
 * una regla que la persona puede cumplir y se le dice cuál; lo demás es un
 * cuerpo que una app honesta no produce—, y lo decide con un `Record` total
 * sobre esta unión, así que una causa nueva no compila hasta elegir su código.
 */
export type MentionAnnotationsDefect = 
/** `start` o `length` no son enteros no negativos, o `length` no alcanza para `@` + un carácter. */
'malformed'
/** La anotación termina fuera del texto. */
 | 'out-of-bounds'
/** El trozo señalado no empieza con el disparador. */
 | 'not-on-trigger'
/** No vienen en orden de aparición, o dos se pisan. */
 | 'unordered-or-overlapping'
/** Son más que `MENTIONS_MAX_ITEMS`. */
 | 'too-many';
