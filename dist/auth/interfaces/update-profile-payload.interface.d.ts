import type { LanguageCode } from '../../common';
import type { IsoCountryCode } from '../../reference-data';
export interface UpdateProfilePayload {
    name?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    currentPassword?: string;
    totp?: string;
    instagram?: string[];
    linkedin?: string[];
    phone?: string;
    isPhonePublic?: boolean;
    birthDate?: string;
    language?: LanguageCode;
    country?: IsoCountryCode;
    acceptedTerms?: boolean;
}
