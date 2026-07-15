export interface BlockedUserSummary<TTimestamp = string> {
  id: string;
  name: string;
  lastName: string;
  avatarUrl: string | null;
  blockedAt: TTimestamp;
}
