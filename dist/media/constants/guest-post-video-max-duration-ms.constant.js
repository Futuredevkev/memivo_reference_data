"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUEST_POST_VIDEO_MAX_DURATION_MS = void 0;
const enums_1 = require("../enums");
const resource_upload_limits_constant_1 = require("./resource-upload-limits.constant");
exports.GUEST_POST_VIDEO_MAX_DURATION_MS = resource_upload_limits_constant_1.RESOURCE_UPLOAD_LIMITS[enums_1.ResourceType.GUEST_VIDEO].maxDurationSeconds * 1000;
