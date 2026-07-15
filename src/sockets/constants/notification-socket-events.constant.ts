export const NOTIFICATION_SOCKET_EVENTS = {
  IN: {
    UPDATE_ACTIVE_VIEW: 'update-active-view',
  },
  OUT: {
    NEW_NOTIFICATION: 'notification',
    FORCED_LOGOUT: 'forced-logout',
  },
} as const;
