/**
 * Los rechazos por PLAN.
 *
 * ── EL SUFIJO ES CONTRATO DE UI, NO ESTÉTICA ───────────────────────────────
 * `_EXCEEDED` no se eligió por gusto: el cliente recorta el dominio de
 * `RuleShapedErrorCode` POR LA FORMA DEL NOMBRE, y un `…_LIMIT_REACHED` no
 * matchea —la prueba es que `PHOTO_TAG_LIMIT_REACHED` tuvo que agregarse a mano
 * a la lista de falsos negativos—. Con el sufijo correcto, la tabla de copias
 * del cliente es TOTAL sobre ese dominio y no compila hasta que alguien diga
 * qué número dice la frase. Eso es a favor: es el mecanismo que un tope de plan
 * necesita.
 *
 * ── POR QUÉ NO EXISTE UN `PLAN_EXPIRED` ────────────────────────────────────
 * Porque `…_EXPIRED` cae A LA VEZ en `RuleShapedErrorCode` y en
 * `AbsenceShapedErrorCode`, y las dos tablas del cliente lo reclamarían: una
 * pidiendo el número de una regla que no hay, la otra pidiendo la voz de una
 * ausencia que no es. Un plan vencido no es «esto ya no está»: es «esto se
 * paga», y lo dice el tope que se choca.
 *
 * ── Y NINGUNO DE ÉSTOS SALE CON 403 ────────────────────────────────────────
 * El cliente colapsa TODO 403 en «esto ya no está» a propósito —para no delatar
 * bloqueos— y encima hace que la pantalla navegue hacia atrás. Un rechazo por
 * plan en 403 expulsaría a la persona justo de la pantalla donde iba a
 * resolverlo. Van en 402, que está libre en todo el api, y hay un gate en el
 * emisor que lo sostiene.
 */
export declare enum PlanErrorCode {
    /** Tope de álbumes creados por una cuenta sin plan activo. */
    PLAN_ALBUMS_EXCEEDED = "PLAN_ALBUMS_EXCEEDED",
    /**
     * Tope de fotos profesionales de UN álbum, sumando todos los que suben.
     *
     * ⚠️ Quien lo recibe puede tener plan: el cupo se llavea por el álbum —o sea
     * por su creador— y el receptor del rechazo es el que sube. Un fotógrafo con
     * plan, promovido como organizador en un álbum creado por una cuenta gratis,
     * lo choca igual. Por eso la frase habla del ÁLBUM y nunca de «tu plan».
     */
    PLAN_ALBUM_PROFESSIONAL_PHOTOS_EXCEEDED = "PLAN_ALBUM_PROFESSIONAL_PHOTOS_EXCEEDED",
    /**
     * Las estadísticas del álbum son del plan pago.
     *
     * NO lleva sufijo de regla ni de ausencia a propósito: no anuncia un número
     * que se pueda decir ni significa «esto no está». Y en la práctica no lo lee
     * nadie: la pantalla decide con el plan que ya conoce y ni siquiera pide los
     * datos. Existe para que la AUTORIDAD viva en el servidor — el cliente
     * dibuja, no autoriza.
     */
    PLAN_ALBUM_STATS_REQUIRED = "PLAN_ALBUM_STATS_REQUIRED",
    /**
     * La marca del álbum es del plan pago.
     *
     * Misma forma que su hermano de estadísticas y por el mismo motivo: no
     * anuncia ningún número que se pueda decir y no significa «esto no está»,
     * así que no lleva sufijo de regla ni de ausencia.
     *
     * ── SE MIRA AL ESCRIBIR, NUNCA AL LEER ──────────────────────────────────
     * Este código sólo puede salir de la puerta que PONE la marca. La lectura no
     * lo emite nunca: un plan vencido no apaga la marca de un álbum ya
     * entregado, porque eso sería degradar hacia atrás y el modelo lo prohíbe
     * con todas las letras.
     *
     * ── Y EL EJE ES EL ÁLBUM, NO EL ACTOR ───────────────────────────────────
     * Lo decide el plan de quien CREÓ el álbum. Hoy el actor y el creador son la
     * misma persona porque la puerta es de dueño y el dueño ES el creador; la
     * frase igual habla del ÁLBUM, para que siga siendo verdadera el día que la
     * sucesión de propiedad los separe.
     */
    PLAN_ALBUM_BRANDING_REQUIRED = "PLAN_ALBUM_BRANDING_REQUIRED"
}
