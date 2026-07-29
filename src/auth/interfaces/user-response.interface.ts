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
  isActive: boolean;
  isRegisterVerified: boolean;
  twoFactorEnabled: boolean;
  notificationsEnabled: boolean;
  lastActiveAt?: TTimestamp;
  created_at?: TTimestamp;
  updated_at?: TTimestamp;
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
  birthDate?: TTimestamp;
  language?: LanguageCode;
  country?: IsoCountryCode;
  emailActionRequired?: EmailActionRequired | null;
}
