"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION_SOCKET_EVENTS = void 0;
exports.NOTIFICATION_SOCKET_EVENTS = {
    IN: {
        UPDATE_ACTIVE_VIEW: 'update-active-view',
    },
    OUT: {
        NEW_NOTIFICATION: 'notification',
        FORCED_LOGOUT: 'forced-logout',
        /** Ver {@link HiddenIdsChangedPayload}: el receptor tiene que re-hidratar su set de ocultos. */
        HIDDEN_IDS_CHANGED: 'hidden-ids-changed',
    },
};
