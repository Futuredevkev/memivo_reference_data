import type { ErrorCode } from '../../errors';
export interface SocketRateLimitPayload {
    event?: string;
    errorCode: ErrorCode;
    message: string;
    retryAfterMs: number;
}
