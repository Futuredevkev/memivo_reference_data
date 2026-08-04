"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidFolderName = exports.FOLDER_NAME_PATTERN = exports.FOLDER_NAME_FORBIDDEN_CHARACTERS = exports.ALBUM_PASSWORD_TYPE_INVALID_CODE = exports.ALBUM_PASSWORD_TOO_SHORT_CODE = exports.ALBUM_PASSWORD_TOO_LONG_CODE = void 0;
var album_password_too_long_code_constant_1 = require("./album-password-too-long-code.constant");
Object.defineProperty(exports, "ALBUM_PASSWORD_TOO_LONG_CODE", { enumerable: true, get: function () { return album_password_too_long_code_constant_1.ALBUM_PASSWORD_TOO_LONG_CODE; } });
var album_password_too_short_code_constant_1 = require("./album-password-too-short-code.constant");
Object.defineProperty(exports, "ALBUM_PASSWORD_TOO_SHORT_CODE", { enumerable: true, get: function () { return album_password_too_short_code_constant_1.ALBUM_PASSWORD_TOO_SHORT_CODE; } });
var album_password_type_invalid_code_constant_1 = require("./album-password-type-invalid-code.constant");
Object.defineProperty(exports, "ALBUM_PASSWORD_TYPE_INVALID_CODE", { enumerable: true, get: function () { return album_password_type_invalid_code_constant_1.ALBUM_PASSWORD_TYPE_INVALID_CODE; } });
__exportStar(require("./album-link-paths.constant"), exports);
__exportStar(require("./album-link-patterns.constant"), exports);
__exportStar(require("./build-album-link-path.helper"), exports);
var folder_name_rules_constant_1 = require("./folder-name-rules.constant");
Object.defineProperty(exports, "FOLDER_NAME_FORBIDDEN_CHARACTERS", { enumerable: true, get: function () { return folder_name_rules_constant_1.FOLDER_NAME_FORBIDDEN_CHARACTERS; } });
Object.defineProperty(exports, "FOLDER_NAME_PATTERN", { enumerable: true, get: function () { return folder_name_rules_constant_1.FOLDER_NAME_PATTERN; } });
Object.defineProperty(exports, "isValidFolderName", { enumerable: true, get: function () { return folder_name_rules_constant_1.isValidFolderName; } });
