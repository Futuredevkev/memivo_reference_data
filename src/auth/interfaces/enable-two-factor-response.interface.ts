import type { MessageResponse } from '../../common';

export interface EnableTwoFactorResponse extends MessageResponse {
  backupCodes?: string[];
}
