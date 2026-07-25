import type { AlbumMemberRole } from '../../album';
import type { HighlightComment } from './highlight-comment.interface';
import type { HighlightPost } from './highlight-post.interface';
import type { HighlightStory } from './highlight-story.interface';
import type { HighlightStoryPoll } from './highlight-story-poll.interface';
import type { HighlightUser } from './highlight-user.interface';

export interface AlbumHighlights<
  TTimestamp = string,
  TRole extends string = AlbumMemberRole,
> {
  funniestComment: HighlightComment<TTimestamp, TRole> | null;
  leastFunnyComment: HighlightComment<TTimestamp, TRole> | null;
  mostLikedPost: HighlightPost<TTimestamp, TRole> | null;
  mostCommentedPost: HighlightPost<TTimestamp, TRole> | null;
  mostReactedPost: HighlightPost<TTimestamp, TRole> | null;
  mostRepliedComment: HighlightComment<TTimestamp, TRole> | null;
  postWithMostPhotos: HighlightPost<TTimestamp, TRole> | null;
  firstPost: HighlightPost<TTimestamp, TRole> | null;
  mostCommentedStory: HighlightStory<TTimestamp, TRole> | null;
  mostVotedStoryPoll: HighlightStoryPoll<TTimestamp, TRole> | null;
  mostInteractiveUser: HighlightUser<TRole> | null;
  updated_at: TTimestamp;
}
