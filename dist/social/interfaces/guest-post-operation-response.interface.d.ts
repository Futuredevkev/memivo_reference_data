import type { GuestPostResponse } from './guest-post-response.interface';
export interface GuestPostOperationResponse<TTimestamp = string> {
    message: string;
    post: GuestPostResponse<TTimestamp>;
}
