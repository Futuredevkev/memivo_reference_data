import type { LanguageCode } from '../../common';

/**
 * `birthDate` y `country` NO están acá a propósito (decisión 29 + H-090).
 *
 * El servidor los aceptaba, los validaba y los persistía, y ninguna pantalla de
 * edición los arma: se fijan al registrarse y son inmutables por decisión de
 * producto. Un contrato que declara un campo que nadie puede mandar es una
 * mentira que invita a implementar la pantalla que no queremos.
 */
export interface UpdateProfilePayload {
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  totp?: string;
  instagram?: string[];
  linkedin?: string[];
  /**
   * `null` BORRA el teléfono; omitirlo lo deja como está (bloque 36, H-306).
   *
   * Un teléfono guardado no se podía quitar nunca: el cliente deshabilitaba
   * Guardar y omitía el campo, y el DTO del servidor tampoco aceptaba vaciarlo.
   * Lo único que se podía hacer era ponerlo en privado, no eliminarlo — en una
   * red social privada donde el teléfono se comparte con los invitados del
   * álbum.
   */
  phone?: string | null;
  isPhonePublic?: boolean;
  language?: LanguageCode;
  acceptedTerms?: boolean;
}
