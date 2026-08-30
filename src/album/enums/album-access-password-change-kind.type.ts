import { ALBUM_ACCESS_PASSWORD_CHANGE_KINDS } from './album-access-password-change-kinds.constant';

/**
 * QUÉ LE PASÓ a la contraseña de acceso de un álbum. Son TRES desenlaces, y el
 * registro de actividad los tiene que poder distinguir.
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * El log guardaba un booleano —`hasAccessPassword`— y el cliente elegía entre
 * dos frases con un ternario. Pero ese booleano vale `true` tanto cuando la
 * contraseña se CREA como cuando se REEMPLAZA, así que cambiarla quedaba
 * registrada como «activó la contraseña de acceso», que no fue lo que pasó.
 *
 * Y el borde era peor: con un `detail` ausente, el `?.` caía en la rama del
 * `false` y el registro afirmaba «quitó la contraseña de acceso» — la frase
 * CONTRARIA a la que correspondía.
 *
 * El servidor es el único que sabe cuál de los tres fue, porque es el único que
 * ve el estado anterior dentro de la transacción. Por eso viaja el desenlace y
 * no el booleano del que había que deducirlo.
 */
export type AlbumAccessPasswordChangeKind =
  (typeof ALBUM_ACCESS_PASSWORD_CHANGE_KINDS)[number];
