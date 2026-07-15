"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAT_VIDEO_MAX_FILE_SIZE_BYTES = void 0;
const enums_1 = require("../enums");
const resource_upload_limits_constant_1 = require("./resource-upload-limits.constant");
exports.CHAT_VIDEO_MAX_FILE_SIZE_BYTES = resource_upload_limits_constant_1.RESOURCE_UPLOAD_LIMITS[enums_1.ResourceType.CHAT_VIDEO].maxFileSize;
