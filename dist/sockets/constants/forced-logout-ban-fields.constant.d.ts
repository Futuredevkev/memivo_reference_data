/**
 * Los campos del sobre de error que el aviso de baneo POR SOCKET tiene que
 * llevar, además de la causa.
 *
 * ── EL DEFECTO QUE CIERRA, Y ES EL QUE YA ESTABA PREDICHO POR ESCRITO ──────
 * El baneo tiene DOS bocas: el 403 del HTTP y el sobre sintético que el cliente
 * arma cuando llega el `forced_logout` — que es el que la persona ve EN VIVO, en
 * el instante en que la suspenden. Las dos tienen que decir lo mismo.
 *
 * Cuando el sobre ganó `reasonCategory` —la mitad traducible del motivo—, el
 * 403 empezó a decir «… El motivo: acoso.» y el socket siguió mudo: la misma
 * suspensión, dos textos distintos, en el mismo teléfono y con minutos de
 * diferencia. Y la falta estaba anunciada: al decidir NO derivar
 * `ForcedLogoutPayload` del sobre se escribió el riesgo textual —«si mañana el
 * sobre suma un tercer campo de baneo, el payload del socket sigue mudo»—. El
 * «mañana» fue cinco horas después.
 *
 * ── POR QUÉ UNA CONSTANTE Y NO TRES NOMBRES EN LA INTERFAZ ────────────────
 * Porque el conjunto tiene que poder COMPARARSE, y un tipo no se puede recorrer
 * en runtime. Con la lista acá:
 *  · [ForcedLogoutPayload] deriva su mitad de baneo de ella, así que un nombre
 *    que el sobre no declare no compila (la derivación es sobre
 *    `ForwardableErrorFields`, o sea el sobre menos sus claves canónicas);
 *  · el api la cruza contra `FORWARDABLE_ERROR_BODY_FIELDS` —el dueño de qué
 *    campo puede publicar cada código— y se pone rojo el día que el baneo gane
 *    un CUARTO campo y el socket se quede mudo otra vez. Ese cruce es lo único
 *    que impide la tercera repetición: no hay `tsc` que pueda ver que dos bocas
 *    del mismo hecho dejaron de decir lo mismo.
 */
export declare const FORCED_LOGOUT_BAN_FIELDS: readonly ["isPermanent", "expiresAt", "reasonCategory"];
