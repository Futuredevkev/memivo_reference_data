import type { LanguageCode } from '../../common';
import type { IsoCountryCode } from '../../reference-data';
import type { LoginCredentials } from './login-credentials.interface';

export interface RegistrationPayload extends LoginCredentials {
  name: string;
  lastName: string;
  phone: string;
  confirmPassword: string;
  birthDate: string;
  language?: LanguageCode;
  country: IsoCountryCode;
  acceptedTerms: boolean;
}
