import type { SocialAuthor } from './social-author.interface';
export interface PostLikerResponse<TTimestamp = string> {
    id: string;
    userId: string;
    guestPostId: string;
    created_at: TTimestamp;
    updated_at: TTimestamp;
    user: Omit<SocialAuthor, 'albumRole' | 'roles'>;
}
