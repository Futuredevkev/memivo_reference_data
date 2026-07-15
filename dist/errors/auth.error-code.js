"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthErrorCode = void 0;
/**
 * Códigos de error del módulo de autenticación
 */
var AuthErrorCode;
(function (AuthErrorCode) {
    // Login & Credentials
    AuthErrorCode["AUTH_INVALID_CREDENTIALS"] = "AUTH_INVALID_CREDENTIALS";
    AuthErrorCode["AUTH_NOT_VERIFIED"] = "AUTH_NOT_VERIFIED";
    AuthErrorCode["AUTH_ALREADY_VERIFIED"] = "AUTH_ALREADY_VERIFIED";
    AuthErrorCode["LOGIN_FAILED"] = "LOGIN_FAILED";
    AuthErrorCode["LOGOUT_FAILED"] = "LOGOUT_FAILED";
    // Registration
    AuthErrorCode["AUTH_EMAIL_TAKEN"] = "AUTH_EMAIL_TAKEN";
    AuthErrorCode["AUTH_USER_UNDERAGE"] = "AUTH_USER_UNDERAGE";
    AuthErrorCode["USER_REGISTRATION_FAILED"] = "USER_REGISTRATION_FAILED";
    AuthErrorCode["AUTH_EMAIL_VALIDATION_FAILED"] = "AUTH_EMAIL_VALIDATION_FAILED";
    AuthErrorCode["AUTH_CODE_RESEND_FAILED"] = "AUTH_CODE_RESEND_FAILED";
    // Verification Codes
    AuthErrorCode["AUTH_CODE_EXPIRED"] = "AUTH_CODE_EXPIRED";
    AuthErrorCode["AUTH_CODE_INVALID"] = "AUTH_CODE_INVALID";
    // Two-Factor Authentication
    AuthErrorCode["AUTH_2FA_NOT_ENABLED"] = "AUTH_2FA_NOT_ENABLED";
    AuthErrorCode["AUTH_2FA_ALREADY_ENABLED"] = "AUTH_2FA_ALREADY_ENABLED";
    AuthErrorCode["AUTH_2FA_SETUP_EXPIRED"] = "AUTH_2FA_SETUP_EXPIRED";
    // Password
    AuthErrorCode["AUTH_PASSWORD_EMPTY"] = "AUTH_PASSWORD_EMPTY";
    AuthErrorCode["AUTH_PASSWORD_CONFIRMATION_REQUIRED"] = "AUTH_PASSWORD_CONFIRMATION_REQUIRED";
    AuthErrorCode["AUTH_PASSWORD_TOO_LONG"] = "AUTH_PASSWORD_TOO_LONG";
    // Tokens & Sessions
    AuthErrorCode["AUTH_TOKEN_INVALID"] = "AUTH_TOKEN_INVALID";
    AuthErrorCode["AUTH_TOKEN_MALFORMED"] = "AUTH_TOKEN_MALFORMED";
    AuthErrorCode["AUTH_ACCESS_DENIED"] = "AUTH_ACCESS_DENIED";
    AuthErrorCode["AUTH_SESSION_NOT_FOUND"] = "AUTH_SESSION_NOT_FOUND";
})(AuthErrorCode || (exports.AuthErrorCode = AuthErrorCode = {}));
