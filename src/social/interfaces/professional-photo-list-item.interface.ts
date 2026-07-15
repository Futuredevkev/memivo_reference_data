import type { PhotoFile } from './internal/photo-file.interface';

export interface ProfessionalPhotoListItem<TTimestamp = string> {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  created_at: TTimestamp;
  file?: PhotoFile;
}
