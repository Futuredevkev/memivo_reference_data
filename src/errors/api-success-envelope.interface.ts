/**
 * Forma canónica del body de CUALQUIER respuesta EXITOSA de la API. La arma
 * `SuccessEnvelopeInterceptor` (memivo_api) y es lo que el cliente desenvuelve
 * en `unwrapSuccessEnvelope`.
 *
 * Es el hermano de {@link ApiErrorEnvelope}, y hasta la ficha #154 se había
 * migrado sólo la mitad de error: el cliente declaraba su propio
 * `SuccessEnvelope<T>` local y el api armaba el objeto INLINE dentro del `map()`
 * del interceptor. Los auditores del paquete no podían verlo — comparan
 * declaraciones CON NOMBRE entre los dos repos, y del lado del api no había
 * ninguna, sólo un objeto anónimo—, así que las dos mitades podían divergir sin
 * que nada se pusiera en rojo. Y es la mitad con MÁS tráfico: la de éxito la
 * cruza toda respuesta 2xx de la app.
 *
 * `data` es `T` y no `T | undefined`: el interceptor SIEMPRE la pone, incluso
 * cuando el handler devuelve `undefined` (ahí viaja como `data: undefined`, que
 * JSON descarta, y el cliente lee `undefined` igual). No se modela como
 * opcional porque hacerlo obligaría a todo consumidor a chequear una ausencia
 * que sólo ocurre cuando el endpoint no devuelve nada por diseño.
 */
export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  timestamp: string;
}
