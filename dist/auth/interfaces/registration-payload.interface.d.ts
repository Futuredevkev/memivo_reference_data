import type { LanguageCode } from '../../common';
import type { IsoCountryCode } from '../../reference-data';
import type { LoginCredentials } from './login-credentials.interface';
/**
 * El alta NO lleva teléfono (D-27).
 *
 * Se sacó del payload en vez de dejarlo opcional: un campo que ninguna pantalla
 * arma es superficie muerta que invita a volver a pedirlo. El teléfono se carga
 * desde el perfil, con su propio toggle de visibilidad (`isPhonePublic`), y se
 * puede quitar — que era lo que H-306 reportaba como imposible.
 *
 * `birthDate` NO cambia: sigue siendo obligatorio en el alta y visible en el
 * perfil público.
 */
export interface RegistrationPayload extends LoginCredentials {
    name: string;
    lastName: string;
    confirmPassword: string;
    birthDate: string;
    language?: LanguageCode;
    country: IsoCountryCode;
    acceptedTerms: boolean;
}
