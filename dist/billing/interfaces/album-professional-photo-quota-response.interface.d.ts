/**
 * Cuánto le queda a UN álbum de su cupo de fotos profesionales.
 *
 * ── POR QUÉ EXISTE, Y POR QUÉ NO SALE DE LAS ESTADÍSTICAS ────────────────
 * El conteo de fotos profesionales del álbum vivía en las estadísticas, y las
 * estadísticas pasaron a ser del plan pago. O sea que sin esta respuesta un
 * organizador SIN plan se queda sin ninguna forma de ver el cupo que se le
 * aplica: el tope se volvería invisible hasta el momento de chocarlo, que es
 * exactamente lo que el modelo promete que no pasa —«el contador se muestra
 * antes de cualquier rechazo»—.
 *
 * No es una estadística: es la mitad visible de una REGLA. Por eso vive acá y
 * no en el payload de métricas, y por eso lo puede leer cualquiera que
 * administre el álbum, pague o no.
 *
 * ── `cap: null` SIGNIFICA SIN TOPE ──────────────────────────────────────
 * Y no un número enorme: quien dibuja tiene que decidir explícitamente qué
 * mostrar cuando no hay tope, en vez de pintar una barra de progreso contra un
 * infinito inventado.
 */
export interface AlbumProfessionalPhotoQuotaResponse {
    /** Cuántas fotos profesionales tiene el álbum, sumando las de todos. */
    readonly used: number;
    /** El tope que le toca al plan de QUIEN CREÓ el álbum. `null` = sin tope. */
    readonly cap: number | null;
    /**
     * ¿Quien pregunta es QUIEN CREÓ el álbum?
     *
     * ── PARA QUÉ, Y POR QUÉ NO SE PUEDE ADIVINAR DEL LADO DEL CLIENTE ───────
     * Porque de esto depende si comprar el plan destraba algo. El cupo es del
     * ÁLBUM —o sea del plan de su creador—, así que a quien NO lo creó, pagar no
     * le levanta este tope: le levanta el de los álbumes que cree él. Ofrecerle
     * la compra ahí es venderle algo que no resuelve lo que acaba de chocar, y
     * eso produce un reembolso y un enojo, no una conversión.
     *
     * El cliente no tiene con qué saberlo: el creador no viaja en ningún payload
     * que la pantalla de subida tenga a mano. El servidor sí —ya lo trae la misma
     * proyección con la que resuelve el cupo—, así que la respuesta es un campo y
     * no una consulta más.
     *
     * ── NO ES AUTORIDAD ────────────────────────────────────────────────────
     * Decide si se OFRECE comprar y si se listan los beneficios. Quien decide si
     * el tope se aplica es el servidor, en la subida, contra el plan del creador.
     */
    readonly viewerIsCreator: boolean;
}
