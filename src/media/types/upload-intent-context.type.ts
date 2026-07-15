import type { UPLOAD_INTENT_CONTEXTS } from '../constants';

export type UploadIntentContext = `${(typeof UPLOAD_INTENT_CONTEXTS)[number]}`;
