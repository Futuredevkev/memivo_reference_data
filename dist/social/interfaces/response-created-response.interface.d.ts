import type { ResponseData } from './response-data.interface';
export interface ResponseCreatedResponse<TTimestamp = string> extends ResponseData<TTimestamp> {
    responsesCount: number;
}
