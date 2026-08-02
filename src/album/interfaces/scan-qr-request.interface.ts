export interface ScanQrRequest {
  qrCode: string;
  /** Required only when the target album is password-protected. */
  password?: string;
}
