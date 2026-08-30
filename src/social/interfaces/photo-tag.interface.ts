import type { SocialAuthor } from './social-author.interface';

export interface PhotoTag {
  id: string;
  userId: string;
  photoId: string;
  x: number;
  y: number;
  user: Omit<SocialAuthor, 'albumRole'>;
}
