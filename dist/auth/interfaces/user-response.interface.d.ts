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
    phone?: string;
    isPhonePublic?: boolean;
    birthDate?: TTimestamp;
    language?: LanguageCode;
    country?: IsoCountryCode;
    emailActionRequired?: EmailActionRequired | null;
}
