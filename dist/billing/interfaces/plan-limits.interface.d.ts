/**
 * QUÉ CAMBIA DE UN PLAN A OTRO — la tabla entera, en un tipo.
 *
 * ── POR QUÉ TODAS LAS PALANCAS EN UNA SOLA FILA ────────────────────────────
 * Porque son la MISMA decisión leída sobre dos ejes, y partirlas en constantes
 * sueltas por palanca deja la pregunta «¿qué le toca al plan nuevo?» sin nadie
 * que la haga: cada constante entraría —o no— en silencio. Acá el tipo es
 * total y `PLAN_LIMITS` es un `Record<PlanTier, …>`, así que ni una palanca
 * nueva ni un plan nuevo pueden entrar sin decidirse (ORDEN §6).
 *
 * ── `null` SIGNIFICA «SIN TOPE», Y NO ES LO MISMO QUE UN NÚMERO GRANDE ─────
 * Un tope «infinito» escrito como `Number.MAX_SAFE_INTEGER` obliga a cada
 * lector a compararse contra un número que no existe y hace que el mensaje de
 * rechazo pueda decirlo. Con `null`, quien lee tiene que decidir explícitamente
 * qué hace cuando no hay tope, y el rechazo no se puede emitir por accidente.
 */
export interface PlanLimits {
    /**
     * Cuántos álbumes puede CREAR una cuenta mientras no tiene plan activo.
     *
     * Se cuentan CREADOS y no ACTIVOS: `Album` no tiene borrado lógico y el
     * borrado es duro, así que contar los que existen hoy serían álbumes
     * secuenciales ilimitados gratis —que es el flujo natural del fotógrafo que
     * entrega y borra—. Y se cuenta sólo lo creado SIN plan activo, para que
     * quien cancela nunca quede peor que alguien que nunca pagó.
     */
    readonly albumsCreatedWhileFree: number | null;
    /**
     * Cuántas fotos profesionales admite UN álbum, sumando las de todos los que
     * suben.
     *
     * Es POR ÁLBUM y no por persona, y ésa es toda la palanca: per-uploader no
     * topea nada, porque no hay cota sobre cuántos organizadores puede tener un
     * álbum y el modelo prohíbe ponerla. Con el cupo del álbum —fijado por el
     * plan de QUIEN LO CREÓ— promover cuentas gratis deja de ser una forma de
     * multiplicar el cupo.
     */
    readonly professionalPhotosPerAlbum: number | null;
    /**
     * Con cuántos días de admisión NACE el código QR de un álbum.
     *
     * Es el NACIMIENTO, no la extensión: las extensiones siguen siendo de
     * `ALBUM_QR_CODE_EXTENSION_TTL_DAYS` e ilimitadas para todos, porque topearlas
     * sería recortar hacia atrás una capacidad ya entregada. Los dos números
     * viven separados justamente porque una sola constante para los dos conceptos
     * hacía que el botón de extender del cliente dijera el plazo del nacimiento.
     */
    readonly albumQrCodeBirthTtlDays: number;
    /**
     * Si el álbum muestra sus estadísticas.
     *
     * ES LA ÚNICA RESTA DEL MODELO, y su costo está medido: el total de
     * participantes sólo se muestra ahí, así que un organizador sin plan se queda
     * sin ninguna forma de saber cuánta gente hay en su álbum. Se acepta a
     * conciencia porque hoy no se le saca a nadie —la base está vacía—; el día
     * que haya usuarios usándolas, quien ya las tenga queda grandfathereado.
     */
    readonly albumStats: boolean;
}
