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
  phone?: string;
  birthDate?: TTimestamp;
  country?: IsoCountryCode;
}
