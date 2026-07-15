export interface StoryTagResponse {
  id: string;
  storyId: string;
  userId: string;
  x: number;
  y: number;
  user: {
    id: string;
    name: string;
    lastName: string;
    avatar: { url: string } | null;
  };
}
