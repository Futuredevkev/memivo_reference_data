export interface CreatePollRequest {
  albumId: string;
  question: string;
  options: string[];
  durationMinutes: number;
}
