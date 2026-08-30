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
    /**
     * `string` y NO `TTimestamp`, igual que en `UserResponse`.
     *
     * Su gemela ya se había angostado con el motivo escrito —es un DÍA DEL
     * CALENDARIO en `YYYY-MM-DD`, no un instante— y ésta se quedó con el
     * genérico. Que dos interfaces hermanas contesten distinto sobre el MISMO
     * campo de la MISMA columna es el defecto de §1: el genérico le daba permiso
     * al servidor para declararla `Date`, y lo usó — sus dos DTOs de respuesta
     * decían `Date` sobre un valor que en runtime es una cadena, porque el driver
     * devuelve así las columnas `date` de Postgres.
     *
     * La prueba de que no es un timestamp de transporte es la misma para las dos:
     * `transport-timestamp-from-wire-key-map` nunca la nombró.
     */
    birthDate?: string;
    country?: IsoCountryCode;
}
