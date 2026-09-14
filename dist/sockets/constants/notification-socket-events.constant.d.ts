export declare const NOTIFICATION_SOCKET_EVENTS: {
    readonly IN: {
        readonly UPDATE_ACTIVE_VIEW: "update-active-view";
    };
    readonly OUT: {
        /**
         * Una notificación de la campanita, NUEVA o REFRESCADA. Un hecho que se
         * repite dentro de la ventana de dedup del servidor no crea otra fila:
         * actualiza la que hay —misma `id`, metadata del último hecho, otra vez no
         * leída— y la reemite por este evento. El receptor la reemplaza por `id`, en
         * su lugar (el servidor no le mueve `created_at`); ignorar una `id` ya vista
         * deja la campanita llevando al primer hecho.
         */
        readonly NEW_NOTIFICATION: "notification";
        readonly FORCED_LOGOUT: "forced-logout";
        /** Ver {@link HiddenIdsChangedPayload}: el receptor tiene que re-hidratar su set de ocultos. */
        readonly HIDDEN_IDS_CHANGED: "hidden-ids-changed";
    };
};
