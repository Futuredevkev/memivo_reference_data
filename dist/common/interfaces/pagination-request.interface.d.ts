/** Query parameters common to cursor-paginated HTTP endpoints. */
export interface PaginationRequest {
    limit?: number;
    cursor?: string;
    q?: string;
    search?: string;
    filters?: Record<string, string | number | boolean>;
}
