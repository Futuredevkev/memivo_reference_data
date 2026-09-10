/**
 * Lo que el servidor DECLARA sobre una pieza de media: si el asset que esta
 * respuesta describe todavía existe.
 *
 * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────────
 * El cable no tenía cómo decir «esto ya no está», así que el cliente no podía
 * distinguir un asset borrado de un parpadeo de red: la librería de imagen del
 * teléfono entrega su error sin status HTTP, y con esa única señal toda pieza
 * caída dibujaba la misma tarjeta con un botón de reintento. Sobre un asset que
 * ya no existe ese botón vuelve a fallar hoy, mañana y siempre.
 *
 * ── POR QUÉ REQUERIDO Y NO OPCIONAL ───────────────────────────────────────
 * Porque un campo opcional no obliga a nadie: `tsc` acepta el mapper que se
 * olvida de resolverlo, y el olvido no se ve —la clave desaparece del JSON y
 * quien la lee recibe `undefined`, que es indistinguible de «está bien»—. Es la
 * misma decisión, con las mismas palabras, que ya está escrita en
 * `ProfessionalPhotoListItem.user`: lo que se admite es no CONOCER el dato, no
 * olvidarse de mandarlo.
 *
 * Requerido cambia además quién avisa. Una fila de base no tiene esta clave
 * —del otro lado la columna se llama distinto a propósito—, así que una entidad
 * cruda deja de ser asignable a una forma de respuesta que compone esto: el
 * camino que devuelve filas en vez de pasar por su mapper NO COMPILA. Ése es el
 * mecanismo que impide que una superficie mande la columna interna y otra el
 * booleano, que es la clase de divergencia que se descubre en el teléfono.
 *
 * ── POR QUÉ UN BOOLEANO Y NO TRES ESTADOS ─────────────────────────────────
 * Porque siendo requerido no queda «este servidor todavía no sabe»: contesta
 * siempre. `false` significa «nadie declaró que falte», que es lo que ya
 * significaba que la url funcione. El tercer estado es del CLIENTE, que también
 * dibuja media de la que el servidor no habla —un avatar, un archivo local, una
 * composición sin subir—, y allá lo nombra la unión que ya tiene para eso.
 *
 * ── POR QUÉ NO DICE LA CAUSA ──────────────────────────────────────────────
 * Borrado por su autor, bajado por moderación o perdido en el proveedor cuentan
 * lo mismo. Un mensaje distinto según la causa delata el bloqueo y la
 * moderación, que es la regla que gobierna todo el vocabulario de ausencia de
 * este producto.
 *
 * ── LO QUE NO EXPRESA ─────────────────────────────────────────────────────
 * `false` NO es «se verificó que está»: es «nadie confirmó que falte». La
 * confirmación la produce una reconciliación de fondo con cota, así que existe
 * una ventana en la que una pieza ya borrada viaja con `false`. Quien dibuje
 * tiene que seguir tolerando que una url con `false` falle.
 */
export interface MediaAvailability {
  unavailable: boolean;
}
