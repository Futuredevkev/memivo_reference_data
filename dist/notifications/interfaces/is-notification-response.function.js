"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotificationResponse = void 0;
const notification_type_values_constant_1 = require("./internal/notification-type-values.constant");
const isNotificationResponse = (value) => {
    if (!value || typeof value !== 'object')
        return false;
    return 'id' in value
        && typeof value.id === 'string'
        && 'type' in value
        && typeof value.type === 'string'
        && notification_type_values_constant_1.NOTIFICATION_TYPE_VALUES.has(value.type)
        && 'resourceId' in value
        && typeof value.resourceId === 'string'
        && 'isRead' in value
        && typeof value.isRead === 'boolean'
        && (('created_at' in value && typeof value.created_at === 'string')
            || ('createdAt' in value && typeof value.createdAt === 'string'));
};
exports.isNotificationResponse = isNotificationResponse;
