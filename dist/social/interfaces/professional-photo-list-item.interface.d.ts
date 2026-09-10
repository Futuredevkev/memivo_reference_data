import type { PhotoFile } from './internal/photo-file.interface';
import type { SocialAuthor } from './social-author.interface';
export interface ProfessionalPhotoListItem<TTimestamp = string> {
    id: string;
    url: string;
    thumbnailUrl: string | null;
    created_at: TTimestamp;
    /**
     * El asset detrás de la foto. Requerido, y eso CAMBIÓ en esta ola.
     *
     * ── POR QUÉ DEJÓ DE SER OPCIONAL ──────────────────────────────────────
     * Era opcional y su rama vacía no la podía alcanzar producción: `photos`
     * declara `fileId` no nulo con FK a `file(id)`, y los dos únicos caminos que
     * producen esta forma joinean la relación. O sea que el `undefined` sólo
     * describía un `select` que nadie escribe — la clase de código muerto que
     * ORDEN §7 llama la más peligrosa, porque ningún gate ve una rama muerta.
     *
     * ── Y PORQUE LO OPCIONAL SE PROPAGABA AL VEREDICTO ────────────────────
     * `PhotoFile` compone `MediaAvailability`, así que este campo es por dónde
     * llega «esta pieza ya no está». Con `file?`, el traductor del cliente
     * tendría que aceptar `undefined` y contestar «no se sabe» — o sea que
     * olvidarse de pasar la pieza volvería a compilar, que es exactamente el
     * defecto que el campo requerido existe para cerrar, un nivel más arriba.
     */
    file: PhotoFile;
    /**
     * Quién subió la foto, o `null` si no se sabe.
     *
     * ── EL DEFECTO QUE CIERRA ─────────────────────────────────────────────
     * La foto profesional era la única pieza moderable del producto que
     * viajaba SIN autor, y sin autor no hay a quién reportar: el reporte se
     * crea contra una PERSONA —lo dicen los Términos §7 y lo exige
     * `reportedUserId`—, así que la carpeta era la única superficie donde el ⋯
     * no podía ofrecer «Reportar» aunque la pieza fuera reportable.
     *
     * ── POR QUÉ `SocialAuthor` Y NO UN SHAPE PROPIO ───────────────────────
     * Es el único autor que este paquete publica, y es el que ya viaja con
     * toda pieza social que tiene uno. Un `{ id, name, lastName }` a medida
     * sería un segundo modo de decir «autor» para ahorrarse un avatar, y quien
     * lo recibe lo dibuja con el mismo componente que a los demás.
     *
     * ── POR QUÉ NULLABLE Y NO OPCIONAL ────────────────────────────────────
     * `photos.userId` es `nullable: true` en la base y no hay CHECK que lo ate
     * al tipo de foto, así que el `| null` **no es defensivo: es lo que la
     * base puede devolver** — es la misma decisión, con las mismas palabras,
     * que ya está escrita en la entidad. Y la clave va obligatoria para que el
     * mapper del api tenga que resolverla en vez de omitirla en silencio: lo
     * que se admite es no CONOCER al autor, no olvidarse de mandarlo.
     */
    user: SocialAuthor | null;
}
