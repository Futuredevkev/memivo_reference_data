"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserErrorCode = void 0;
/**
 * Códigos de error del módulo de usuarios
 */
var UserErrorCode;
(function (UserErrorCode) {
    UserErrorCode["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    UserErrorCode["USER_BANNED"] = "USER_BANNED";
    UserErrorCode["USER_NO_CHANGES"] = "USER_NO_CHANGES";
    UserErrorCode["USER_PENDING_UPDATE_NOT_FOUND"] = "USER_PENDING_UPDATE_NOT_FOUND";
    /**
     * El cambio de perfil pendiente venció. **No es que venció el código.**
     *
     * Ese camino tiraba `AUTH_CODE_EXPIRED`, y la frase de ese código dice
     * «pedí uno nuevo» — un remedio que acá está cerrado por construcción: el
     * reenvío valida el pending ANTES de reemitir, así que devuelve el MISMO
     * código. La pantalla dibujaba el botón de reenviar y la persona recibía la
     * misma frase, para siempre.
     *
     * Su hermano de nueve líneas arriba ya tenía código propio para el pending
     * que no existe; al que se vence le faltaba. Ahora son simétricos.
     */
    UserErrorCode["USER_PENDING_UPDATE_EXPIRED"] = "USER_PENDING_UPDATE_EXPIRED";
    /** La cuenta NO tiene contraseña seteada (cuenta legacy / sólo social). Usaba
     * `USER_INVALID_PASSWORD`, así que se le decía «la contraseña es incorrecta»
     * a quien no tiene ninguna: reintentaba para siempre. */
    UserErrorCode["USER_PASSWORD_NOT_SET"] = "USER_PASSWORD_NOT_SET";
    UserErrorCode["USER_PHONE_TAKEN"] = "USER_PHONE_TAKEN";
    UserErrorCode["USER_UPDATE_DEVICE_LOCALE_FAILED"] = "USER_UPDATE_DEVICE_LOCALE_FAILED";
    UserErrorCode["USER_DELETE_FAILED"] = "USER_DELETE_FAILED";
    UserErrorCode["USER_ALREADY_BANNED"] = "USER_ALREADY_BANNED";
    UserErrorCode["USER_NOT_BANNED"] = "USER_NOT_BANNED";
    UserErrorCode["USER_BAN_FAILED"] = "USER_BAN_FAILED";
    UserErrorCode["USER_UNBAN_FAILED"] = "USER_UNBAN_FAILED";
    UserErrorCode["USER_BAN_INVALID_EXPIRES_AT"] = "USER_BAN_INVALID_EXPIRES_AT";
})(UserErrorCode || (exports.UserErrorCode = UserErrorCode = {}));
