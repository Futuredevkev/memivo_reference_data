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
    /**
     * ¿En este álbum se puede subir VIDEO profesional?
     *
     * ── POR QUÉ VIAJA ACÁ Y NO EN UNA RESPUESTA PROPIA ─────────────────────
     * Porque es la MISMA pregunta que el cupo, leída sobre el mismo eje: las dos
     * las contesta el plan de quien creó el álbum, y las dos las necesita el
     * mismo momento — el instante anterior a abrir el selector de archivos. Una
     * respuesta aparte serían dos idas al servidor para pintar una sola pantalla,
     * y dos lecturas del entitlement que podrían contestar distinto si el derecho
     * vence entre una y otra.
     *
     * ── PARA QUÉ LO USA EL CLIENTE, Y PARA QUÉ NO ──────────────────────────
     * Para dos cosas de DIBUJO: decidir si el selector deja elegir videos, y qué
     * decir cuando el filtro de videos no tiene nada que mostrar. **No autoriza
     * nada**: quien decide si el video entra es el servidor, en el alta del
     * intent, contra el plan del creador. Si esta bandera dijera `true` de más, lo
     * único que pasaría es que la persona elige un video y recibe el rechazo — no
     * que el video entre.
     *
     * Es un `boolean` y no un número porque la palanca es una CAPACIDAD: en el
     * plan gratis el video profesional no existe, no es que entren pocos.
     */
    readonly videoIncluded: boolean;
}
