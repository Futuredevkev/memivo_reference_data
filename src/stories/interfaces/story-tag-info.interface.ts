export interface StoryTagInfo {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    lastName: string;
    avatarUrl?: string;
  };
  x: number;
  y: number;
}
