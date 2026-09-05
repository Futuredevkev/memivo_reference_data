import type { ForwardableErrorFields } from '../../errors';
import type { FORCED_LOGOUT_BAN_FIELDS } from '../constants/forced-logout-ban-fields.constant';
/**
 * Lo que el servidor manda por el canal de presencia para que la app se
 * desloguee AL INSTANTE, sin esperar al próximo request.
 *
 * ── POR QUÉ LA MITAD DEL BANEO SE DERIVA DEL SOBRE ────────────────────────
 * Porque el cliente, al recibir un `reason: 'banned'`, ARMA un sobre de error
 * sintético con estos campos y lo pasa por la misma resolución que el 403 del
 * HTTP: es la segunda boca del mismo hecho. Escribir los nombres a mano acá los
 * convertía en una segunda declaración de qué campos tiene el sobre, y las dos
 * ya divergieron una vez —el sobre ganó `reasonCategory` y este payload se
 * quedó mudo, así que el cartel EN VIVO no decía el motivo y el 403 sí—.
 *
 * Derivados de [FORCED_LOGOUT_BAN_FIELDS] sobre `ForwardableErrorFields`, un
 * nombre que el sobre no declare —o con un typo— no compila, y el conjunto se
 * puede comparar en runtime contra el mapa que decide qué publica cada código.
 * Esa comparación vive en el api, que es el único lado que tiene los dos datos.
 *
 * Los tres campos siguen siendo OPCIONALES: los emisores `session-closed` y
 * `account-deleted` no los mandan, y no tienen por qué enterarse.
 */
export interface ForcedLogoutPayload extends Partial<Pick<ForwardableErrorFields, (typeof FORCED_LOGOUT_BAN_FIELDS)[number]>> {
    reason: 'banned' | 'session-closed' | 'account-deleted';
}
