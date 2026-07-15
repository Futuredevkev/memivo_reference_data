import type { LanguageCode } from '../../common';

export interface UpdateDeviceLocalePayload {
  language?: LanguageCode;
  timeZone?: string;
}
