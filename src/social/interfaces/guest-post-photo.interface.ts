import type { MediaComposition } from '../../media';
import type { PhotoFile } from './internal/photo-file.interface';
import type { PhotoTag } from './photo-tag.interface';

export interface GuestPostPhoto<TTimestamp = string> {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  created_at: TTimestamp;
  position: number;
  composition?: MediaComposition | null;
  file: PhotoFile;
  tags: PhotoTag[];
}
