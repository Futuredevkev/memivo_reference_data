export declare const NOTIFICATION_SOCKET_EVENTS: {
    readonly IN: {
        readonly UPDATE_ACTIVE_VIEW: "update-active-view";
    };
    readonly OUT: {
        readonly NEW_NOTIFICATION: "notification";
        readonly FORCED_LOGOUT: "forced-logout";
        /** Ver {@link HiddenIdsChangedPayload}: el receptor tiene que re-hidratar su set de ocultos. */
        readonly HIDDEN_IDS_CHANGED: "hidden-ids-changed";
    };
};
