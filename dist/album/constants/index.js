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
exports.isValidFolderName = exports.FOLDER_NAME_PATTERN = exports.FOLDER_NAME_FORBIDDEN_CHARACTERS = void 0;
__exportStar(require("./album-link-paths.constant"), exports);
__exportStar(require("./album-link-patterns.constant"), exports);
__exportStar(require("./build-album-link-path.helper"), exports);
var folder_name_rules_constant_1 = require("./folder-name-rules.constant");
Object.defineProperty(exports, "FOLDER_NAME_FORBIDDEN_CHARACTERS", { enumerable: true, get: function () { return folder_name_rules_constant_1.FOLDER_NAME_FORBIDDEN_CHARACTERS; } });
Object.defineProperty(exports, "FOLDER_NAME_PATTERN", { enumerable: true, get: function () { return folder_name_rules_constant_1.FOLDER_NAME_PATTERN; } });
Object.defineProperty(exports, "isValidFolderName", { enumerable: true, get: function () { return folder_name_rules_constant_1.isValidFolderName; } });
