export interface DisableTwoFactorRequest {
  totp?: string;
  password: string;
}
