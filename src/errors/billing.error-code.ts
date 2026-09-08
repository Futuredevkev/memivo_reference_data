/**
 * Los fallos del COBRO — no los rechazos por plan, que son otra cosa.
 *
 * ── POR QUÉ NO LLEVAN EL PREFIJO `PLAN_`, Y NO ES UNA PREFERENCIA ──────────
 * `PLAN_*` significa «esto se paga», y sale en 402 con un gate que lo sostiene
 * (`plan-rejection-status`). Acá el significado es el CONTRARIO: la persona
 * quiere pagar y el canal de cobro no está disponible. Un 402 sobre eso abriría
 * el paywall encima del paywall, y le diría «pagá» a alguien que justo acaba de
 * apretar «pagar». El prefijo propio es lo que mantiene los dos significados
 * separados, y el costo está declarado: `plan-rejection-status` NO audita este
 * dominio, porque su corpus se define por el prefijo.
 *
 * ── Y NO LLEVAN NINGUNA DE LAS DOS FORMAS QUE EL CLIENTE RECORTA ───────────
 * Ni `…_EXCEEDED` / `…_EXPIRED` (que caerían en `RuleShapedErrorCode` y le
 * pedirían a alguien el número de una regla que acá no existe), ni
 * `…_NOT_FOUND` (que caería en `AbsenceShapedErrorCode` y hablaría con la voz
 * de «esto ya no está» sobre algo que sí está y va a volver). Es un fallo de
 * infraestructura contado como tal, y el cliente lo dice con su propia frase.
 */
export enum BillingErrorCode {
  /**
   * No se pudo abrir el cobro web.
   *
   * ── CUBRE DOS CAUSAS, Y ES A PROPÓSITO ─────────────────────────────────
   * (a) el canal web todavía no está configurado en el servidor —el proveedor
   * de cobro no está dado de alta, que el día que se escribió esto era un
   * bloqueante externo sin resolver—, y (b) el intento no se pudo emitir. Las
   * dos son lo mismo para quien mira la pantalla: apretó «pagar» y no se abrió
   * nada, y en las dos la respuesta útil es la misma —volver a intentar más
   * tarde—. Partirlas en dos códigos daría una frase distinta para una
   * conducta idéntica, y la de (a) tendría que explicar una decisión interna
   * que no es asunto de quien compra.
   *
   * Lo que SÍ las separa es el status: (a) sale 503 y (b) 500, así que el
   * operador las distingue en la métrica sin que la persona lea dos textos.
   *
   * ── NO SE VE CASI NUNCA, Y NO POR ESO ES DEUDA ─────────────────────────
   * El botón de compra sólo se dibuja donde el servidor declaró que el canal
   * está habilitado, así que (a) es inalcanzable por el camino normal. Queda
   * alcanzable por dos vías reales: que la configuración se caiga entre la
   * lectura del plan y el toque del botón, y una llamada directa a la ruta.
   */
  BILLING_CHECKOUT_UNAVAILABLE = 'BILLING_CHECKOUT_UNAVAILABLE',

