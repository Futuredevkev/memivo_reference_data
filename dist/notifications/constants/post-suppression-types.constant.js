"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST_SUPPRESSION_TYPES = void 0;
const enums_1 = require("../enums");
exports.POST_SUPPRESSION_TYPES = [
    enums_1.NotificationType.LIKE_PHOTO,
    enums_1.NotificationType.COMMENT_PHOTO,
    enums_1.NotificationType.REPLY_COMMENT,
    enums_1.NotificationType.REACTION_COMMENT,
    enums_1.NotificationType.REACTION_RESPONSE,
    enums_1.NotificationType.TAGGED_IN_PHOTO,
];
