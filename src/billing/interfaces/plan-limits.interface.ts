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

  /**
   * Si en los álbumes de este plan se puede subir VIDEO profesional.
   *
   * Es una CAPACIDAD y no un tope: en el plan gratis el video profesional no
   * existe para nadie, así que no hay número que un rechazo pueda decir. Por
   * eso es `boolean` y no `number | null` — un `0` habría sido el mismo hecho
   * escrito de una forma que invita a interpolarlo en una frase.
   *
   * ── ES ADITIVA: NO LE SACA NADA A NADIE ────────────────────────────────
   * A diferencia de las estadísticas —la única resta del modelo—, ésta no
   * recorta ninguna capacidad existente: hoy nadie puede subir video
   * profesional. El día que se apague un plan, los videos ya subidos siguen
   * enteros, se siguen viendo y se siguen descargando; lo único que se apaga es
   * subir uno nuevo.
   */
  readonly professionalVideo: boolean;

  /**
   * Si los álbumes de este plan pueden llevar la MARCA de quien los entrega: el
   * logo del estudio y la acreditación de su nombre.
   *
   * Es una CAPACIDAD y no un tope —hay marca o no la hay, no hay número que un
   * rechazo pueda decir—, con la misma forma que sus dos hermanas de arriba.
   *
   * ── POR QUÉ ENTRA A LA TABLA, SI YA FUNCIONABA SIN ELLA ────────────────
   * Porque era la ÚNICA de las palancas del modelo que se decidía comparando el
   * enum a mano —`albumTier === PlanTier.FREE`—, y en DOS lugares: el servicio
   * que la escribe y el modal que la anticipa. El costo no es estético: el día
   * que exista un tercer escalón, `=== PlanTier.FREE` es falso para ese tier, o
   * sea que **la marca se otorga sola, en silencio, a un plan que nadie decidió
   * que la tuviera** — en el api y en el cliente a la vez. La tabla existe
   * exactamente para que eso no compile.
   *
   * ── ES DEL ÁLBUM, NO DE QUIEN ADMINISTRA ──────────────────────────────
   * Se lee del plan de QUIEN CREÓ el álbum, igual que el cupo de fotos y la
   * ventana del Baúl. Leída del organizador que paga, el logo de un estudio
   * ajeno aparecería en la portada de un casamiento que su dueño no eligió.
   *
   * ── ADITIVA, Y ADEMÁS NO SE MIRA AL LEER ──────────────────────────────
   * El derecho se verifica al ESCRIBIR la marca y nunca al dibujarla: apagar el
   * plan no borra el logo de un álbum ya entregado. Lo que se apaga es poner
   * una marca nueva.
   */
  readonly albumBranding: boolean;

  /**
   * Cuántos días se guarda una historia en el Baúl del álbum. `null` = para
   * siempre.
   *
   * ── ES LA ÚNICA PALANCA DEL MODELO QUE PUEDE DESTRUIR DATOS ────────────
   * Todas las demás gobiernan lo que se CREA. Ésta gobierna lo que se BORRA, y
   * por eso su valor no se aplica hacia atrás por ningún camino: la ventana se
   * estampa en la fila al PUBLICARSE, contra el plan que el álbum tenía en ese
   * instante, y toda historia anterior a que existiera el estampado se queda
   * con la ventana indefinida para siempre. Bajar este número no acorta ninguna
   * ventana ya estampada; subirlo tampoco alarga las que ya se fueron.
   *
   * ── ES DEL ÁLBUM, NO DE QUIEN PUBLICA ─────────────────────────────────
   * El Baúl lista el archivo del álbum de TODOS sus autores, y su gate de
   * acceso es la membresía. Leído del que publica, el Baúl de un álbum con plan
   * quedaría agujereado con las historias de sus invitados sin plan — un Baúl
   * con agujeros por plan ajeno es peor producto que uno con purga pareja. Por
   * eso la ventana la decide el plan de QUIEN CREÓ el álbum, igual que el cupo
   * de fotos profesionales.
   *
   * ── POR QUÉ SE JUSTIFICA POR LA FACTURA Y NO POR LA VENTA ─────────────
   * Nadie midió que la gente quiera guardar historias ahí. Lo que sí es cierto
   * es que hoy el Baúl no se purga nunca y crece para siempre. Si algún día hay
   * que defender esta palanca, se defiende por el costo de almacenamiento, no
   * por el ingreso.
   */
  readonly storyVaultRetentionDays: number | null;
}
