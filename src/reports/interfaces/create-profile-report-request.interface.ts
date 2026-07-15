import type { ProfileReportReason } from '../enums';

export interface CreateProfileReportRequest {
  reportedUserId: string;
  reason: ProfileReportReason;
  description?: string;
}
