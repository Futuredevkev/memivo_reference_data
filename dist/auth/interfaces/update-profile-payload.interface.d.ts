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
    phone?: string;
    isPhonePublic?: boolean;
    language?: LanguageCode;
    acceptedTerms?: boolean;
}
