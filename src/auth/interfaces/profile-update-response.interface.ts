export interface ProfileUpdateResponse<TUser> {
  message: string;
  user?: TUser;
  requiresVerification?: boolean;
}
