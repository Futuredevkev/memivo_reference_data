export declare const CHAT_SOCKET_EVENTS: {
    readonly IN: {
        readonly JOIN_GROUP: "join-group";
        readonly LEAVE_GROUP: "leave-group";
    };
    readonly OUT: {
        readonly JOIN_SUCCESS: "joined";
        readonly JOIN_ERROR: "join-error";
        readonly NEW_MESSAGE: "new-message";
        readonly MESSAGE_UPDATED: "message-updated";
        readonly MESSAGE_DELETED: "message-deleted";
        readonly USER_JOINED: "user-joined";
        readonly USER_LEFT: "user-left";
        readonly USER_KICKED: "user-kicked";
        readonly MEMBER_PROMOTED: "member-promoted";
        readonly MEMBER_DEMOTED: "member-demoted";
        readonly POLL_ACTIVE: "poll-active";
        readonly POLL_UPDATED: "poll-updated";
        readonly POLL_ENDED: "poll-ended";
        readonly GROUP_DELETED: "group-deleted";
        readonly GROUP_UPDATED: "group-updated";
        readonly MESSAGE_PINNED: "message-pinned";
        readonly MESSAGE_UNPINNED: "message-unpinned";
        readonly NEW_MESSAGE_RECEIVED: "new-message-received";
        readonly GROUP_CREATED_RECEIVED: "group-created-received";
        readonly GROUP_DELETED_RECEIVED: "group-deleted-received";
        readonly USER_KICKED_RECEIVED: "user-kicked-received";
        readonly ALBUM_ACCESS_REVOKED: "album-chat-access-revoked";
        readonly GROUP_UPDATED_RECEIVED: "group-updated-received";
        readonly REACTION_UPDATED: "reaction-updated";
        readonly VIEW_ONCE_OPENED: "view-once-opened";
        readonly VIEW_ONCE_EXPIRED: "view-once-expired";
        readonly LIVE_LOCATION_UPDATED: "live-location-updated";
        readonly LIVE_LOCATION_ENDED: "live-location-ended";
    };
};
