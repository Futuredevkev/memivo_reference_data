export interface PaginationMeta {
  limit: number;
  hasNextPage: boolean;
  nextCursor: string | null;
  total?: number;
}
