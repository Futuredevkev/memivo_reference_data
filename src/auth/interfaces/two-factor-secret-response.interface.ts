export interface TwoFactorSecretResponse {
  secret: string;
  qrCodeUrl: string;
  otpAuthUrl?: string;
}
