import { UploadContext } from '../enums';
import { FILTERABLE_UPLOAD_CONTEXT_VALUES } from './internal/filterable-upload-context-values.constant';

export const FILTERABLE_UPLOAD_CONTEXTS: ReadonlySet<`${UploadContext}`> = new Set(
  FILTERABLE_UPLOAD_CONTEXT_VALUES,
);
