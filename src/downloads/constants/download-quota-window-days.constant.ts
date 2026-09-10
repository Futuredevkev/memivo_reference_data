/**
 * El ancho de la ventana sobre la que se mide cuánto bajó una persona.
 *
 * ── POR QUÉ RODANTE Y NO UN CICLO FIJO ─────────────────────────────────────
 * Un ciclo fijo —«se resetea el 1º»— regala un pico gratis en el borde: el 31 y
 * el 1º son dos cuotas enteras seguidas, y ése es justo el día que alguien que
 * quiere abusar elige. Con ventana rodante no hay borde que esperar. Y no hace
 * falta un cron que la vacíe, que es la otra mitad: la suma se calcula con un
 * `WHERE` sobre la fecha, así que no hay estado que resetear ni un barrido que
 * pueda quedar sin correr.
 *
 * ── POR QUÉ 30 DÍAS ────────────────────────────────────────────────────────
 * Porque es el plazo con el que factura el proveedor de media, y esta cuota
 * existe para no gastar más de lo que el plan aguanta: medir en otra ventana
 * obligaría a traducir entre dos plazos para saber si el número alcanza.
 *
 * ⚠️ **Acá decía que la coincidencia con el plazo del QR «no es casualidad», y
 * SÍ lo es.** Son dos ejes distintos y cada archivo declara el suyo: aquél mide
 * lo que dura un evento y su cola de subidas —y desde que el plan existe ni
 * siquiera es un número solo, porque un código nace con 30 o con 180 días según
 * el plan de quien creó el álbum—, y éste el ciclo con el que factura el
 * proveedor de media. El día que se cambie el plan del proveedor este número se
 * mueve y el del QR NO, y al revés. Escribir uno en función del otro ataría dos
 * decisiones que no tienen nada que ver, que es la clase de acople que después
 * nadie puede desarmar.
 *
 * ── POR QUÉ ESTE ARREGLO NACE ACÁ Y NO EN LA VERSIONADA ────────────────────
 * Porque allá esta constante NO EXISTE. Se publicó con el resto de la cuota de
 * bytes y se retiró en la misma ola, porque su EMISOR no aterrizaba: la mitad
 * del api que la lee necesita este paquete pineado, o sea el tag cortado
 * primero. ORDEN §8 lo dice —un tope o un código sin consumidor no se publica—,
 * así que la mitad que depende del contrato se queda en esta línea y se escribe,
 * que es lo que CLAUDE.md §19 manda cuando el trabajo se parte en dos.
 */
export const DOWNLOAD_QUOTA_WINDOW_DAYS = 30;
