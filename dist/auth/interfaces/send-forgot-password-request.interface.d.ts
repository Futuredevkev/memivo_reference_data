import type { LanguageCode } from '../../common';
import type { EmailRequest } from './email-request.interface';
/**
 * El body de `POST /auth/send-forgot-password`, con el idioma de QUIEN PIDE (H6).
 *
 * ── EL DEFECTO QUE CIERRA ──────────────────────────────────────────────────
 * Ese endpoint le manda un mail a una dirección que NO tiene cuenta —el aviso
 * que explica por qué no va a llegar ningún código, y que es la mitad que
 * empareja el reloj entre los dos caminos—. Era el único mail al usuario que
 * salía SIEMPRE en inglés: los demás sacan el idioma de `user.profile.language`,
 * y acá no hay perfil del que sacarlo. Las claves de `passwordResetNoAccount`
 * traducidas a es y a pt eran, por eso, copy que ningún destinatario podía leer.
 *
 * El dato que faltaba no es el de la cuenta inexistente sino el del emisor, y
 * ése lo tiene la app. Por eso viaja en el body y no se deduce del servidor.
 *
 * ── POR QUÉ ES UN SÍMBOLO PROPIO Y NO UN CAMPO EN `EmailRequest` ───────────
 * Porque `ResetPasswordRequest extends EmailRequest`, y colgar `language` de la
 * base se lo regala también a `POST /auth/reset-password`, que NO lo usa ni lo
 * puede usar: ahí la cuenta existe y su mail sale en el idioma del PERFIL, a
 * propósito —usar el del pedido haría que alguien con el perfil en portugués
 * reciba su código en el idioma del teléfono de quien tipeó su dirección—. Un
 * contrato que declara un campo que ese endpoint ignora es la misma clase de
 * mentira que H6 vino a sacar, movida de lugar.
 *
 * Y no es sólo semántico, se midió: con `language` en la base,
 * `dto-implements-its-contract.spec.ts` reporta a `ForgotPasswordDto` —que
 * implementa `ResetPasswordRequest`— por no declarar una clave que no debería
 * declarar nunca. El símbolo propio deja esa herencia intacta.
 *
 * ── ALCANCE, DECLARADO ─────────────────────────────────────────────────────
 * Esto declara la FORMA, no el envío. QUIÉN completa el campo no se escribe acá
 * —sería un cardinal a mano que se pudre—: lo contesta el grep de
 * `sendForgotPassword` en cada consumidor. El que lo omita hace que el aviso
 * salga en el idioma por default, que es justo el desenlace único que este campo
 * existe para romper.
 *
 * Opcional a propósito, en los dos sentidos: con `whitelist` +
 * `forbidNonWhitelisted` un campo que ningún DTO declara tumba el pedido con
 * 400, y uno declarado pero ausente simplemente no llega. Un consumidor que no
 * lo manda recupera la contraseña igual, como hasta ahora.
 */
export interface SendForgotPasswordRequest extends EmailRequest {
    language?: LanguageCode;
}