  /**
   * La tienda no confirmó esta compra.
   *
   * ── QUÉ CUBRE, Y POR QUÉ UNA SOLA FRASE PARA TODO ESO ──────────────────
   * El comprobante no valida, viene del entorno de pruebas contra un servidor
   * de producción (o al revés), nombra un producto que no ofrecemos, o la
   * tienda dice que ese acceso no está corriendo. Son causas distintas para el
   * operador y **la misma para quien mira la pantalla**: apretó comprar, la
   * tienda le dijo que sí, y el plan no apareció. Partirlas en cuatro códigos
   * daría cuatro frases para una conducta idéntica —volver a intentar, y si
   * sigue, escribir— y tres de ellas tendrían que explicar una decisión interna
   * que no es asunto de quien compra. Lo que las separa es la MÉTRICA, que las
   * cuenta por separado sin que la persona lea cuatro textos.
   *
   * ── EL SUFIJO `_INVALID` ESTÁ ELEGIDO, NO HEREDADO ────────────────────
   * Queda afuera de las dos tablas totales del cliente a propósito, y encaja
   * con lo que las dos declaran: «no vale» siempre habla de algo que la persona
   * PRESENTÓ —acá, un comprobante— y nunca de contenido que un tercero pudo
   * esconder. Un `…_EXPIRED` habría caído en las dos a la vez, que es el
   * defecto ya escrito para `PLAN_EXPIRED`; y un `…_EXCEEDED` habría pedido el
   * número de una regla que acá no existe.
   *
   * ── NO SALE CON 403, Y ESO NO ES UN DETALLE ───────────────────────────
   * El cliente colapsa todo 403 en «esto ya no está» y encima navega hacia
   * atrás: alguien que acaba de pagar sería expulsado de la pantalla donde
   * estaba comprando. Sale 400 — es un comprobante que no valida.
   */
  BILLING_STORE_PURCHASE_INVALID = 'BILLING_STORE_PURCHASE_INVALID',
  /**
   * Esa suscripción de la tienda ya está activa en OTRA cuenta de Memivo.
   *
   * ── EL HECHO QUE LO PRODUCE, Y POR QUÉ NO SE RESUELVE SOLO ─────────────
   * La compra le pertenece a la cuenta de la TIENDA, no a la de Memivo, y una
   * misma persona puede tener dos cuentas de Memivo en un solo teléfono. Si la
   * segunda pudiera reclamar la suscripción de la primera, dos cosas malas
   * pasarían a la vez: a la primera se le apagaría el plan que está pagando,
   * sin que nadie se lo dijera, y la suscripción se volvería un derecho
   * transferible con sólo iniciar sesión con otra cuenta en el mismo teléfono.
   * Por eso **la suscripción se queda con la cuenta que la reclamó primero**, y
   * la segunda recibe este código en 409 sin que nada cambie.
   *
   * ── POR QUÉ MERECE FRASE PROPIA ────────────────────────────────────────
   * Porque es el único de esta familia con una salida concreta: iniciar sesión
   * con la otra cuenta. Colapsarlo en «no pudimos verificar tu compra» dejaría
   * a alguien reintentando para siempre algo que nunca va a funcionar, que es
   * exactamente el mensaje genérico donde se podía decir algo útil.
   *
   * ── LO QUE NO DICE, Y ES DELIBERADO ────────────────────────────────────
   * No dice CUÁL es la otra cuenta. Quien pregunta puede no ser su dueño —basta
   * con tener el teléfono en la mano— y el mail de otra persona no es asunto
   * suyo. La salida no lo necesita: quien tiene las dos cuentas ya sabe cuáles
   * son.
   */
  BILLING_STORE_PURCHASE_ALREADY_CLAIMED = 'BILLING_STORE_PURCHASE_ALREADY_CLAIMED',
  /**
   * No se pudo hablar con la tienda para verificar la compra.
   *
   * ── POR QUÉ NO ES EL MISMO CÓDIGO QUE EL DEL COBRO WEB ─────────────────
   * Porque el momento es el opuesto y la frase también. Aquél sale ANTES de
   * pagar —no se pudo abrir el checkout— y su respuesta útil es «probá más
   * tarde». Éste sale DESPUÉS: la tienda ya cobró, y quien lo lee necesita
   * saber que **su plata no se perdió** y que el plan va a aparecer. Decirle
   * «no pudimos abrir el pago» a alguien a quien la tienda ya le cobró es
   * decirle lo contrario de lo que pasó.
   *
   * ── TAMBIÉN CUBRE EL CANAL APAGADO, Y CON EL MISMO ARGUMENTO ───────────
   * Igual que su hermano del cobro web: si la tienda no está configurada en el
   * servidor, la conducta que le toca a quien mira es idéntica. Lo que las
   * separa es el status —503 el canal apagado o inalcanzable— y la métrica.
   *
   * ── Y NO SE PIERDE NADA CUANDO SALE ────────────────────────────────────
   * La app no da por terminada la transacción de la tienda hasta que el
   * servidor la acepta, así que la tienda la vuelve a entregar; y el aviso que
   * la tienda manda por su cuenta llega igual. Este código dice «todavía no»,
   * no «se perdió».
   *
   * ── TAMBIÉN VIAJA EN EL RECHAZO DE UN AVISO DE LA TIENDA, EN 401 ───────
   * Y ahí no lo lee ninguna app: del otro lado del cable hay un servidor de un
   * tercero. Se reusa en vez de acuñar un código propio para ese caso porque
   * ese código no tendría lector en ninguna punta — habría que publicarlo,
   * subirle el trinquete al catálogo y declararlo inalcanzable en el cliente,
   * todo para un texto que nadie va a leer nunca. Es el mismo camino que ya
   * tomó el rechazo de firma del cobro web.
   *
   * Lo que separa los tres momentos es el STATUS, que es lo que el cliente mira
   * antes que el código: 503 el canal apagado, 500 el fallo al verificar, 401
   * la entrega que no valida — y esta última no llega a ninguna pantalla.
   */
  BILLING_STORE_UNAVAILABLE = 'BILLING_STORE_UNAVAILABLE',
}
