"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthErrorCode = void 0;
/**
 * Códigos de error del login social (Google / Apple).
 */
var OAuthErrorCode;
(function (OAuthErrorCode) {
    // Verificación del id_token del provider
    OAuthErrorCode["OAUTH_TOKEN_INVALID"] = "OAUTH_TOKEN_INVALID";
    OAuthErrorCode["OAUTH_PROVIDER_UNAVAILABLE"] = "OAUTH_PROVIDER_UNAVAILABLE";
    OAuthErrorCode["OAUTH_VERIFICATION_FAILED"] = "OAUTH_VERIFICATION_FAILED";
    OAuthErrorCode["OAUTH_EMAIL_NOT_VERIFIED"] = "OAUTH_EMAIL_NOT_VERIFIED";
    // Resolución / linking de cuenta
    // (provider, subject) ya vinculado a OTRA cuenta (case X).
    OAuthErrorCode["OAUTH_IDENTITY_ALREADY_LINKED"] = "OAUTH_IDENTITY_ALREADY_LINKED";
    // El usuario YA tiene ese provider conectado a su PROPIA cuenta (colisión de
    // UNIQUE(userId, provider), no de (provider, subject)). Mensaje distinto.
    OAuthErrorCode["OAUTH_PROVIDER_ALREADY_CONNECTED"] = "OAUTH_PROVIDER_ALREADY_CONNECTED";
    OAuthErrorCode["OAUTH_IDENTITY_NOT_FOUND"] = "OAUTH_IDENTITY_NOT_FOUND";
    OAuthErrorCode["OAUTH_CANNOT_REMOVE_ONLY_METHOD"] = "OAUTH_CANNOT_REMOVE_ONLY_METHOD";
    // Onboarding ticket (signup incompleto)
    OAuthErrorCode["OAUTH_ONBOARDING_TICKET_INVALID"] = "OAUTH_ONBOARDING_TICKET_INVALID";
    OAuthErrorCode["OAUTH_ONBOARDING_TICKET_EXPIRED"] = "OAUTH_ONBOARDING_TICKET_EXPIRED";
    // Server-to-server notifications de Apple
    OAuthErrorCode["OAUTH_APPLE_NOTIFICATION_INVALID"] = "OAUTH_APPLE_NOTIFICATION_INVALID";
})(OAuthErrorCode || (exports.OAuthErrorCode = OAuthErrorCode = {}));
