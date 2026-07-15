import type { EmailRequest } from './email-request.interface';

export interface ResetPasswordRequest extends EmailRequest {
  code: string;
  password: string;
  confirmPassword: string;
}
