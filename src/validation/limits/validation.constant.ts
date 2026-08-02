import { ALBUM_DESCRIPTION_MAX } from './album-description-max.constant';
import { ALBUM_ACCESS_PASSWORD_MAX } from './album-access-password-max.constant';
import { ALBUM_ACCESS_PASSWORD_MIN } from './album-access-password-min.constant';
import { ALBUM_MEMBER_BATCH_MAX } from './album-member-batch-max.constant';
import { ALBUM_TITLE_MAX } from './album-title-max.constant';
import { ALBUM_TITLE_MIN } from './album-title-min.constant';
import { BATCH_MIN_ITEMS } from './batch-min-items.constant';
import { CHAT_CAPTION_MAX } from './chat-caption-max.constant';
import { CHAT_MESSAGE_MAX } from './chat-message-max.constant';
import { COMMENT_MAX } from './comment-max.constant';
import { FOLDER_NAME_MAX } from './folder-name-max.constant';
import { GENERIC_BATCH_MAX } from './generic-batch-max.constant';
import { GROUP_NAME_MAX } from './group-name-max.constant';
import { MIN_AGE_YEARS } from './min-age-years.constant';
import { PASSWORD_MAX } from './password-max.constant';
import { PASSWORD_MIN } from './password-min.constant';
import { POLL_DEFAULT_DURATION_MINUTES } from './poll-default-duration-minutes.constant';
import { POLL_DURATION_MAX_MINUTES } from './poll-duration-max-minutes.constant';
import { POLL_DURATION_MIN_MINUTES } from './poll-duration-min-minutes.constant';
import { POLL_OPTIONS_MAX } from './poll-options-max.constant';
import { POLL_OPTIONS_MIN } from './poll-options-min.constant';
import { POLL_OPTION_MAX } from './poll-option-max.constant';
import { POLL_QUESTION_MAX } from './poll-question-max.constant';
import { POLL_QUESTION_MIN } from './poll-question-min.constant';
import { POST_DESCRIPTION_MAX } from './post-description-max.constant';
import { PROFILE_NAME_MAX } from './profile-name-max.constant';
import { PROFILE_NAME_MIN } from './profile-name-min.constant';
import { PROFILE_REPORT_DETAILS_MAX } from './profile-report-details-max.constant';
import { PROFILE_URL_MAX } from './profile-url-max.constant';
import { RESPONSE_MAX } from './response-max.constant';
import { STORY_CAPTION_MAX } from './story-caption-max.constant';
import { VERIFICATION_CODE_LENGTH } from './verification-code-length.constant';

export const VALIDATION = {
  PROFILE_NAME_MIN,
  PROFILE_NAME_MAX,
  PROFILE_URL_MAX,
  MIN_AGE_YEARS,
  ALBUM_TITLE_MIN,
  ALBUM_TITLE_MAX,
  ALBUM_DESCRIPTION_MAX,
  ALBUM_ACCESS_PASSWORD_MIN,
  ALBUM_ACCESS_PASSWORD_MAX,
  BATCH_MIN_ITEMS,
  ALBUM_MEMBER_BATCH_MAX,
  GENERIC_BATCH_MAX,
  POLL_QUESTION_MIN,
  POLL_QUESTION_MAX,
  POLL_OPTION_MAX,
  POLL_OPTIONS_MIN,
  POLL_OPTIONS_MAX,
  POLL_DURATION_MIN_MINUTES,
  POLL_DURATION_MAX_MINUTES,
  POLL_DEFAULT_DURATION_MINUTES,
  GROUP_NAME_MAX,
  FOLDER_NAME_MAX,
  COMMENT_MAX,
  RESPONSE_MAX,
  POST_DESCRIPTION_MAX,
  PROFILE_REPORT_DETAILS_MAX,
  CHAT_MESSAGE_MAX,
  CHAT_CAPTION_MAX,
  STORY_CAPTION_MAX,
  VERIFICATION_CODE_LENGTH,
  PASSWORD_MIN,
  PASSWORD_MAX,
} as const;
