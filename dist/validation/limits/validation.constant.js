"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION = void 0;
const album_description_max_constant_1 = require("./album-description-max.constant");
const album_member_batch_max_constant_1 = require("./album-member-batch-max.constant");
const album_title_max_constant_1 = require("./album-title-max.constant");
const album_title_min_constant_1 = require("./album-title-min.constant");
const batch_min_items_constant_1 = require("./batch-min-items.constant");
const chat_caption_max_constant_1 = require("./chat-caption-max.constant");
const chat_message_max_constant_1 = require("./chat-message-max.constant");
const comment_max_constant_1 = require("./comment-max.constant");
const folder_name_max_constant_1 = require("./folder-name-max.constant");
const generic_batch_max_constant_1 = require("./generic-batch-max.constant");
const group_name_max_constant_1 = require("./group-name-max.constant");
const min_age_years_constant_1 = require("./min-age-years.constant");
const password_max_constant_1 = require("./password-max.constant");
const password_min_constant_1 = require("./password-min.constant");
const poll_default_duration_minutes_constant_1 = require("./poll-default-duration-minutes.constant");
const poll_duration_max_minutes_constant_1 = require("./poll-duration-max-minutes.constant");
const poll_duration_min_minutes_constant_1 = require("./poll-duration-min-minutes.constant");
const poll_options_max_constant_1 = require("./poll-options-max.constant");
const poll_options_min_constant_1 = require("./poll-options-min.constant");
const poll_option_max_constant_1 = require("./poll-option-max.constant");
const poll_question_max_constant_1 = require("./poll-question-max.constant");
const poll_question_min_constant_1 = require("./poll-question-min.constant");
const post_description_max_constant_1 = require("./post-description-max.constant");
const profile_name_max_constant_1 = require("./profile-name-max.constant");
const profile_name_min_constant_1 = require("./profile-name-min.constant");
const profile_report_details_max_constant_1 = require("./profile-report-details-max.constant");
const profile_url_max_constant_1 = require("./profile-url-max.constant");
const response_max_constant_1 = require("./response-max.constant");
const story_caption_max_constant_1 = require("./story-caption-max.constant");
const verification_code_length_constant_1 = require("./verification-code-length.constant");
exports.VALIDATION = {
    PROFILE_NAME_MIN: profile_name_min_constant_1.PROFILE_NAME_MIN,
    PROFILE_NAME_MAX: profile_name_max_constant_1.PROFILE_NAME_MAX,
    PROFILE_URL_MAX: profile_url_max_constant_1.PROFILE_URL_MAX,
    MIN_AGE_YEARS: min_age_years_constant_1.MIN_AGE_YEARS,
    ALBUM_TITLE_MIN: album_title_min_constant_1.ALBUM_TITLE_MIN,
    ALBUM_TITLE_MAX: album_title_max_constant_1.ALBUM_TITLE_MAX,
    ALBUM_DESCRIPTION_MAX: album_description_max_constant_1.ALBUM_DESCRIPTION_MAX,
    BATCH_MIN_ITEMS: batch_min_items_constant_1.BATCH_MIN_ITEMS,
    ALBUM_MEMBER_BATCH_MAX: album_member_batch_max_constant_1.ALBUM_MEMBER_BATCH_MAX,
    GENERIC_BATCH_MAX: generic_batch_max_constant_1.GENERIC_BATCH_MAX,
    POLL_QUESTION_MIN: poll_question_min_constant_1.POLL_QUESTION_MIN,
    POLL_QUESTION_MAX: poll_question_max_constant_1.POLL_QUESTION_MAX,
    POLL_OPTION_MAX: poll_option_max_constant_1.POLL_OPTION_MAX,
    POLL_OPTIONS_MIN: poll_options_min_constant_1.POLL_OPTIONS_MIN,
    POLL_OPTIONS_MAX: poll_options_max_constant_1.POLL_OPTIONS_MAX,
    POLL_DURATION_MIN_MINUTES: poll_duration_min_minutes_constant_1.POLL_DURATION_MIN_MINUTES,
    POLL_DURATION_MAX_MINUTES: poll_duration_max_minutes_constant_1.POLL_DURATION_MAX_MINUTES,
    POLL_DEFAULT_DURATION_MINUTES: poll_default_duration_minutes_constant_1.POLL_DEFAULT_DURATION_MINUTES,
    GROUP_NAME_MAX: group_name_max_constant_1.GROUP_NAME_MAX,
    FOLDER_NAME_MAX: folder_name_max_constant_1.FOLDER_NAME_MAX,
    COMMENT_MAX: comment_max_constant_1.COMMENT_MAX,
    RESPONSE_MAX: response_max_constant_1.RESPONSE_MAX,
    POST_DESCRIPTION_MAX: post_description_max_constant_1.POST_DESCRIPTION_MAX,
    PROFILE_REPORT_DETAILS_MAX: profile_report_details_max_constant_1.PROFILE_REPORT_DETAILS_MAX,
    CHAT_MESSAGE_MAX: chat_message_max_constant_1.CHAT_MESSAGE_MAX,
    CHAT_CAPTION_MAX: chat_caption_max_constant_1.CHAT_CAPTION_MAX,
    STORY_CAPTION_MAX: story_caption_max_constant_1.STORY_CAPTION_MAX,
    VERIFICATION_CODE_LENGTH: verification_code_length_constant_1.VERIFICATION_CODE_LENGTH,
    PASSWORD_MIN: password_min_constant_1.PASSWORD_MIN,
    PASSWORD_MAX: password_max_constant_1.PASSWORD_MAX,
};
