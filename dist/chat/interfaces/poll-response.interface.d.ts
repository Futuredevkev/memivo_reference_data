import type { PollStatus } from '../enums';
import type { PollOption } from './poll-option.interface';
/** Poll payload shared by REST responses and chat socket broadcasts. */
export interface PollResponse<TTimestamp = string> {
    id: string;
    question: string;
    chatGroupId: string;
    status: PollStatus;
    expiresAt: TTimestamp | null;
    durationMinutes: number;
    options: PollOption[];
    messageId?: string | null;
    created_at: TTimestamp;
}
