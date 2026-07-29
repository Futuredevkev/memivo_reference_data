import type { IsoCountryCode } from '../../reference-data';
import type { UserAvatarFile } from './user-avatar-file.interface';
import type { UserRole } from './user-role.interface';

export interface PublicUserResponse<TTimestamp = string> {
  id: string;
  name: string;
  lastName: string;
  created_at?: TTimestamp;
  roles?: UserRole[];
  avatar?: UserAvatarFile;
  instagram?: string[];
  linkedin?: string[];
  /** `null` cuando no hay teléfono cargado o el dueño lo borró (D-27). */
  phone?: string | null;
  birthDate?: TTimestamp;
  country?: IsoCountryCode;
}
