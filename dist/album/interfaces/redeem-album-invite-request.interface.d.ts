export interface RedeemAlbumInviteRequest {
    token: string;
    /** Required only when the target album is password-protected. */
    password?: string;
}
