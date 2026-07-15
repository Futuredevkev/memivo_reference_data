export interface ChatMessageContextMeta {
  limit: number;
  hasOlder: boolean;
  olderCursor: string | null;
  hasNewer: boolean;
  newerCursor: string | null;
}
