import type { AlbumMemberRole } from '../enums';

export interface AlbumGuest<TTimestamp = string> {
  id: string;
  name: string;
  lastName: string;
  avatar: string | null;
  scannedAt: TTimestamp;
  role?: AlbumMemberRole;
  isCreator?: boolean;
  isOrganizer?: boolean;
}
