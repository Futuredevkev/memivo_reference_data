export interface ForcedLogoutPayload {
  reason: 'banned' | 'session-closed' | 'account-deleted';
  isPermanent?: boolean;
  expiresAt?: string | null;
}
