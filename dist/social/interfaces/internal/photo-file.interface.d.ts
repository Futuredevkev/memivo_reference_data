import type { ResourceType } from '../../../media';
export interface PhotoFile {
    id: string;
    url: string;
    resourceType: ResourceType;
    format: string;
    width: number | null;
    height: number | null;
    /**
     * Cuánto dura la pieza, en SEGUNDOS. `null` cuando no aplica —una foto— o
     * cuando nadie la pudo aportar.
     *
     * ── POR QUÉ VIAJA ────────────────────────────────────────────────────────
     * Porque la celda de una grilla mixta dice HOY que algo es un video —la marca
     * de reproducción— y no dice CUÁNTO dura, que es la única pregunta que decide
     * si alguien lo abre. Sin esto el cliente no tiene de dónde sacarlo: el largo
     * real aparece recién cuando el reproductor cargó el asset, o sea después de
     * abrirlo.
     *
     * Y el dato ya se mide del lado del servidor: la verificación del asset lo
     * obtiene del proveedor y lo usa para rechazar un video largo. Lo que faltaba
     * era GUARDARLO donde vive el asset — hasta acá quedaba sólo en la fila del
     * intento de subida, que un cron purga a los 30 días.
     *
     * ── SEGUNDOS Y NO MILISEGUNDOS ───────────────────────────────────────────
     * Es la unidad en la que el proveedor la mide, la que el catálogo usa para
     * topearla y la que el intento ya declaraba. Convertir al reloj del teléfono
     * es trabajo del call-site, con su constante a la vista: el formateador del
     * cliente toma MILISEGUNDOS y su docblock prohíbe a propósito una firma que
     * acepte las dos unidades, porque pasarle segundos compila y da un reloj cien
     * veces más corto.
     *
     * ── REQUERIDO-NULLABLE Y NO OPCIONAL ─────────────────────────────────────
     * Para que el mapper del servidor tenga que RESOLVERLO en vez de omitirlo en
     * silencio: lo que se admite es no conocer la duración, no olvidarse de
     * mandarla.
     *
     * ⚠️ **`null` es el estado normal, no el borde.** Todo lo subido antes de que
     * la columna existiera queda en `null` y no hay backfill: recuperarlo pediría
     * una llamada por asset a un API con cuota. Quien lo dibuje **degrada a no
     * dibujar nada**, nunca a `0:00`, que sería una medición falsa.
     */
    durationSeconds: number | null;
}
