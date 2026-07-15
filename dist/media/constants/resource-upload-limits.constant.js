"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESOURCE_UPLOAD_LIMITS = void 0;
const enums_1 = require("../enums");
const mb_constant_1 = require("./mb.constant");
exports.RESOURCE_UPLOAD_LIMITS = {
    [enums_1.ResourceType.AVATAR]: { maxFileSize: 5 * mb_constant_1.MB },
    [enums_1.ResourceType.CHAT_GROUP_AVATAR]: { maxFileSize: 5 * mb_constant_1.MB },
    [enums_1.ResourceType.ALBUM_COVER]: { maxFileSize: 5 * mb_constant_1.MB },
    [enums_1.ResourceType.PROFESSIONAL_PHOTO]: { maxFileSize: 15 * mb_constant_1.MB },
    [enums_1.ResourceType.GUEST_PHOTO]: { maxFileSize: 10 * mb_constant_1.MB },
    [enums_1.ResourceType.GUEST_VIDEO]: { maxFileSize: 100 * mb_constant_1.MB, maxDurationSeconds: 120 },
    [enums_1.ResourceType.CHAT_IMAGE]: { maxFileSize: 5 * mb_constant_1.MB },
    [enums_1.ResourceType.CHAT_VIDEO]: { maxFileSize: 100 * mb_constant_1.MB, maxDurationSeconds: 600 },
    [enums_1.ResourceType.CHAT_AUDIO]: { maxFileSize: 10 * mb_constant_1.MB, maxDurationSeconds: 240 },
    [enums_1.ResourceType.IMAGE_STORY]: { maxFileSize: 10 * mb_constant_1.MB },
    [enums_1.ResourceType.VIDEO_STORY]: { maxFileSize: 100 * mb_constant_1.MB, maxDurationSeconds: 60 },
    [enums_1.ResourceType.PROFILE_REPORT_SCREENSHOT]: { maxFileSize: 10 * mb_constant_1.MB },
};
