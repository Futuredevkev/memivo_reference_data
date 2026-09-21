/**
 * QUÉ CLASE DE PIEZA se está pidiendo de una carpeta profesional.
 *
 * ── POR QUÉ EXISTE ────────────────────────────────────────────────────────
 * Hasta que apareció el video profesional, una carpeta tenía UNA sola clase de
 * pieza y no había nada que elegir. Con dos, la grilla necesita un filtro — y
 * el filtro tiene que viajar al SERVIDOR: filtrar en el teléfono la página que
 * ya se cargó rompe la paginación por cursor y da un contador mentiroso, que es
 * exactamente lo que el estándar del proyecto prohíbe.
 *
 * ── POR QUÉ ESTE ENUM Y NO `ResourceType` DIRECTO ─────────────────────────
 * Porque son dos vocabularios con dueños distintos. `ResourceType` es cómo se
 * ALMACENA la pieza —de él cuelgan el pipeline de subida, la transformación de
 * entrega y el `resource_type` con el que se borra—, y hacerlo viajar como
 * valor de filtro ataría la URL de una pantalla a una decisión de
 * almacenamiento: el día que el video profesional se partiera en dos recursos,
 * el filtro de la pantalla cambiaría de valores sin que la pantalla hubiera
 * cambiado. Acá viaja el EJE QUE LA PERSONA ELIGE, y la correspondencia con el
 * almacenamiento la resuelve el api en una tabla total.
 *
 * ── «TODO» NO ES UN MIEMBRO, Y ES DELIBERADO ──────────────────────────────
 * La ausencia de filtro se expresa omitiendo el parámetro, igual que en la
 * galería de multimedia del chat. Un miembro `ALL` obligaría al servidor a
 * traducirlo a «no filtres» en cada consulta —una rama que hay que acordarse de
 * escribir— y dejaría un valor del enum que ninguna fila de la base puede
 * tener. El estado «todo» es del cliente, que lo modela con su propio tipo.
 *
 * ── EL NOMBRE ESQUIVA UNA COLISIÓN MEDIDA ─────────────────────────────────
 * En esta base «filtro» ya nombra DOS cosas: el efecto visual de la cámara
 * (`MediaFilterId`, prohibido en lo profesional) y la pestaña de la galería del
 * chat (`MediaGalleryFilter`). Un tercer `…Filter` sobre media habría entrado
 * justo en el medio de esos dos. «Pieza» es la palabra con la que el registro
 * de esta ola nombra lo que vive en una carpeta, y no la usa nadie más.
 *
 * ── ⚠️ LOS VALORES LLEVAN EL PREFIJO DE SU DOMINIO, Y NO ES DECORACIÓN ────
 * Nacieron como `'photo'` y `'video'` a secas, y el auditor de literales crudos
 * del paquete lo puso rojo con **123 sitios**: `'video'` es una de las cadenas
 * más comunes del árbol —el `type` de un asset del selector, la clase de un
 * mensaje de chat, el `resource_type` de Cloudinary— y publicarla como valor de
 * un enum convierte a cada una de esas en una sospecha de literal sin dueño.
 *
 * El costo no es sólo el ruido del instrumento: un valor de enum que coincide
 * con una cadena de otro dominio es exactamente cómo dos conceptos terminan
 * «unificados por parecido». Con el prefijo, el valor dice de qué habla y no
 * choca con nada.
 */
export declare enum FolderPieceKind {
    PHOTO = "folder_photo",
    VIDEO = "folder_video"
}
