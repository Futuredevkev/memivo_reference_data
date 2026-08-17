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
 *
 * El alta TAMPOCO lleva `confirmPassword` (P6). Confirmar la contraseña es un
 * patrón anterior al ojo de «mostrar contraseña»: el campo existía para atrapar
 * un typo que hoy el usuario ve mientras escribe, y el único error que podía
 * evitar —quedarse afuera de la cuenta recién creada— ya lo cierra la
 * recuperación por email. Sacarlo del CONTRATO y no sólo de la pantalla es lo
 * que impide que vuelva por la puerta del servidor: mientras el campo siguiera
 * declarado acá, `CreateUserDto` lo exigía y cualquier cliente nuevo tenía que
 * inventar un valor para poder registrar a alguien.
 */
export interface RegistrationPayload extends LoginCredentials {
  name: string;
  lastName: string;
  birthDate: string;
  language?: LanguageCode;
  country: IsoCountryCode;
  acceptedTerms: boolean;
}
