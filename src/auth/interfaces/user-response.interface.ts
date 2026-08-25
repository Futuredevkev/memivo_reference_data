import type { LanguageCode } from '../../common';
import type { IsoCountryCode } from '../../reference-data';
import type { EmailActionRequired } from '../enums';
import type { UserAvatarFile } from './user-avatar-file.interface';
import type { UserRole } from './user-role.interface';

export interface UserResponse<TTimestamp = string> {
  id: string;
  name: string;
  lastName: string;
  email: string;
  twoFactorEnabled: boolean;
  notificationsEnabled: boolean;
  created_at?: TTimestamp;
  roles?: UserRole[];
  avatar?: UserAvatarFile;
  instagram?: string[];
  linkedin?: string[];
  /**
   * `null` cuando el dueño lo borró (bloque 36, H-306). Declararlo sólo
   * opcional era la mentira que el bloque 23 desarmó en otros cinco sitios: la
   * columna es nullable y el mapper la copia tal cual, así que el cable lleva
   * `null` y el contrato decía que no podía.
   */
  phone?: string | null;
  isPhonePublic?: boolean;
  /**
   * FECHA SIN HORA, Y POR ESO NO ENTRA EN `TTimestamp`.
   *
   * Estaba declarada con el genérico por copia de `created_at`, y los dos no
   * son la misma cosa: `created_at` sale de una columna `timestamp` que el
   * ORM del servidor SÍ hidrata a `Date`, y por eso el genérico existe. Ésta
   * sale de una columna `date`, que ningún lado hidrata: viaja y se lee como
   * `YYYY-MM-DD` en los dos repos. El genérico le daba permiso al servidor
   * para declararla `Date`, y lo usó: sus dos DTOs de respuesta dicen `Date`
   * sobre un valor que en runtime es `string`. El mapa de timestamps de wire
   * (`transport-timestamp-from-wire-key-map`) nunca la nombró, que es la otra
   * mitad de la prueba de que no es un timestamp de transporte.
   */
  birthDate?: string;
  language?: LanguageCode;
  country?: IsoCountryCode;
  emailActionRequired?: EmailActionRequired | null;
}
