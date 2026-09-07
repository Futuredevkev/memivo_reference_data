/**
 * Lo que viaja en el cuerpo al poner o cambiar la marca de un álbum.
 *
 * Va con el archivo del logo en la MISMA request multipart, así que el campo
 * llega como texto y no como JSON — el DTO del api es quien lo valida como
 * UUID.
 *
 * ── POR QUÉ EL ACREDITADO ES UN ID Y NO UN TEXTO LIBRE ───────────────────
 * Porque la marca acredita a alguien que **administra ese álbum**, y eso es
 * verificable: el servidor comprueba que la persona sea organizadora de ESE
 * álbum antes de escribir nada. Con un texto libre, la portada de un
 * casamiento podría decir cualquier cosa —incluido el nombre de un estudio
 * ajeno— y el producto no tendría cómo desmentirlo.
 *
 * ── LO QUE NO LLEVA, Y ES DELIBERADO ────────────────────────────────────
 * No lleva el plan, ni el tier, ni ninguna forma de «tengo derecho a esto».
 * Eso lo decide el servidor contra el plan de quien CREÓ el álbum, y hay gate
 * que lo exige (`client-never-declares-authority`).
 */
export interface SetAlbumBrandingRequest {
    /** La persona a acreditar. Tiene que ser organizadora de ese álbum. */
    brandingUserId: string;
}
