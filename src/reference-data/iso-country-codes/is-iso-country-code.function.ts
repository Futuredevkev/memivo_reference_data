import { ISO_COUNTRY_CODE_SET } from './internal/iso-country-code-set.constant';
import type { IsoCountryCode } from './iso-country-code.type';

export const isIsoCountryCode = (value: string): value is IsoCountryCode =>
  ISO_COUNTRY_CODE_SET.has(value);
